"""Generate a short test WAV file for integration testing."""
import numpy as np
import soundfile as sf

sr = 22050
duration = 3  # seconds
t = np.linspace(0, duration, duration * sr)

# Mix of sine waves (A4=440Hz, A5=880Hz) + noise
y = (
    0.5 * np.sin(2 * np.pi * 440 * t)
    + 0.3 * np.sin(2 * np.pi * 880 * t)
    + 0.1 * np.random.randn(len(t))
).astype(np.float32)

sf.write("test_audio.wav", y, sr)
print(f"Created test_audio.wav — {len(y)} samples, {duration}s, {sr}Hz")
