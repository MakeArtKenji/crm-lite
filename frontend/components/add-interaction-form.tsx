"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import type { InteractionType } from "@/lib/store"

type Props = {
  opportunityId: string
  onAdded: () => void
}

const interactionTypes: InteractionType[] = [
  "Phone Call",
  "Email Sent",
  "Meeting Notes",
  "Custom Note",
]

export function AddInteractionForm({ opportunityId, onAdded }: Props) {
  const [type, setType] = useState<InteractionType>("Phone Call")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!notes.trim()) return

    setLoading(true)

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, notes: notes.trim() }),
      })

      if (res.ok) {
        toast.success("Interaction logged")
        setNotes("")
        setExpanded(false)
        onAdded()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to add interaction")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!expanded) {
    return (
      <Button
        variant="outline"
        className="w-full gap-2 border-dashed"
        onClick={() => setExpanded(true)}
      >
        <Plus className="h-4 w-4" />
        Log Interaction
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-card p-4"
    >
      <div className="flex flex-col gap-3">
        <Select value={type} onValueChange={(v) => setType(v as InteractionType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {interactionTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          placeholder="What happened? Add notes about this interaction..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          required
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setExpanded(false)
              setNotes("")
            }}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={loading || !notes.trim()}>
            {loading ? "Saving..." : "Log Interaction"}
          </Button>
        </div>
      </div>
    </form>
  )
}
