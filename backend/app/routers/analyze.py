"""
CflatMinor — Analyze Router
=============================

Handles the POST /analyze endpoint:
1. Receives an audio file upload
2. Validates file type and size
3. Saves temporarily
4. Runs audio analysis **in a thread pool** (non-blocking)
5. Returns structured results
6. Cleans up temp file

Critical design decision:
    librosa.load() is CPU-bound and blocking. We use asyncio.to_thread()
    to offload it so it never blocks the ASGI event loop. An asyncio
    timeout wrapper prevents infinite hangs.
"""

import asyncio
import logging
import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.models.schemas import AnalysisResponse, ErrorResponse
from app.services.audio_analyzer import analyze_audio

logger = logging.getLogger("cflatminor.analyze")

router = APIRouter()

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

ALLOWED_EXTENSIONS = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".wma"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
ANALYSIS_TIMEOUT = 120  # seconds — hard cap on how long analysis can take


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Analyze an audio file for instrument detection",
)
async def analyze_endpoint(file: UploadFile = File(...)):
    """
    Upload an audio file (MP3, WAV, FLAC, OGG, M4A) and receive
    instrument detection results with confidence percentages.
    """
    # ── Validate file extension ──────────────────────────────────────────
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    # ── Read and validate file size ──────────────────────────────────────
    try:
        content = await file.read()
    except Exception as e:
        logger.error("Failed to read uploaded file: %s", e)
        raise HTTPException(status_code=400, detail="Failed to read uploaded file")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({len(content) / 1024 / 1024:.1f} MB). Maximum: {MAX_FILE_SIZE / 1024 / 1024:.0f} MB",
        )

    logger.info("Received file: %s (%s, %.1f MB)", file.filename, ext, len(content) / 1024 / 1024)

    # ── Save to temporary file ───────────────────────────────────────────
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    temp_filename = f"{uuid.uuid4().hex}{ext}"
    temp_path = os.path.join(UPLOADS_DIR, temp_filename)

    try:
        with open(temp_path, "wb") as f:
            f.write(content)

        # ── Run analysis in thread pool with timeout ─────────────────────
        # asyncio.to_thread() moves the CPU-bound librosa work off the
        # event loop. asyncio.wait_for() adds a hard timeout so we never
        # hang indefinitely.
        logger.info("Starting analysis for %s...", file.filename)
        try:
            result = await asyncio.wait_for(
                asyncio.to_thread(analyze_audio, temp_path),
                timeout=ANALYSIS_TIMEOUT,
            )
        except asyncio.TimeoutError:
            logger.error("Analysis timed out after %ds for %s", ANALYSIS_TIMEOUT, file.filename)
            return JSONResponse(
                status_code=504,
                content={
                    "success": False,
                    "error": f"Analysis timed out after {ANALYSIS_TIMEOUT} seconds. Try a shorter or smaller file.",
                },
            )

        logger.info("Analysis complete for %s (%.1fs duration)", file.filename, result["duration_seconds"])

        return AnalysisResponse(
            success=True,
            filename=file.filename,
            duration_seconds=result["duration_seconds"],
            instruments=result["instruments"],
            metadata=result["metadata"],
        )

    except HTTPException:
        raise
    except RuntimeError as e:
        logger.error("Runtime error analyzing %s: %s", file.filename, e)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)},
        )
    except Exception as e:
        logger.exception("Unexpected error analyzing %s", file.filename)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Analysis failed: {type(e).__name__}: {e}"},
        )
    finally:
        # ── Cleanup temp file ────────────────────────────────────────────
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except OSError as e:
            logger.warning("Failed to cleanup temp file %s: %s", temp_path, e)
