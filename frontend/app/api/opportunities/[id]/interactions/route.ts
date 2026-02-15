import {
  findOpportunity,
  getInteractionsByOpportunity,
  createInteraction,
} from "@/lib/store"
import type { InteractionType } from "@/lib/store"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = findOpportunity(id)

  if (!opportunity) {
    return Response.json({ error: "Opportunity not found" }, { status: 404 })
  }

  const interactions = getInteractionsByOpportunity(id)
  return Response.json({ interactions })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = findOpportunity(id)

  if (!opportunity) {
    return Response.json({ error: "Opportunity not found" }, { status: 404 })
  }

  const body = await req.json()
  const { type, notes } = body

  const validTypes: InteractionType[] = ["Phone Call", "Email Sent", "Meeting Notes", "Custom Note"]
  if (!type || !validTypes.includes(type)) {
    return Response.json({ error: "Valid interaction type is required" }, { status: 400 })
  }

  if (!notes) {
    return Response.json({ error: "Notes are required" }, { status: 400 })
  }

  const interaction = createInteraction({
    opportunityId: id,
    type,
    notes,
  })

  return Response.json({ interaction }, { status: 201 })
}
