import { cn } from "@/lib/utils"
import type { OpportunityStatus } from "@/lib/store"

const statusConfig: Record<OpportunityStatus, { color: string; label: string }> = {
  New: { color: "bg-blue-100 text-blue-700", label: "New" },
  Contacted: { color: "bg-amber-100 text-amber-700", label: "Contacted" },
  "Follow-Up": { color: "bg-orange-100 text-orange-700", label: "Follow-Up" },
  Won: { color: "bg-emerald-100 text-emerald-700", label: "Won" },
  Lost: { color: "bg-red-100 text-red-700", label: "Lost" },
}

export function StatusBadge({ status }: { status: OpportunityStatus }) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.color
      )}
    >
      {config.label}
    </span>
  )
}
