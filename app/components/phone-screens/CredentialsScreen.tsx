"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { Award, Cloud, Code2, ShieldCheck } from "lucide-react";
import { phoneContent } from "@/content/phone";

export function CredentialsScreen() {
  const prefersReduced = useReducedMotion();

  const certs = [
    {
      title: phoneContent.cert1Title,
      meta: phoneContent.cert1Meta,
      tag: "Elite · 95%",
      icon: Award,
    },
    {
      title: phoneContent.cert2Title,
      meta: phoneContent.cert2Meta,
      tag: "Score 90%",
      icon: Code2,
    },
    {
      title: phoneContent.cert3Title,
      meta: phoneContent.cert3Meta,
      tag: "15 Badges",
      icon: Cloud,
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-sans">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center justify-between pt-0.5 pb-1.5 border-b border-[var(--rule-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--ink)]">
            <ShieldCheck size={12} className="text-[var(--accent)]" />
            <span className="font-serif text-[12px] sm:text-[13px] font-semibold tracking-tight">
              {phoneContent.credentialsTitle}
            </span>
          </div>
          <span className="font-mono text-[8px] text-[var(--accent)] font-semibold px-1 py-0.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
            Verified
          </span>
        </div>

        {/* 3 Certificate Rows */}
        <div className="flex flex-col gap-1.5">
          {certs.map((c, idx) => {
            const Icon = c.icon;
            return (
              <m.div
                key={c.title}
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: prefersReduced ? 0 : 0.22,
                  delay: prefersReduced ? 0 : idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-[var(--paper)] border border-[var(--rule)] rounded-[5px] p-2 flex flex-col gap-0.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-[3px] bg-[var(--surface)] border border-[var(--rule)] flex items-center justify-center text-[var(--accent)] shrink-0">
                      <Icon size={10} strokeWidth={1.75} />
                    </div>
                    <span className="font-sans text-[10px] font-semibold text-[var(--ink)] leading-snug line-clamp-1">
                      {c.title}
                    </span>
                  </div>
                  <span className="font-mono text-[7.5px] font-semibold text-[var(--accent)] bg-[var(--accent-tint)] px-1 py-0.2 rounded-[1.5px] shrink-0">
                    {c.tag}
                  </span>
                </div>
                <span className="font-mono text-[8px] text-[var(--ink-muted)] pt-0.5 pl-5">
                  {c.meta}
                </span>
              </m.div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between text-[8px] font-mono text-[var(--ink-muted)]">
        <span>NPTEL &middot; CodeChef &middot; Credly</span>
        <span className="text-[var(--accent)] font-semibold">100% Certified</span>
      </div>
    </div>
  );
}

