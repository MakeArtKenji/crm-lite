"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { OpportunityHeader } from "@/components/opportunity-header"
import { InteractionTimeline } from "@/components/interaction-timeline"
import { AddInteractionForm } from "@/components/add-interaction-form"
import { AiAssistPanel } from "@/components/ai-assist-panel"
import { OpportunityDialog } from "@/components/opportunity-dialog"
import { useState, useCallback } from "react"
import type { Opportunity, Interaction } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const { data: oppData, mutate: mutateOpp } = useSWR<{ opportunity: Opportunity }>(
    `/api/opportunities/${id}`,
    fetcher
  )
  const { data: intData, mutate: mutateInt } = useSWR<{ interactions: Interaction[] }>(
    `/api/opportunities/${id}/interactions`,
    fetcher
  )

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const opportunity = oppData?.opportunity
  const interactions = intData?.interactions || []

  const handleDelete = useCallback(async () => {
    if (!opportunity) return
    if (!confirm(`Are you sure you want to delete "${opportunity.name}"? This will also delete all interactions.`)) return

    const res = await fetch(`/api/opportunities/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Opportunity deleted")
      router.push("/dashboard/opportunities")
    } else {
      toast.error("Failed to delete")
    }
  }, [opportunity, id, router])

  const handleInteractionAdded = useCallback(() => {
    mutateInt()
  }, [mutateInt])

  const handleInteractionDeleted = useCallback(() => {
    mutateInt()
  }, [mutateInt])

  const handleOppSaved = useCallback(() => {
    mutateOpp()
    setEditDialogOpen(false)
  }, [mutateOpp])

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-muted-foreground">Loading opportunity...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
          <Link href="/dashboard/opportunities">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to opportunities</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{opportunity.name}</h1>
          <p className="text-sm text-muted-foreground">{opportunity.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditDialogOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <OpportunityHeader opportunity={opportunity} />

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Interaction Timeline</h2>
            <AddInteractionForm opportunityId={id} onAdded={handleInteractionAdded} />
            <InteractionTimeline
              interactions={interactions}
              onDeleted={handleInteractionDeleted}
            />
          </div>
        </div>

        <div>
          <AiAssistPanel opportunityId={id} />
        </div>
      </div>

      <OpportunityDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        opportunity={opportunity}
        onSaved={handleOppSaved}
      />
    </div>
  )
}
