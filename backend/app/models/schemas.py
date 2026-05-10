"""
CflatMinor — Pydantic Response Models
======================================

Defines the shape of all API responses so both the backend
and frontend have a reliable contract.
"""

from typing import Any, List, Dict, Optional
from pydantic import BaseModel

class TimelineEvent(BaseModel):
    timestamp: float
    instrument: str
    confidence: float

class Section(BaseModel):
    start: float
    end: float
    label: str  # e.g., "Chorus", "Verse", "Drop"

class Chord(BaseModel):
    timestamp: float
    chord: str

class MusicMetadata(BaseModel):
    sample_rate: int
    tempo_bpm: float
    duration_seconds: float
    key: str
    scale: str
    time_signature: str
    
    # Spectral and Audio Features
    loudness_db: float
    rms_energy: float
    spectral_centroid: float
    spectral_rolloff: float
    zero_crossing_rate: float
    dominant_frequencies: List[float]
    
    # Advanced AI Metrics
    harmonic_percussive_ratio: float
    danceability: float
    energy: float
    brightness: float
    acousticness: float
    instrumentalness: float

class AnalysisResponse(BaseModel):
    """Full response from the /analyze endpoint."""
    success: bool = True
    filename: str
    duration_seconds: float
    instruments: Dict[str, float]  # e.g. {"Piano": 34.2, "Guitar": 28.1, ...}
    timeline: List[TimelineEvent] = []
    sections: List[Section] = []
    chords: List[Chord] = []
    metadata: Optional[MusicMetadata] = None

class ErrorResponse(BaseModel):
    """Standard error response."""
    success: bool = False
    error: str
    detail: Optional[str] = None
