# CflatMinor 🎵

**AI-Powered Music Analysis Platform**

Upload songs and discover the instruments within them using AI-powered audio analysis. Detect piano, guitar, drums, vocals, bass, strings, synths, and more.

## Architecture

```
cflatminor/
├── app/                    # Next.js 16 Frontend (App Router + TypeScript + Tailwind)
│   ├── api/analyze/        # API proxy route (forwards to backend)
│   ├── components/         # React components
│   ├── lib/                # API client & utilities
│   ├── globals.css         # Design system
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── backend/                # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # Audio analysis logic
│   │   └── models/         # Pydantic schemas
│   ├── uploads/            # Temporary file storage (gitignored)
│   └── requirements.txt    # Python dependencies
└── public/                 # Static assets
```

## Quick Start

### Prerequisites

- **Node.js** 18+ (v22.14.0 confirmed working)
- **Python** 3.10+ (3.11 or 3.12 recommended)
- **FFmpeg** (required for MP3 support)

### 1. Install FFmpeg (for MP3 support)

```bash
# Windows (winget — recommended)
winget install Gyan.FFmpeg

# Windows (chocolatey)
choco install ffmpeg

# Verify installation
ffmpeg -version
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Start backend server (port 8000)
python -m uvicorn app.main:app --reload --port 8000
```

The backend will be available at **http://localhost:8000**  
Swagger docs at **http://localhost:8000/docs**

### 3. Frontend Setup

```bash
# From project root (not backend/)
cd ..

# Install Node dependencies (if not already done)
npm install

# Start development server (port 3000)
npm run dev
```

The frontend will be available at **http://localhost:3000**

### 4. Use the App

1. Open **http://localhost:3000** in your browser
2. Drag & drop an audio file (MP3, WAV, FLAC, OGG, M4A)
3. Click "Analyze Instruments"
4. View the detected instruments and their confidence percentages

## API Endpoints

| Method | Path               | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/health`          | Backend health check           |
| POST   | `/analyze`         | Upload & analyze audio file    |
| GET    | `/docs`            | Swagger API documentation      |
| POST   | `/api/analyze`     | Next.js proxy → backend        |

## Testing the API Directly

```bash
# Health check
curl http://localhost:8000/health

# Analyze a file (replace with your file path)
curl -X POST -F "file=@path/to/song.mp3" http://localhost:8000/analyze
```

## How It Works

```
Browser → Next.js (localhost:3000) → API Route (/api/analyze)
                                        ↓
                                   FastAPI (localhost:8000/analyze)
                                        ↓
                                   librosa audio analysis
                                        ↓
                                   Spectral feature extraction
                                        ↓
                                   Instrument heuristic model
                                        ↓
                                   JSON response with instruments
```

The audio analysis pipeline:
1. **Load audio** — librosa loads the file (with ffmpeg for MP3)
2. **Extract features** — spectral centroid, bandwidth, MFCCs, chroma, ZCR, etc.
3. **Map to instruments** — Gaussian scoring model maps features to instrument likelihoods
4. **Normalize** — Results are normalized to sum to 100%

## Tech Stack

| Layer     | Technology              | Purpose                     |
| --------- | ----------------------- | --------------------------- |
| Frontend  | Next.js 16, TypeScript  | UI, routing, API proxy      |
| Styling   | Tailwind CSS 4          | Design system               |
| Backend   | FastAPI, Python         | REST API, file handling     |
| Audio     | librosa, numpy          | Audio feature extraction    |
| Server    | Uvicorn                 | ASGI server                 |

## Troubleshooting

| Issue                          | Solution                                        |
| ------------------------------ | ----------------------------------------------- |
| "Cannot connect to backend"    | Start backend: `python -m uvicorn app.main:app --reload --port 8000` |
| "MP3 decoding failed"          | Install FFmpeg: `winget install Gyan.FFmpeg`     |
| npm command not found          | Use `cmd /c npm run dev` in PowerShell           |
| Port 8000 already in use       | Kill process: `netstat -ano \| findstr :8000` then `taskkill /PID <PID> /F` |
| Port 3000 already in use       | Kill process or use `npm run dev -- --port 3001` |

## Future Roadmap

- [ ] Shazam-like song recognition
- [ ] Humming/singing melody detection
- [ ] YouTube & Spotify URL analysis
- [ ] Live microphone input
- [ ] Waveform visualization
- [ ] Source separation (isolate instruments)
- [ ] AI music insights & recommendations
- [ ] Real ML model (replacing heuristics)
- [ ] User accounts & history
- [ ] Batch analysis

## License

Private project — all rights reserved.
