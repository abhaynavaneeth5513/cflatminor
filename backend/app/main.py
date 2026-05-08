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

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")


def _cleanup_stale_uploads(max_age_seconds: int = 3600) -> int:
    """Remove temp files older than *max_age_seconds*. Returns count deleted."""
    if not os.path.isdir(UPLOADS_DIR):
        return 0
    now = time.time()
    removed = 0
    for fname in os.listdir(UPLOADS_DIR):
        fpath = os.path.join(UPLOADS_DIR, fname)
        try:
            if os.path.isfile(fpath) and (now - os.path.getmtime(fpath)) > max_age_seconds:
                os.remove(fpath)
                removed += 1
        except OSError:
            pass
    return removed


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Manage application startup and shutdown."""
    # Startup: ensure uploads directory exists and clean stale files
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    stale = _cleanup_stale_uploads()
    logger.info("CflatMinor Backend started — uploads dir: %s (cleaned %d stale files)", UPLOADS_DIR, stale)
    yield
    # Shutdown: cleanup
    stale = _cleanup_stale_uploads(max_age_seconds=0)
    logger.info("CflatMinor Backend shutting down (cleaned %d files)", stale)


app = FastAPI(
    title="CflatMinor API",
    description="AI-powered music analysis backend",
    version="0.2.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — Allow the Next.js frontend (localhost:3000) to call the backend
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(analyze.router)


# ---------------------------------------------------------------------------
# Global exception handler — never return non-JSON to the proxy
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": f"Internal server error: {type(exc).__name__}",
            "detail": str(exc)[:500],
        },
    )


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health")
async def health_check():
    """Quick liveness probe."""
    import shutil

    ffmpeg_available = shutil.which("ffmpeg") is not None
    return {
        "status": "healthy",
        "service": "cflatminor-backend",
        "version": "0.2.0",
        "ffmpeg_available": ffmpeg_available,
    }
