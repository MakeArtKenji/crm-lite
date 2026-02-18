"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AiResult = {
  summary: string; // Backend sends string
  suggestedNextStep: string;
  urgency: string; // e.g., "HOT - Client wants to move"
  tacticalAdvice: string;
  created_at: string;
};

export function AiAssistPanel({ opportunityId }: { opportunityId: string }) {
  const [result, setResult] = useState<AiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOAD LATEST ON MOUNT
  useEffect(() => {
    async function loadLatest() {
      const res = await fetch(`/api/opportunities/${opportunityId}/ai-assist`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    }
    loadLatest();
  }, [opportunityId]);

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/opportunities/${opportunityId}/ai-assist`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Determine color based on the first word of the sentiment string
  const getUrgencyStyles = (urgency: string) => {
    if (urgency.toUpperCase().includes("HOT"))
      return "bg-red-50 text-red-700 border-red-200";
    if (urgency.toUpperCase().includes("WARM"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3 border-b mb-4">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Sales Strategist
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : result ? (
            <>
              <Sparkles className="h-4 w-4" /> Refresh Strategy
            </>
          ) : (
            "Generate Strategy"
          )}
        </Button>

        {error && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive border border-destructive/20">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-5">
            {/* Sentiment/Urgency */}
            <div
              className={cn(
                "rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-tight",
                getUrgencyStyles(result.urgency),
              )}
            >
              {result.urgency}
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" /> Relationship Health
              </h4>
              <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                "{result.summary}"
              </p>
            </div>

            {/* Tactical Advice */}
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground">
                Tactical Advice
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2 rounded">
                {result.tacticalAdvice}
              </p>
            </div>

            {/* Next Step */}
            <div className="rounded-lg border bg-primary/5 p-3 border-primary/20 shadow-inner">
              <h4 className="mb-1.5 text-[10px] font-bold uppercase text-primary">
                Winning Next Move
              </h4>
              <div className="flex items-start gap-2">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {result.suggestedNextStep}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
