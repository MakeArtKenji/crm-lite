"use client";

import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-sm font-semibold text-foreground">
            CRM Lite
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#workflow"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Workflow
          </a>
          <a
            href="#why"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Why CRM Lite
          </a>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Built with clarity in mind.
        </p>
      </div>
    </footer>
  );
}
