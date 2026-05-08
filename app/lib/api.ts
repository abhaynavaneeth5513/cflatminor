/**
 * CflatMinor — API Client Utilities
 * ===================================
 *
 * Typed functions for communicating with the backend via the
 * Next.js API proxy layer. All requests go to /api/* which
 * forwards to the FastAPI backend.
 *
 * Key improvements:
 *   - Frontend timeout with AbortController (3 minutes)
 *   - Safe JSON parsing (never throws on bad response body)
 *   - File size validation before upload
 *   - Typed responses with discriminated unions
 */

// ── Constants ───────────────────────────────────────────────────────────

/** Frontend timeout — slightly longer than the proxy timeout */
const FETCH_TIMEOUT_MS = 200_000; // 200 seconds

/** Maximum allowed file size (matches backend) */
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

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

export function isApiError(response: AnalysisResponse): response is ApiError {
  return !response.success;
}

// ── API Functions ───────────────────────────────────────────────────────

/**
 * Upload an audio file for instrument analysis.
 *
 * @param file - The audio file to analyze (MP3, WAV, FLAC, OGG, M4A)
 * @returns Typed analysis result or error — never throws
 */
export async function analyzeAudio(file: File): Promise<AnalysisResponse> {
  // ── Client-side validation ────────────────────────────────────────
  if (file.size === 0) {
    return { success: false, error: "File is empty." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File too large (${formatFileSize(file.size)}). Maximum is 50 MB.`,
    };
  }

  if (!isAllowedAudioFile(file)) {
    return {
      success: false,
      error: "Unsupported file type. Please upload MP3, WAV, FLAC, OGG, or M4A.",
    };
  }

  // ── Build form data ───────────────────────────────────────────────
  const formData = new FormData();
  formData.append("file", file);

  // ── Fetch with timeout ────────────────────────────────────────────
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof DOMException && err.name === "AbortError") {
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
          : "Network error — please check your connection.",
    };
  }

  clearTimeout(timeout);

  // ── Parse response safely ─────────────────────────────────────────
  let responseText: string;
  try {
    responseText = await response.text();
  } catch {
    return {
      success: false,
      error: "Failed to read server response.",
    };
  }

  // Empty response guard
  if (!responseText || responseText.trim() === "") {
    return {
      success: false,
      error: "Server returned an empty response.",
    };
  }

  // Parse JSON safely — never throw on malformed JSON
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(responseText);
  } catch {
    return {
      success: false,
      error: "Server returned an invalid response.",
      detail: responseText.slice(0, 200),
    };
  }

  // If the server returned a non-OK status, return the error
  if (!response.ok || data.success === false) {
    return {
      success: false,
      error:
        (data.error as string) ||
        (data.detail as string) ||
        `Server error (${response.status})`,
    };
  }

  return data as unknown as AnalysisResult;
}

// ── Utility Functions ───────────────────────────────────────────────────

/** Format file size in human-readable form */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Check if a file has an allowed audio extension */
export function isAllowedAudioFile(file: File): boolean {
  const allowed = [".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".wma"];
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  return allowed.includes(ext);
}
