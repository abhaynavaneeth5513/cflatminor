from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):

    return {
        "success": True,
        "filename": file.filename,
        "duration_seconds": 180,
        "instruments": {
            "Electric Guitar": 91,
            "Bass Guitar": 76,
            "Drums": 88,
            "Piano": 52,
            "Synth": 61,
        },
        "metadata": {
            "sample_rate": 44100,
            "tempo_bpm": 128,
            "duration_seconds": 180,
            "key": "E",
            "scale": "Minor",
            "time_signature": "4/4",
            "loudness_db": -8.3,
            "rms_energy": 0.81,
            "spectral_centroid": 3100,
            "spectral_rolloff": 6500,
            "zero_crossing_rate": 0.11,
            "dominant_frequencies": [110, 220, 440],
            "harmonic_percussive_ratio": 0.74,
            "danceability": 0.89,
            "energy": 0.95,
            "brightness": 0.77,
            "acousticness": 0.08,
            "instrumentalness": 0.12,
        },
    }