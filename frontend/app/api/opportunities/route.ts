// crm-lite/frontend/app/api/opportunities/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // PASS the userId to the backend as a query param
    const response = await fetch(
      `${BASE_URL}/opportunities?user_id=${userId}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) throw new Error("Failed to fetch opportunities");

    const opportunities = await response.json();
    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Backend is offline" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, status, value } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${BASE_URL}/opportunities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        status: status || "New",
        value: value || 0,
        user_id: userId, // Dynamically using the Clerk ID
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to create" },
        { status: response.status },
      );
    }

    const opportunity = await response.json();
    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
