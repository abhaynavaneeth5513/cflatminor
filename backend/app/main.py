"""
CflatMinor Backend — FastAPI Application Entry Point
=====================================================

Main application file that configures:
- CORS middleware for frontend communication
- Router mounting for API endpoints
- Health check endpoint
- Startup/shutdown lifecycle events
- Structured logging
"""

import logging
import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import analyze

# ── Logging ──────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)

logger = logging.getLogger("cflatminor")

# ── Uploads Directory ────────────────────────────────────────────────────

UPLOADS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "uploads"
)

# ── Cleanup Utility ──────────────────────────────────────────────────────

def cleanup_stale_uploads(max_age_seconds: int = 3600) -> int:
    """
    Remove temporary uploaded files older than max_age_seconds.
    """

    if not os.path.isdir(UPLOADS_DIR):
        return 0

    now = time.time()
    removed = 0

    for filename in os.listdir(UPLOADS_DIR):

        file_path = os.path.join(UPLOADS_DIR, filename)

        try:
            if (
                os.path.isfile(file_path)
                and (now - os.path.getmtime(file_path)) > max_age_seconds
            ):
                os.remove(file_path)
                removed += 1

        except OSError:
            pass

    return removed

# ── App Lifespan ─────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):

    # Startup
    os.makedirs(UPLOADS_DIR, exist_ok=True)

    cleaned = cleanup_stale_uploads()

    logger.info(
        "CflatMinor Backend Started — Uploads: %s | Cleaned %d files",
        UPLOADS_DIR,
        cleaned,
    )

    yield

    # Shutdown
    cleaned = cleanup_stale_uploads(max_age_seconds=0)

    logger.info(
        "CflatMinor Backend Shutting Down — Cleaned %d files",
        cleaned,
    )

# ── FastAPI App ──────────────────────────────────────────────────────────

app = FastAPI(
    title="CflatMinor API",
    description="AI-powered music analysis backend",
    version="0.2.0",
    lifespan=lifespan,
)

# ── CORS Middleware ──────────────────────────────────────────────────────
# IMPORTANT:
# This allows:
# - localhost frontend
# - Vercel frontend
# - mobile access
# - global deployment

app.add_middleware(
    CORSMiddleware,

    # TEMPORARY OPEN ACCESS FOR TESTING
    allow_origins=["*"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────

app.include_router(analyze.router)

# ── Global Exception Handler ─────────────────────────────────────────────

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    logger.exception(
        "Unhandled exception on %s %s",
        request.method,
        request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": f"Internal server error: {type(exc).__name__}",
            "detail": str(exc)[:500],
        },
    )

# ── Root Endpoint ────────────────────────────────────────────────────────

@app.get("/")
async def root():

    return {
        "success": True,
        "message": "CflatMinor Backend Running 🚀",
    }

# ── Health Check ─────────────────────────────────────────────────────────

@app.get("/health")
async def health_check():

    import shutil

    ffmpeg_available = shutil.which("ffmpeg") is not None

    return {
        "status": "healthy",
        "service": "cflatminor-backend",
        "version": "0.2.0",
        "ffmpeg_available": ffmpeg_available,
    }