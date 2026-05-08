"""Generate a test WAV file for testing the analyze endpoint."""
import numpy as np
import soundfile as sf

sr = 22050
duration = 2  # seconds
t = np.linspace(0, duration, duration * sr, dtype=np.float32)

# Mix of frequencies to simulate a simple tone
y = (
    0.5 * np.sin(2 * np.pi * 440 * t)   # A4
    + 0.3 * np.sin(2 * np.pi * 880 * t)  # A5
    + 0.2 * np.sin(2 * np.pi * 330 * t)  # E4
).astype(np.float32)

sf.write("test_audio.wav", y, sr)
print(f"Created test_audio.wav ({len(y)} samples, {duration}s, {sr}Hz)")
