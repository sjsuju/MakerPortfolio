"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { heroStats } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern noise-mask opacity-80" />
      <div className="container relative grid gap-10 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border bg-white/72 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-600" />
            Technical maker portfolio
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
            Sooraj Sathyajith
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-medium text-slate-700">
            Builder of robots, assistive devices, browser AI tools, and web systems.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            I like projects where mechanical design, embedded systems, software, and
            product judgment meet in the same room. My work is practical, iterative,
            and shaped by testing under real constraints.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/projects">
                View Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                Resume <FileText className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="relative"
        >
          <Card className="overflow-hidden bg-slate-950 text-white shadow-glow">
            <div className="grid-pattern p-6">
              <div className="rounded-lg border border-white/10 bg-white/8 p-5 backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-sm text-white/68">current build stack</span>
                  <span className="rounded-md bg-teal-300/16 px-3 py-1 text-xs text-teal-100">
                    active
                  </span>
                </div>
                <div className="space-y-3">
                  {["FTC robot mechanisms", "EMG prosthetic control", "Local AI browser workflows"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/8 p-4"
                      >
                        <span className="text-sm font-medium">{item}</span>
                        <span className="text-xs text-white/48">0{index + 1}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border bg-white/74 p-4 shadow-sm">
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
