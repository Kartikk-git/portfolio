"use client";

import { useState } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "motion/react";
import { RotateCcw, ArrowLeft, Check, ShieldAlert, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import {
  MOTION_TOKENS,
  revealVariants,
  lineMaskVariants,
  ruleDrawVariants,
  fadeRiseVariants,
  pageTransitionVariants,
  reducedMotionVariants,
} from "@/lib/motion";

export default function MotionStyleguidePage() {
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  const getVariants = (normal: typeof revealVariants) => {
    return simulateReducedMotion ? reducedMotionVariants : normal;
  };

  return (
    <main className="min-h-screen py-16 px-4 sm:px-8 max-w-[1120px] mx-auto text-[var(--ink)] bg-[var(--paper)]">
      {/* Header & Navigation */}
      <header className="border-b border-[var(--rule)] pb-8 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link
              href="/styleguide"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)] hover:text-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              <span>Back to Styleguide</span>
            </Link>
            <span className="text-[var(--rule)]">/</span>
            <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--accent)] font-medium">
              Motion Architecture (Revision 3)
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]">
            Motion Tokens &amp; Variants
          </h1>
          <p className="mt-2 text-[var(--ink-muted)] text-base max-w-[62ch]">
            Single-source specification from <code className="font-mono text-xs bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--rule)]">lib/motion.ts</code>.
            Strictly animating transform, opacity, and clip-path. No magic numbers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reduced Motion Simulator Toggle */}
          <button
            type="button"
            onClick={() => setSimulateReducedMotion((prev) => !prev)}
            aria-pressed={simulateReducedMotion}
            className={`inline-flex items-center gap-2 px-3.5 min-h-[44px] rounded-[4px] border text-xs font-mono transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
              simulateReducedMotion
                ? "bg-[var(--accent)] text-[var(--paper)] border-[var(--accent)] font-semibold"
                : "bg-[var(--surface)] border-[var(--rule)] text-[var(--ink)] hover:border-[var(--ink)]"
            }`}
          >
            <ShieldAlert size={16} strokeWidth={1.5} />
            <span>Simulate Reduced Motion: {simulateReducedMotion ? "ON (Opacity 100ms)" : "OFF"}</span>
          </button>

          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-2 px-3.5 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--surface)] text-[var(--ink)] text-xs font-mono hover:border-[var(--ink)] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <RotateCcw size={16} strokeWidth={1.5} />
            <span>Replay All</span>
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* 1. Token Specifications Table */}
      <section className="mb-16">
        <div className="border-b border-[var(--rule)] pb-3 mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-[var(--ink-muted)]">
            01 / System Tokens
          </span>
          <h2 className="font-serif text-2xl font-semibold mt-1">Single Source: lib/motion.ts</h2>
        </div>

        <div className="border border-[var(--rule)] rounded-[4px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--rule)] bg-[var(--surface)]/50 font-mono text-xs text-[var(--ink-muted)]">
                  <th className="py-2.5 px-4 font-medium">Category</th>
                  <th className="py-2.5 px-4 font-medium">Token Name</th>
                  <th className="py-2.5 px-4 font-medium">Value</th>
                  <th className="py-2.5 px-4 font-medium">Purpose / Boundary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule)] font-mono text-xs">
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Duration</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">fast</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">{MOTION_TOKENS.duration.fast * 1000}ms (0.15s)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Hover states, button morphs, micro-transitions</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Duration</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">base</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">{MOTION_TOKENS.duration.base * 1000}ms (0.3s)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Section reveals, route crossfade, modal fades</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Duration</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">slow</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">{MOTION_TOKENS.duration.slow * 1000}ms (0.5s)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Headline line-mask reveals, large surface transitions</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Duration</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">ruleDraw</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">{MOTION_TOKENS.duration.ruleDraw * 1000}ms (0.6s)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">1px divider horizontal rule drawing left-to-right</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Duration Ceiling</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">max</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">{MOTION_TOKENS.duration.max * 1000}ms (0.9s)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Hard ceiling: no animation exceeds 900ms</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Easing</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">standard</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">cubic-bezier(0.22, 1, 0.36, 1)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Standard natural deceleration curve</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Easing</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">exit</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">cubic-bezier(0.4, 0, 1, 1)</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Fast exit acceleration curve</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Physics</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">spring</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">stiffness: 260, damping: 32, mass: 1</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Active nav indicator &amp; magnetic button (zero overshoot)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">Accessibility</td>
                  <td className="py-2.5 px-4 font-bold text-[var(--ink)]">reducedMotion</td>
                  <td className="py-2.5 px-4 text-[var(--accent)]">opacity only, 100ms</td>
                  <td className="py-2.5 px-4 text-[var(--ink-muted)]">All transforms disabled under prefers-reduced-motion</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Live Variant Demonstrations */}
      <section className="space-y-12 mb-20" key={replayKey}>
        {/* Variant 1: lineMask */}
        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
          <div className="flex justify-between items-baseline mb-4 border-b border-[var(--rule)] pb-2">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">Variant 1</span>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">lineMaskVariants</h3>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {simulateReducedMotion ? "100ms opacity" : "translateY 100% → 0%, 80ms stagger, 500ms duration"}
            </span>
          </div>

          <div className="overflow-hidden py-2">
            <m.div
              variants={getVariants(lineMaskVariants)}
              initial="hidden"
              animate="visible"
              custom={0}
              className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink)]"
            >
              Kartik Koundal
            </m.div>
          </div>
          <div className="overflow-hidden py-1">
            <m.div
              variants={getVariants(lineMaskVariants)}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-sans text-base text-[var(--ink-muted)]"
            >
              Computer Science student building web applications in Python and JavaScript and Android apps in Kotlin.
            </m.div>
          </div>
        </div>

        {/* Variant 2: ruleDraw */}
        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
          <div className="flex justify-between items-baseline mb-4 border-b border-[var(--rule)] pb-2">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">Variant 2</span>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">ruleDrawVariants</h3>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {simulateReducedMotion ? "100ms opacity" : "scaleX 0 → 1, 600ms, originX: 0"}
            </span>
          </div>

          <div className="py-4">
            <m.div
              variants={getVariants(ruleDrawVariants)}
              initial="hidden"
              animate="visible"
              className="h-[1px] w-full bg-[var(--accent)]"
            />
          </div>
          <p className="font-mono text-xs text-[var(--ink-muted)]">
            Used for horizontal section rules drawing in as they enter view.
          </p>
        </div>

        {/* Variant 3: fadeRise */}
        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
          <div className="flex justify-between items-baseline mb-4 border-b border-[var(--rule)] pb-2">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">Variant 3</span>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">fadeRiseVariants</h3>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {simulateReducedMotion ? "100ms opacity" : "opacity 0 → 1, translateY 12px → 0, 70ms stagger, 300ms duration"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 py-2">
            <m.div
              variants={getVariants(fadeRiseVariants)}
              initial="hidden"
              animate="visible"
              custom={0}
              className="font-mono text-xs px-2.5 py-1 border border-[var(--rule)] bg-[var(--paper)] rounded-[4px] text-[var(--accent)] font-medium"
            >
              STATUS: OPEN TO INTERNSHIPS
            </m.div>

            <m.button
              type="button"
              variants={getVariants(fadeRiseVariants)}
              initial="hidden"
              animate="visible"
              custom={1}
              className="px-4 py-2 min-h-[44px] rounded-[4px] bg-[var(--ink)] text-[var(--paper)] text-xs font-mono"
            >
              Primary Action
            </m.button>

            <m.button
              type="button"
              variants={getVariants(fadeRiseVariants)}
              initial="hidden"
              animate="visible"
              custom={2}
              className="px-4 py-2 min-h-[44px] rounded-[4px] border border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono"
            >
              Secondary Action
            </m.button>
          </div>
        </div>

        {/* Variant 4: reveal */}
        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
          <div className="flex justify-between items-baseline mb-4 border-b border-[var(--rule)] pb-2">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">Variant 4</span>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">revealVariants</h3>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {simulateReducedMotion ? "100ms opacity" : "opacity 0 → 1, translateY 12px → 0, 60ms stagger, 300ms duration"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            {["01 / TEJOVIK", "02 / Student Organizer", "03 / Hospital Management"].map((item, idx) => (
              <m.div
                key={item}
                variants={getVariants(revealVariants)}
                initial="hidden"
                animate="visible"
                custom={idx}
                className="p-4 border border-[var(--rule)] rounded-[4px] bg-[var(--paper)]"
              >
                <div className="font-mono text-xs text-[var(--accent)] mb-1">Project Entry</div>
                <div className="font-serif font-semibold text-sm text-[var(--ink)]">{item}</div>
              </m.div>
            ))}
          </div>
        </div>

        {/* Variant 5: pageTransition */}
        <div className="border border-[var(--rule)] p-6 rounded-[4px] bg-[var(--surface)]">
          <div className="flex justify-between items-baseline mb-4 border-b border-[var(--rule)] pb-2">
            <div>
              <span className="font-mono text-xs uppercase text-[var(--accent)] font-semibold">Variant 5</span>
              <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">pageTransitionVariants</h3>
            </div>
            <span className="font-mono text-xs text-[var(--ink-muted)]">
              {simulateReducedMotion ? "100ms opacity" : "opacity 0 → 1, translateY 8px → 0, 300ms crossfade"}
            </span>
          </div>

          <m.div
            variants={getVariants(pageTransitionVariants)}
            initial="initial"
            animate="animate"
            className="p-6 border border-[var(--rule)] rounded-[4px] bg-[var(--paper)] text-center"
          >
            <div className="font-serif text-lg font-semibold text-[var(--ink)] mb-1">
              Case Study Page Transition Simulated
            </div>
            <p className="font-mono text-xs text-[var(--ink-muted)]">
              Transitions from project row to case-study header with 300ms crossfade + 8px rise.
            </p>
          </m.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--rule)] pt-8 mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-[var(--ink-muted)] font-mono">
        <div>Kartik Koundal &middot; Motion System Verification</div>
        <div className="mt-2 sm:mt-0">Revision 3 &middot; LazyMotion + domMax</div>
      </footer>
    </main>
  );
}

