"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check, MessageSquareWarning, Brain, ListChecks } from "lucide-react";

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const problems = [
  {
    icon: MessageSquareWarning,
    text: "CRMs are bloated with features you never use",
  },
  {
    icon: ListChecks,
    text: "Hard to track conversations across channels",
  },
  {
    icon: Brain,
    text: 'No clear answer to "what should I do next?"',
  },
];

const solutions = [
  {
    icon: Check,
    text: "One contact = one clear timeline",
  },
  {
    icon: Check,
    text: "Every interaction logged in one place",
  },
  {
    icon: Check,
    text: "AI suggests your next move automatically",
  },
];

export function ProblemSolution() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <AnimatedSection>
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
              The Problem
            </p>
            <h2 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Your CRM shouldn&apos;t need a manual
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Problem side */}
          <AnimatedSection>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-1.5 text-sm text-destructive">
                <X className="h-3.5 w-3.5" />
                The old way
              </div>
              <div className="space-y-4">
                {problems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-5"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <item.icon className="h-4 w-4 text-destructive" />
                    </div>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Solution side */}
          <AnimatedSection>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
                <Check className="h-3.5 w-3.5" />
                The CRM Lite way
              </div>
              <div className="space-y-4">
                {solutions.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-base leading-relaxed text-foreground">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
