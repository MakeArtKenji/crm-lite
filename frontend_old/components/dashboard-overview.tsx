"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react"
import type { Opportunity } from "@/lib/store"
import { StatusBadge } from "@/components/status-badge"

type Props = {
  opportunities: Opportunity[]
  interactionCount: number
}

export function DashboardOverview({ opportunities, interactionCount }: Props) {
  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0)
  const wonValue = opportunities.filter((o) => o.status === "Won").reduce((sum, o) => sum + o.value, 0)
  const activeCount = opportunities.filter((o) => !["Won", "Lost"].includes(o.status)).length

  const stats = [
    {
      label: "Total Opportunities",
      value: opportunities.length,
      icon: Users,
      description: `${activeCount} active`,
    },
    {
      label: "Pipeline Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      description: "Total across all stages",
    },
    {
      label: "Won Revenue",
      value: `$${wonValue.toLocaleString()}`,
      icon: TrendingUp,
      description: `${opportunities.filter((o) => o.status === "Won").length} deals closed`,
    },
    {
      label: "Interactions",
      value: interactionCount,
      icon: Activity,
      description: "Total logged activities",
    },
  ]

  // Group by status for pipeline view
  const statuses = ["New", "Contacted", "Follow-Up", "Won", "Lost"] as const
  const pipeline = statuses.map((status) => ({
    status,
    items: opportunities.filter((o) => o.status === status),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your pipeline activity</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Pipeline</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map(({ status, items }) => (
            <Card key={status} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-2">
                {items.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">No opportunities</p>
                ) : (
                  items.map((opp) => (
                    <Link
                      key={opp.id}
                      href={`/dashboard/opportunities/${opp.id}`}
                      className="rounded-md border bg-background p-2.5 transition-colors hover:bg-muted/50"
                    >
                      <p className="text-sm font-medium text-foreground">{opp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${opp.value.toLocaleString()}
                      </p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
