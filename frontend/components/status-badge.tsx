import { cn } from "@/lib/utils";
import type { OpportunityStatus } from "@/lib/store";

const statusConfig: Record<
  OpportunityStatus,
  { color: string; label: string }
> = {
  New: {
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    label: "New",
  },
  Contacted: {
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    label: "Contacted",
  },
  "Follow-Up": {
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    label: "Follow-Up",
  },
  Won: {
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Won",
  },
  Lost: {
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    label: "Lost",
  },
};

export function StatusBadge({ status }: { status: OpportunityStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors",
        config.color,
      )}
    >
      {config.label}
    </span>
  );
}
