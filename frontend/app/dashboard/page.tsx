// dashboard/page.tsx
import { DashboardOverview } from "@/components/dashboard-overview";

export default async function DashboardPage() {
  // Use your BACKEND_URL directly (e.g., http://127.0.0.1:8000)
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  try {
    // Fetch directly from FastAPI
    const [oppsRes, intsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/opportunities`, { cache: "no-store" }),
      fetch(`${BACKEND_URL}/interactions`, { cache: "no-store" }),
    ]);

    // Validate that we actually got JSON
    const isJson = (res: Response) =>
      res.headers.get("content-type")?.includes("application/json");

    const opportunities =
      oppsRes.ok && isJson(oppsRes) ? await oppsRes.json() : [];

    const interactions =
      intsRes.ok && isJson(intsRes) ? await intsRes.json() : [];

    return (
      <DashboardOverview
        opportunities={opportunities}
        interactionCount={interactions.length}
      />
    );
  } catch (error) {
    console.error("Critical Connection Error:", error);
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-bold text-destructive">Backend Offline</h1>
        <p className="text-muted-foreground">
          Make sure your Uvicorn server is running on port 8000.
        </p>
      </div>
    );
  }
}
