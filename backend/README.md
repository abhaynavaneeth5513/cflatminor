# CflatMinor Backend

FastAPI-powered audio analysis backend for the CflatMinor platform.

## Quick Start

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows PowerShell)
venv\Scripts\Activate.ps1

# Activate (Windows cmd)
venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path       | Description                        |
| ------ | ---------- | ---------------------------------- |
| GET    | `/health`  | Health check                       |
| POST   | `/analyze` | Upload audio file for analysis     |
| GET    | `/docs`    | Interactive Swagger API docs       |
| GET    | `/redoc`   | ReDoc API documentation            |

## Audio Analysis

The analyzer extracts spectral features using librosa and maps them
to instrument likelihoods via a heuristic Gaussian scoring model.

**Supported formats:** MP3, WAV, FLAC, OGG, M4A  
**Max file size:** 50 MB  
**Max duration analyzed:** 120 seconds (first 2 minutes)

### Detected Instruments

- Piano, Guitar, Drums, Bass
- Vocals, Strings, Synth, Brass/Winds

## FFmpeg

FFmpeg is recommended for MP3 support. Without it, the backend will
attempt a pydub fallback, but ffmpeg is more reliable.

```bash
# Windows (winget)
winget install Gyan.FFmpeg

# Windows (chocolatey)
choco install ffmpeg
```
