/**
 * CflatMinor — API Proxy Route (Next.js → FastAPI)
 * ==================================================
 *
 * This server-side route handler receives file uploads from the
 * browser and forwards them to the FastAPI backend at localhost:8000.
 *
 * Key fixes over previous version:
 *   - 180s timeout (backend does heavy audio processing)
 *   - Reads response as text first, validates JSON before forwarding
 *   - Structured error responses in all failure paths
 *   - Proper Content-Type forwarding for multipart
 */

export const runtime = "nodejs";

/* Next.js 16 uses dynamic by default for POST, but be explicit */
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** Timeout for the backend request — librosa can take 30-90s on large files */
const BACKEND_TIMEOUT_MS = 180_000;

export async function POST(req: Request) {
  let formData: FormData;

  // ── Parse incoming form data ────────────────────────────────────────
  try {
    formData = await req.formData();
  } catch (err) {
    console.error("[API Proxy] Failed to parse form data:", err);
    return Response.json(
      { success: false, error: "Failed to read uploaded file data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json(
      { success: false, error: "No audio file provided." },
      { status: 400 }
    );
  }

  // ── Forward to backend ──────────────────────────────────────────────
  let backendResponse: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

    // Build a new FormData for the outbound request.
    // We re-create it because the incoming formData stream may already
    // be consumed and some runtimes can't forward it directly.
    const outbound = new FormData();
    outbound.append("file", file, (file as File).name);

    backendResponse = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      body: outbound,
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown proxy error";

    console.error("[API Proxy] Fetch error:", message);

    // Classify the error for a helpful user message
    const isTimeout =
      message.includes("abort") || message.includes("timeout");
    const isConnectionRefused =
      message.includes("ECONNREFUSED") ||
      message.includes("fetch failed") ||
      message.includes("ECONNRESET");

    let userMessage: string;
    let status: number;

    if (isConnectionRefused) {
      userMessage =
        "Cannot connect to analysis backend. Make sure the Python backend is running on port 8000.";
      status = 503;
    } else if (isTimeout) {
      userMessage =
        "Analysis timed out. The file may be too large or complex. Try a shorter clip.";
      status = 504;
    } else {
      userMessage = `Connection error: ${message}`;
      status = 502;
    }

    return Response.json({ success: false, error: userMessage }, { status });
  }

  // ── Read backend response body ──────────────────────────────────────
  let responseText: string;
  try {
    responseText = await backendResponse.text();
  } catch (err) {
    console.error("[API Proxy] Failed to read backend response body:", err);
    return Response.json(
      { success: false, error: "Backend returned an unreadable response." },
      { status: 502 }
    );
  }

  // ── Handle backend error status ─────────────────────────────────────
  if (!backendResponse.ok) {
    console.error(
      `[API Proxy] Backend returned ${backendResponse.status}:`,
      responseText.slice(0, 500)
    );

    // Try to forward the structured JSON error from the backend
    try {
      const parsed = JSON.parse(responseText);
      return Response.json(
        {
          success: false,
          error:
            parsed.error || parsed.detail || `Backend error (${backendResponse.status})`,
        },
        { status: backendResponse.status }
      );
    } catch {
      return Response.json(
        {
          success: false,
          error: `Backend error (${backendResponse.status})`,
          detail: responseText.slice(0, 500),
        },
        { status: backendResponse.status }
      );
    }
  }

  // ── Validate JSON before forwarding ─────────────────────────────────
  try {
    JSON.parse(responseText);
  } catch {
    console.error(
      "[API Proxy] Backend returned non-JSON:",
      responseText.slice(0, 200)
    );
    return Response.json(
      { success: false, error: "Backend returned an invalid response." },
      { status: 502 }
    );
  }

  // ── Success — forward the valid JSON ────────────────────────────────
  return new Response(responseText, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}