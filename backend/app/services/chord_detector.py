"""
CflatMinor — Chord Detection Service
======================================

Estimates chord progressions from audio using chroma features.
Uses librosa's chroma_cqt and maps to chord templates.
"""

from __future__ import annotations

import logging
import numpy as np

logger = logging.getLogger("cflatminor.chords")

# Major and minor chord templates (triads mapped to chroma bins)
CHORD_TEMPLATES = {}
NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

for i, note in enumerate(NOTE_NAMES):
    # Major triad: root, major third (+4), perfect fifth (+7)
    major = np.zeros(12)
    major[i] = 1.0
    major[(i + 4) % 12] = 1.0
    major[(i + 7) % 12] = 1.0
    CHORD_TEMPLATES[f"{note}"] = major / np.linalg.norm(major)

    # Minor triad: root, minor third (+3), perfect fifth (+7)
    minor = np.zeros(12)
    minor[i] = 1.0
    minor[(i + 3) % 12] = 1.0
    minor[(i + 7) % 12] = 1.0
    CHORD_TEMPLATES[f"{note}m"] = minor / np.linalg.norm(minor)


def detect_chords(y: np.ndarray, sr: int, hop_length: int = 2048) -> list[dict]:
    """
    Detect chord progression from audio signal.

    Returns a list of chord events:
      [{"time": 0.0, "duration": 2.5, "chord": "Am", "confidence": 0.82}, ...]
    """
    import librosa

    # Compute chroma features with larger hop for chord-level resolution
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)
    times = librosa.frames_to_time(np.arange(chroma.shape[1]), sr=sr, hop_length=hop_length)

    if chroma.shape[1] == 0:
        return []

    # Match each frame to the best chord template
    raw_chords = []
    for frame_idx in range(chroma.shape[1]):
        frame = chroma[:, frame_idx]
        frame_norm = np.linalg.norm(frame)

        if frame_norm < 0.01:
            raw_chords.append(("N", 0.0))  # No chord / silence
            continue

        frame_normalized = frame / frame_norm
        best_chord = "N"
        best_score = -1.0

        for chord_name, template in CHORD_TEMPLATES.items():
            score = float(np.dot(frame_normalized, template))
            if score > best_score:
                best_score = score
                best_chord = chord_name

        raw_chords.append((best_chord, best_score))

    # Merge consecutive identical chords into segments
    segments: list[dict] = []
    if not raw_chords:
        return segments

    current_chord, current_conf = raw_chords[0]
    start_time = times[0] if len(times) > 0 else 0.0
    conf_sum = current_conf
    conf_count = 1

    for i in range(1, len(raw_chords)):
        chord, conf = raw_chords[i]
        t = times[i] if i < len(times) else times[-1]

        if chord == current_chord:
            conf_sum += conf
            conf_count += 1
        else:
            if current_chord != "N":
                segments.append({
                    "time": round(start_time, 2),
                    "duration": round(t - start_time, 2),
                    "chord": current_chord,
                    "confidence": round(conf_sum / conf_count, 2),
                })
            current_chord = chord
            start_time = t
            conf_sum = conf
            conf_count = 1

    # Append last segment
    if current_chord != "N" and len(times) > 0:
        end_time = times[-1] + (hop_length / sr)
        segments.append({
            "time": round(start_time, 2),
            "duration": round(end_time - start_time, 2),
            "chord": current_chord,
            "confidence": round(conf_sum / conf_count, 2),
        })

    # Filter out very short chords (< 0.3s) as noise
    segments = [s for s in segments if s["duration"] >= 0.3]

    logger.info("Detected %d chord segments", len(segments))
    return segments


def get_chord_summary(chords: list[dict]) -> list[str]:
    """Extract unique chord progression (ordered by first appearance)."""
    seen = set()
    progression = []
    for c in chords:
        if c["chord"] not in seen:
            seen.add(c["chord"])
            progression.append(c["chord"])
    return progression
