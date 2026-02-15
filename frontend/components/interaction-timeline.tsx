"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, FileText, MessageSquare, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Interaction, InteractionType } from "@/lib/store"

type Props = {
  interactions: Interaction[]
  onDeleted: () => void
}

const typeConfig: Record<InteractionType, { icon: typeof Phone; color: string; bg: string }> = {
  "Phone Call": { icon: Phone, color: "text-blue-600", bg: "bg-blue-100" },
  "Email Sent": { icon: Mail, color: "text-emerald-600", bg: "bg-emerald-100" },
  "Meeting Notes": { icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
  "Custom Note": { icon: MessageSquare, color: "text-slate-600", bg: "bg-slate-100" },
}

export function InteractionTimeline({ interactions, onDeleted }: Props) {
  async function handleDelete(interaction: Interaction) {
    if (!confirm("Delete this interaction?")) return

    const res = await fetch(`/api/interactions/${interaction.id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Interaction deleted")
      onDeleted()
    } else {
      toast.error("Failed to delete interaction")
    }
  }

  if (interactions.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-sm font-medium text-muted-foreground">No interactions yet</p>
        <p className="text-xs text-muted-foreground">Log your first activity above</p>
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {interactions.map((interaction, index) => {
        const config = typeConfig[interaction.type]
        const Icon = config.icon

        return (
          <div key={interaction.id} className="relative flex gap-3">
            {/* Timeline line */}
            {index < interactions.length - 1 && (
              <div className="absolute left-[17px] top-10 h-[calc(100%-8px)] w-px bg-border" />
            )}

            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                config.bg
              )}
            >
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>

            {/* Content */}
            <Card className="flex-1">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{interaction.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(interaction.timestamp).toLocaleDateString()} at{" "}
                        {new Date(interaction.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {interaction.notes}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(interaction)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete interaction</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}
