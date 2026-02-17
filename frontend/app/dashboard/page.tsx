// dashboard/page.tsx
import { DashboardOverview } from "@/components/dashboard-overview";
import { headers } from "next/headers";

export default async function DashboardPage() {
  // We use absolute URLs for server-side fetches in Next.js
  const domain = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${domain}`;

  // Fetch opportunities and interactions in parallel for speed
  const [oppsRes, intsRes] = await Promise.all([
    fetch(`${baseUrl}/api/opportunities`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/interactions`, { cache: "no-store" }),
  ]);

  const { opportunities = [] } = await oppsRes.json();
  const { interactions = [] } = await intsRes.json();

  return (
    <DashboardOverview
      opportunities={opportunities}
      interactionCount={interactions.length}
    />
  );
}
