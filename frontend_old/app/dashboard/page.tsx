import { getOpportunities, getStore } from "@/lib/store"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function DashboardPage() {
  const opportunities = getOpportunities()
  const interactions = getStore().interactions

  return <DashboardOverview opportunities={opportunities} interactionCount={interactions.length} />
}
