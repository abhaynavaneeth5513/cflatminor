const FETCH_TIMEOUT_MS = 200_000; // 200 seconds

/** Maximum allowed file size (matches backend) */
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

/** Railway Backend URL */
const API_BASE_URL =
  "https://cflatminor-production.up.railway.app";

// ── Response Types ──────────────────────────────────────────────────────

export interface AnalysisResult {
  success: true;
  filename: string;
  duration_seconds: number;
  instruments: Record<string, number>;

  timeline?: Array<{
    timestamp: number;
    instrument: string;
    confidence: number;
  }>;

  sections?: Array<{
    start: number;
    end: number;
    label: string;
  }>;

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

// ── Type Guards ─────────────────────────────────────────────────────────

export function isApiError(
  response: AnalysisResponse
): response is ApiError {
  return !response.success;
}

// ── API Functions ───────────────────────────────────────────────────────

/**
 * Upload audio file for AI analysis
 */
export async function analyzeAudio(
  file: File
): Promise<AnalysisResponse> {
  
  // ── Client Validation ───────────────────────────────────────────

  if (file.size === 0) {
    return {
      success: false,
      error: "File is empty.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File too large (${formatFileSize(
        file.size
      )}). Maximum allowed size is 50 MB.`,
    };
  }

  if (!isAllowedAudioFile(file)) {
    return {
      success: false,
      error:
        "Unsupported file type. Please upload MP3, WAV, FLAC, OGG, M4A, AAC, or WMA.",
    };
  }

  // ── Build FormData ──────────────────────────────────────────────

  const formData = new FormData();
  formData.append("file", file);

  // ── Setup Timeout ───────────────────────────────────────────────

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, FETCH_TIMEOUT_MS);

  let response: Response;

  // ── API Request ─────────────────────────────────────────────────

  try {
    response = await fetch(
      `${API_BASE_URL}/analyze`,
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }
    );
  } catch (err) {

    clearTimeout(timeout);

    if (
      err instanceof DOMException &&
      err.name === "AbortError"
    ) {
      return {
        success: false,
        error:
          "Analysis timed out. The file may be too large or complex. Try a shorter clip.",
      };
    }

    return {
      success: false,
      error:
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Network error — please check your internet connection.",
    };
  }

  clearTimeout(timeout);

  // ── Read Response Safely ────────────────────────────────────────

  let responseText: string;

  try {
    responseText = await response.text();
  } catch {
    return {
      success: false,
      error: "Failed to read server response.",
    };
  }

  // ── Empty Response Guard ────────────────────────────────────────

  if (!responseText || responseText.trim() === "") {
    return {
      success: false,
      error: "Server returned an empty response.",
    };
  }

  // ── Parse JSON Safely ───────────────────────────────────────────

  let data: Record<string, unknown>;

  try {
    data = JSON.parse(responseText);
  } catch {
    return {
      success: false,
      error: "Server returned invalid JSON.",
      detail: responseText.slice(0, 300),
    };
  }

  // ── Handle API Errors ───────────────────────────────────────────

  if (!response.ok || data.success === false) {
    return {
      success: false,
      error:
        (data.error as string) ||
        (data.detail as string) ||
        `Server error (${response.status})`,
    };
  }

  // ── Success ─────────────────────────────────────────────────────

  return data as unknown as AnalysisResult;
}

// ── Utility Functions ───────────────────────────────────────────────────

/**
 * Format bytes into readable string
 */
export function formatFileSize(bytes: number): string {

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validate supported audio formats
 */
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