"use client"

import { useState, useCallback } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { OpportunityTable } from "@/components/opportunity-table"
import { OpportunityDialog } from "@/components/opportunity-dialog"
import type { Opportunity } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function OpportunitiesPage() {
  const { data, mutate } = useSWR<{ opportunities: Opportunity[] }>("/api/opportunities", fetcher)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null)

  const handleCreate = useCallback(() => {
    setEditingOpportunity(null)
    setDialogOpen(true)
  }, [])

  const handleEdit = useCallback((opp: Opportunity) => {
    setEditingOpportunity(opp)
    setDialogOpen(true)
  }, [])

  const handleSaved = useCallback(() => {
    mutate()
    setDialogOpen(false)
    setEditingOpportunity(null)
  }, [mutate])

  const handleDeleted = useCallback(() => {
    mutate()
  }, [mutate])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Opportunities</h1>
          <p className="text-sm text-muted-foreground">Manage your contacts and deals</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <OpportunityTable
        opportunities={data?.opportunities || []}
        onEdit={handleEdit}
        onDeleted={handleDeleted}
      />

      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        opportunity={editingOpportunity}
        onSaved={handleSaved}
      />
    </div>
  )
}
