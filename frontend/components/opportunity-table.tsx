"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { toast } from "sonner"
import type { Opportunity } from "@/lib/store"

type Props = {
  opportunities: Opportunity[]
  onEdit: (opp: Opportunity) => void
  onDeleted: () => void
}

export function OpportunityTable({ opportunities, onEdit, onDeleted }: Props) {
  async function handleDelete(opp: Opportunity) {
    if (!confirm(`Are you sure you want to delete "${opp.name}"?`)) return

    const res = await fetch(`/api/opportunities/${opp.id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success(`"${opp.name}" has been deleted`)
      onDeleted()
    } else {
      toast.error("Failed to delete opportunity")
    }
  }

  if (opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <p className="text-sm font-medium text-muted-foreground">No opportunities yet</p>
        <p className="text-xs text-muted-foreground">Create your first opportunity to get started</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Updated</TableHead>
            <TableHead className="w-10">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow key={opp.id}>
              <TableCell>
                <Link
                  href={`/dashboard/opportunities/${opp.id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline"
                >
                  {opp.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{opp.email}</TableCell>
              <TableCell>
                <StatusBadge status={opp.status} />
              </TableCell>
              <TableCell className="text-right font-medium text-foreground">
                ${opp.value.toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {new Date(opp.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/opportunities/${opp.id}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(opp)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(opp)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
