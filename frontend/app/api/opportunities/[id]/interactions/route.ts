import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET: Fetch all interactions for a specific lead
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Since your backend GET /interactions returns ALL interactions,
    // we fetch them and filter locally, OR you can create a specific
    // filtered route on the backend for better performance.
    const response = await fetch(`${BASE_URL}/interactions`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch interactions");

    const allInteractions = await response.json();

    // Filter to only show interactions belonging to THIS opportunity
    const interactions = allInteractions.filter(
      (i: any) => i.opportunity_id === parseInt(id),
    );

    return NextResponse.json({ interactions });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 },
    );
  }
}

// POST: Log a new interaction (Call, Meeting, Note)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, notes } = body;

    // Send the data to the FastAPI POST /interactions route
    const response = await fetch(`${BASE_URL}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        notes,
        opportunity_id: parseInt(id), // Link to the specific lead
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to log interaction" },
        { status: response.status },
      );
    }

    const interaction = await response.json();
    return NextResponse.json({ interaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
