import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// GET: View specific opportunity
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      );
    }

    const opportunity = await response.json();
    return NextResponse.json({ opportunity });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH: Update specific opportunity
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const body = await req.json();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const updated = await response.json();
    return NextResponse.json({ opportunity: updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE: Remove specific opportunity
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Delete failed");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
