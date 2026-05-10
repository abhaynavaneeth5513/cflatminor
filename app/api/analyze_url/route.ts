/**
 * CflatMinor — API Proxy Route for URL Analysis
 * ==================================================
 */

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const BACKEND_TIMEOUT_MS = 240_000;

export async function POST(req: Request) {
  let body: { url: string };

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.url) {
    return Response.json(
      { success: false, error: "No URL provided." },
      { status: 400 }
    );
  }

  let backendResponse: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

    backendResponse = await fetch(`${BACKEND_URL}/analyze_url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: body.url }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown proxy error";
    return Response.json({ success: false, error: `Connection error: ${message}` }, { status: 502 });
  }

  let responseText: string;
  try {
    responseText = await backendResponse.text();
  } catch {
    return Response.json(
      { success: false, error: "Backend returned an unreadable response." },
      { status: 502 }
    );
  }

  if (!backendResponse.ok) {
    try {
      const parsed = JSON.parse(responseText);
      return Response.json(
        {
          success: false,
          error: parsed.error || parsed.detail || `Backend error (${backendResponse.status})`,
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

  try {
    JSON.parse(responseText);
  } catch {
    return Response.json(
      { success: false, error: "Backend returned an invalid response." },
      { status: 502 }
    );
  }

  return new Response(responseText, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
