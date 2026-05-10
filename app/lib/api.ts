const FETCH_TIMEOUT_MS = 200000;

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export interface AnalysisSection {
  start: number;
  end: number;
  label: string;
}

export interface AnalysisChord {
  timestamp: number;
  chord: string;
}

export interface AnalysisTimelineEvent {
  timestamp: number;
  instrument: string;
  confidence: number;
}

export interface AnalysisResult {
  success: true;
  filename: string;
  duration_seconds: number;
  instruments: Record<string, number>;
  timeline?: AnalysisTimelineEvent[];
  sections?: AnalysisSection[];
  chords?: AnalysisChord[];
  metadata: {
    sample_rate: number;
    tempo_bpm: number;
    duration_seconds: number;
    key: string;
    scale: string;
    time_signature: string;
    loudness_db: number;
    rms_energy: number;
    spectral_centroid: number;
    spectral_rolloff: number;
    zero_crossing_rate: number;
    dominant_frequencies: number[];
    harmonic_percussive_ratio: number;
    danceability: number;
    energy: number;
    brightness: number;
    acousticness: number;
    instrumentalness: number;
  } | null;
}

export interface ApiError {
  success: false;
  error: string;
  detail?: string;
}

export type AnalysisResponse = AnalysisResult | ApiError;

export function isApiError(
  response: AnalysisResponse
): response is ApiError {
  return !response.success;
}

export async function analyzeAudio(
  file: File
): Promise<AnalysisResponse> {

  if (file.size === 0) {
    return {
      success: false,
      error: "File is empty.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "File too large.",
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT_MS);

  try {

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    return data;

  } catch (err) {

    clearTimeout(timeout);

    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Unknown error occurred.",
    };
  }
}
export function formatFileSize(bytes: number): string {

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAllowedAudioFile(file: File): boolean {

  const allowedExtensions = [
    ".mp3",
    ".wav",
    ".flac",
    ".ogg",
    ".m4a",
    ".aac",
    ".wma",
  ];

  const extension =
    "." + file.name.split(".").pop()?.toLowerCase();

  return allowedExtensions.includes(extension);
}
export async function analyzeUrl(
  url: string
): Promise<AnalysisResponse> {

  try {

    const response = await fetch("/api/analyze_url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    return data;

  } catch (err) {

    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "URL analysis failed.",
    };
  }
}