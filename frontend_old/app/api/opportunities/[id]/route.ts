import { findOpportunity, updateOpportunity, deleteOpportunity } from "@/lib/store"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const opportunity = findOpportunity(id)

  if (!opportunity) {
    return Response.json({ error: "Opportunity not found" }, { status: 404 })
  }

  return Response.json({ opportunity })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const updated = updateOpportunity(id, body)

  if (!updated) {
    return Response.json({ error: "Opportunity not found" }, { status: 404 })
  }

  return Response.json({ opportunity: updated })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = deleteOpportunity(id)

  if (!deleted) {
    return Response.json({ error: "Opportunity not found" }, { status: 404 })
  }

  return Response.json({ success: true })
}
