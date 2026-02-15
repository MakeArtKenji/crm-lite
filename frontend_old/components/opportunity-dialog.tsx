"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Opportunity, OpportunityStatus } from "@/lib/store"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity: Opportunity | null
  onSaved: () => void
}

const statuses: OpportunityStatus[] = ["New", "Contacted", "Follow-Up", "Won", "Lost"]

export function OpportunityDialog({ open, onOpenChange, opportunity, onSaved }: Props) {
  const isEditing = !!opportunity

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<OpportunityStatus>("New")
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (opportunity) {
      setName(opportunity.name)
      setEmail(opportunity.email)
      setStatus(opportunity.status)
      setValue(String(opportunity.value))
    } else {
      setName("")
      setEmail("")
      setStatus("New")
      setValue("")
    }
  }, [opportunity, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const body = {
        name,
        email,
        status,
        value: parseFloat(value) || 0,
      }

      const res = isEditing
        ? await fetch(`/api/opportunities/${opportunity.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/opportunities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })

      if (res.ok) {
        toast.success(isEditing ? "Opportunity updated" : "Opportunity created")
        onSaved()
      } else {
        const data = await res.json()
        toast.error(data.error || "Something went wrong")
      }
    } catch {
      toast.error("Failed to save opportunity")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Opportunity" : "New Opportunity"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this opportunity"
              : "Add a new contact to your pipeline"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="opp-name">Name</Label>
            <Input
              id="opp-name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="opp-email">Email</Label>
            <Input
              id="opp-email"
              type="email"
              placeholder="john@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="opp-status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as OpportunityStatus)}>
              <SelectTrigger id="opp-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="opp-value">Deal Value ($)</Label>
            <Input
              id="opp-value"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
