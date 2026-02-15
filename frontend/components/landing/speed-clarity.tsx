"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Zap, GraduationCap, GitBranch, Lightbulb } from "lucide-react";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-foreground md:text-5xl">
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 90, suffix: "%", label: "Less setup time vs traditional CRMs" },
  { value: 3, suffix: "x", label: "Faster lead follow-up with AI assist" },
  { value: 0, suffix: "", label: "Learning curve", displayValue: "Zero" },
];

const bullets = [
  {
    icon: Zap,
    title: "No bloat",
    description: "Every feature earns its place. Nothing extra, nothing missing.",
  },
  {
    icon: GraduationCap,
    title: "No steep learning curve",
    description: "If you can use email, you can use CRM Lite. It just makes sense.",
  },
  {
    icon: GitBranch,
    title: "Clear pipeline logic",
    description: "Know exactly where every lead stands and what happens next.",
  },
  {
    icon: Lightbulb,
    title: "Prototype-first mindset",
    description: "Built for doers who ship fast and iterate. Not committee-ware.",
  },
];

export function SpeedClarity() {
  return (
    <section id="why" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            Why CRM Lite
          </p>
          <h2 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Built for speed and clarity
          </h2>
        </motion.div>

        {/* Stats row */}
        <div className="mb-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              {stat.displayValue ? (
                <span className="font-display text-4xl font-bold text-foreground md:text-5xl">
                  {stat.displayValue}
                </span>
              ) : (
                <CountUp target={stat.value} suffix={stat.suffix} />
              )}
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>

              {/* Glow separator */}
              <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* Bullets grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {bullets.map((bullet, i) => (
            <motion.div
              key={bullet.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ x: 4 }}
              className="group flex items-start gap-5 rounded-xl border border-border/40 bg-card/40 p-6 transition-colors duration-200 hover:border-primary/20 hover:bg-primary/[0.02]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
                <bullet.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display mb-1 text-base font-semibold text-foreground">
                  {bullet.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {bullet.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
