"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <h2 className="font-display text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Stop wrestling with your CRM.
            <br />
            <span className="text-primary">Start closing deals.</span>
          </h2>

          <p className="mx-auto max-w-xl text-pretty text-lg text-muted-foreground">
            CRM Lite gives you the pipeline clarity you&apos;ve been looking for
            — with AI that actually helps you sell.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              size="lg"
              className="gap-2 px-10 py-6 text-base font-semibold"
            >
              Launch CRM Lite Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <p className="text-sm text-muted-foreground/60">
            No credit card required. Start in under 30 seconds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
