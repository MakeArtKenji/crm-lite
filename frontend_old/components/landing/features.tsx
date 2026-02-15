"use client";

import { motion } from "framer-motion";
import { Users, MessageCircle, Sparkles } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Opportunities",
    description:
      "Create, edit, and track every lead with deal values and status updates. Your pipeline, crystal clear.",
    color: "primary" as const,
  },
  {
    icon: MessageCircle,
    title: "Interaction Timeline",
    description:
      "Calls, emails, meetings, notes — all logged in one chronological view per contact. Never lose context again.",
    color: "chart-2" as const,
  },
  {
    icon: Sparkles,
    title: "AI Workflow Assist",
    description:
      "One-click summary of all interactions with a suggested next action. Let AI do the thinking so you can do the closing.",
    color: "chart-4" as const,
  },
];

const colorMap = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    glow: "group-hover:shadow-primary/10",
  },
  "chart-2": {
    bg: "bg-chart-2/10",
    text: "text-chart-2",
    border: "border-chart-2/20",
    glow: "group-hover:shadow-chart-2/10",
  },
  "chart-4": {
    bg: "bg-chart-4/10",
    text: "text-chart-4",
    border: "border-chart-4/20",
    glow: "group-hover:shadow-chart-4/10",
  },
};

export function Features() {
  return (
    <section id="features" className="relative py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            Core Features
          </p>
          <h2 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Three powerful capabilities mapped directly to how you actually work
            with leads.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-card/60 p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl ${colors.glow}`}
              >
                {/* Top glow on hover */}
                <div
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${colors.text === "text-primary" ? "via-primary/50" : colors.text === "text-chart-2" ? "via-chart-2/50" : "via-chart-4/50"} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}
                >
                  <feature.icon className={`h-6 w-6 ${colors.text}`} />
                </div>

                <h3 className="font-display mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>

                <p className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
