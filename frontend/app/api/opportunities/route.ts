import { getOpportunities, createOpportunity } from "@/lib/store"
import type { OpportunityStatus } from "@/lib/store"

export async function GET() {
  const opportunities = getOpportunities()
  return Response.json({ opportunities })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, status, value } = body

  if (!name || !email) {
    return Response.json({ error: "Name and email are required" }, { status: 400 })
  }

  const validStatuses: OpportunityStatus[] = ["New", "Contacted", "Follow-Up", "Won", "Lost"]
  if (status && !validStatuses.includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 })
  }

  const opportunity = createOpportunity({
    name,
    email,
    status: status || "New",
    value: value || 0,
  })

  return Response.json({ opportunity }, { status: 201 })
}
