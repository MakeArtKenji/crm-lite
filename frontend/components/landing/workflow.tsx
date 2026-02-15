"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { UserPlus, MessagesSquare, Brain, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Lead Created",
    description: "New opportunity enters your pipeline with all the context you need.",
  },
  {
    icon: MessagesSquare,
    title: "Interactions Logged",
    description: "Calls, emails, meetings — every touchpoint captured automatically.",
  },
  {
    icon: Brain,
    title: "AI Summary",
    description: "One-click summary distills the entire relationship into clarity.",
  },
  {
    icon: Rocket,
    title: "Next Action",
    description: "AI recommends your best next move. Execute with confidence.",
  },
];

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="flex flex-1 flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        className="relative flex w-full flex-col items-center"
      >
        {/* Step number */}
        <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {index + 1}
        </div>

        {/* Icon box */}
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-lg shadow-primary/5"
        >
          <step.icon className="h-7 w-7 text-primary" />
        </motion.div>

        <h3 className="font-display mb-2 text-center text-base font-semibold text-foreground">
          {step.title}
        </h3>
        <p className="max-w-[200px] text-center text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </motion.div>

      {/* Connector arrow (hidden on last item and mobile) */}
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
          className="absolute top-[5.5rem] hidden h-px w-full origin-left bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 lg:block"
          style={{
            left: `${((index + 0.5) / steps.length) * 100}%`,
            width: `${(1 / steps.length) * 100}%`,
          }}
        />
      )}
    </div>
  );
}

export function Workflow() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="workflow" className="relative py-32">
      {/* Background element */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div ref={sectionRef} className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            From lead to action in four steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            A workflow so clear it feels inevitable.
          </p>
        </motion.div>

        {/* Steps container */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
            className="absolute left-[12.5%] right-[12.5%] top-[6.25rem] hidden h-px origin-left bg-gradient-to-r from-primary/0 via-border to-primary/0 lg:block"
          />

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <StepCard
                key={step.title}
                step={step}
                index={i}
                isLast={i === steps.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Progress indicator dots (mobile) */}
        <div className="mt-8 flex justify-center gap-2 lg:hidden">
          {steps.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="h-1.5 w-1.5 rounded-full bg-primary/40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
