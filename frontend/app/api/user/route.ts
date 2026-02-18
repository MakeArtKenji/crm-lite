// app/api/user/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

/**
 * POST: Syncs the Clerk User to the FastAPI Database.
 * This should be called on the dashboard entry or via a webhook.
 */
export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    // Send the Clerk data to your FastAPI /users endpoint
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        email: email,
        full_name: fullName || "New User",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to sync user to backend");
    }

    const dbUser = await response.json();
    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error: any) {
    console.error("User Sync Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * GET: Retrieves the current user profile from the backend.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In your FastAPI main.py, you might want to add a GET /users/{id} route
    // For now, we fetch the list and filter or use the ID directly
    const response = await fetch(`${BASE_URL}/users`, {
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Could not fetch users");

    const allUsers = await response.json();
    const currentUserData = allUsers.find((u: any) => u.id === userId);

    if (!currentUserData) {
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user: currentUserData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
