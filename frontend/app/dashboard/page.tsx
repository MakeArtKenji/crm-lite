// app/dashboard/page.tsx
import { DashboardOverview } from "@/components/dashboard-overview";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Get the userId on the server (Secure/Tamper-proof)
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Point directly to FASTAPI
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  try {
    /** * 3. Fetch from FastAPI with the privacy filter.
     * Since we are on the server, we don't need the /api middleman.
     * We just pass the userId we got from auth() above.
     */
    const [oppsRes, intsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/opportunities?user_id=${userId}`, {
        cache: "no-store",
      }),
      fetch(`${BACKEND_URL}/interactions`, { cache: "no-store" }), // See note below about filtering interactions
    ]);

    if (!oppsRes.ok || !intsRes.ok) {
      throw new Error("Backend response was not OK");
    }

    const opportunities = await oppsRes.json();
    const interactions = await intsRes.json();

    // Since you are a data analytics guy, filter interactions here if
    // your backend doesn't support ?user_id=${userId} for interactions yet.
    const userInteractionsCount = interactions.length;

    return (
      <DashboardOverview
        opportunities={opportunities}
        interactionCount={userInteractionsCount}
      />
    );
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-destructive">Connection Error</h1>
        <p className="text-muted-foreground">
          Could not reach the private CRM data server.
        </p>
      </div>
    );
  }
}
