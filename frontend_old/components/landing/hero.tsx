"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 text-center lg:pt-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Now in public beta
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display max-w-4xl text-balance text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl"
        >
          The CRM that gets out
          <br />
          <span className="text-primary">of your way</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          One contact. One timeline. Every interaction logged. AI tells you what
          to do next. No bloat, no learning curve — just pipeline clarity.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="gap-2 px-8 text-base">
            Try CRM Lite
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2 px-8 text-base"
          >
            <Play className="h-4 w-4" />
            View Workflow Demo
          </Button>
        </motion.div>

        {/* Floating UI elements */}
        <div className="relative mt-20 w-full max-w-4xl lg:mt-28">
          {/* Main dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-card/80 p-1 shadow-2xl shadow-primary/5 backdrop-blur-sm"
          >
            <div className="rounded-lg bg-card p-6">
              {/* Mock CRM UI */}
              <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-chart-2/60" />
                <div className="ml-4 h-4 w-48 rounded bg-muted" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="h-3 w-20 rounded bg-primary/20" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 bg-muted/50 p-3"
                      >
                        <div className="h-2.5 w-full rounded bg-muted" />
                        <div className="mt-2 h-2 w-2/3 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-24 rounded bg-chart-2/20" />
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border/40 bg-muted/50 p-3"
                      >
                        <div className="h-2.5 w-full rounded bg-muted" />
                        <div className="mt-2 h-2 w-1/2 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-16 rounded bg-chart-4/20" />
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <div className="h-2.5 w-full rounded bg-primary/20" />
                    <div className="mt-2 h-2 w-3/4 rounded bg-primary/15" />
                    <div className="mt-3 h-6 w-full rounded bg-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating cards around the dashboard */}
          <FloatingCard
            delay={0.6}
            className="absolute -left-4 top-8 hidden lg:block"
          >
            <div className="rounded-lg border border-border/60 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                <span className="text-xs text-muted-foreground">
                  3 calls logged today
                </span>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard
            delay={0.8}
            className="absolute -right-4 top-20 hidden lg:block"
          >
            <div className="rounded-lg border border-primary/30 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs text-foreground font-medium">
                  AI: Follow up with Sarah
                </span>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard
            delay={1.0}
            className="absolute -bottom-4 left-16 hidden lg:block"
          >
            <div className="rounded-lg border border-border/60 bg-card/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="text-xs text-muted-foreground">
                Deal value:{" "}
                <span className="font-semibold text-foreground">$24,500</span>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
