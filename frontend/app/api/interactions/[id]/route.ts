import { deleteInteraction } from "@/lib/store"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = deleteInteraction(id)

  if (!deleted) {
    return Response.json({ error: "Interaction not found" }, { status: 404 })
  }

  return Response.json({ success: true })
}
