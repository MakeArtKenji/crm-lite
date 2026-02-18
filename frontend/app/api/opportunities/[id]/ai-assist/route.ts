// app/api/opportunities/[id]/ai-assist/route.ts
import { findOpportunity } from "@/lib/store";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

// TRIGGER NEW ANALYSIS
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${BACKEND_URL}/opportunities/${id}/strategy`,
      {
        method: "GET", // Backend uses @app.get to trigger generation
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) throw new Error("Backend failed to generate strategy");
    const data = await response.json();

    return Response.json(mapBackendToFrontend(data));
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// FETCH LATEST FROM DB
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${BACKEND_URL}/opportunities/${id}/strategy/latest`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok)
      return Response.json({ error: "No strategy found" }, { status: 404 });
    const data = await response.json();

    return Response.json(mapBackendToFrontend(data));
  } catch (error: any) {
    return Response.json({ error: "Backend unreachable" }, { status: 500 });
  }
}

// Helper to keep keys consistent with your Frontend UI
function mapBackendToFrontend(data: any) {
  return {
    summary: data.summary, // This is a string now
    suggestedNextStep: data.next_step,
    urgency: data.sentiment, // This is the full string: "HOT - reason..."
    tacticalAdvice: data.tactical_advice,
    created_at: data.created_at,
  };
}
