"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, AlertTriangle, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AiResult = {
  summary: string[]
  suggestedNextStep: string
  urgency: string
}

type Props = {
  opportunityId: string
}

const urgencyColors: Record<string, { bg: string; text: string; border: string }> = {
  Low: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  High: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
}

export function AiAssistPanel({ opportunityId }: Props) {
  const [result, setResult] = useState<AiResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleAnalyze() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/ai-assist`, {
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Analysis failed")
        return
      }

      const data = await res.json()
      setResult(data)
    } catch {
      setError("Failed to connect to AI service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Workflow Assist
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full gap-2"
          variant={result ? "outline" : "default"}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : result ? (
            <>
              <Sparkles className="h-4 w-4" />
              Re-analyze
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Summarize & Suggest
            </>
          )}
        </Button>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4">
            {/* Urgency indicator */}
            {result.urgency && (
              <div
                className={cn(
                  "rounded-md border px-3 py-2 text-center text-xs font-semibold",
                  urgencyColors[result.urgency]?.bg || "bg-muted",
                  urgencyColors[result.urgency]?.text || "text-foreground",
                  urgencyColors[result.urgency]?.border || "border-border"
                )}
              >
                {result.urgency} Priority
              </div>
            )}

            {/* Summary */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Relationship Summary
              </h4>
              <ul className="flex flex-col gap-2">
                {result.summary.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested next step */}
            <div className="rounded-md border bg-primary/5 p-3">
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                Suggested Next Step
              </h4>
              <div className="flex items-start gap-2">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {result.suggestedNextStep}
                </p>
              </div>
            </div>
          </div>
        )}

        {!result && !loading && !error && (
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Click above to get an AI-powered summary of this opportunity and a recommended next action based on the interaction history.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
