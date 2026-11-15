"use client";

import React from "react";
import { m, useReducedMotion } from "motion/react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { phoneContent } from "@/content/phone";

export function ContactScreen({ isInteractive = false }: { isInteractive?: boolean }) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col h-full justify-between p-3 select-none text-[var(--ink)] font-sans">
      <div className="flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center justify-between pt-0.5 pb-1.5 border-b border-[var(--rule-subtle)]">
          <div className="flex items-center gap-1.5 text-[var(--ink)]">
            <Mail size={12} className="text-[var(--accent)]" />
            <span className="font-serif text-[12px] sm:text-[13px] font-semibold tracking-tight">
              Inbox
            </span>
          </div>
          <span className="font-mono text-[8px] text-[var(--accent)] font-semibold px-1 py-0.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[2px]">
            Live
          </span>
        </div>

        {/* Sliding Android Notification Card */}
        <m.div
          initial={prefersReduced ? false : { opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: prefersReduced ? 0 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="bg-[var(--paper)] border-2 border-[var(--accent)] rounded-[8px] p-2.5 flex flex-col gap-2 shadow-md relative overflow-hidden"
        >
          {/* Notification Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                <MessageSquare size={9} strokeWidth={2} />
              </div>
              <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--accent)] font-bold">
                {phoneContent.contactNotificationTitle}
              </span>
            </div>
            <span className="font-mono text-[7.5px] text-[var(--ink-muted)]">
              just now
            </span>
          </div>

          {/* Notification Body */}
          <div className="flex flex-col gap-0.5">
            <p className="font-sans text-[10.5px] font-medium text-[var(--ink)] leading-snug">
              {phoneContent.contactNotificationText}
            </p>
            <span className="font-mono text-[8px] text-[var(--ink-muted)]">
              {phoneContent.contactEmail}
            </span>
          </div>

          {/* Action Tap Target / Button */}
          <a
            href={`mailto:${phoneContent.contactEmail}?subject=Internship%20Opportunity`}
            tabIndex={isInteractive ? 0 : -1}
            aria-label={`${phoneContent.contactActionText} (${phoneContent.contactEmail})`}
            className="mt-1 w-full py-1.5 px-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-[4px] font-mono text-[9px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs pointer-events-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
          >
            <span>{phoneContent.contactActionText}</span>
            <Send size={9} strokeWidth={2} />
          </a>
        </m.div>
      </div>

      {/* Footer Connectivity Note */}
      <div className="pt-2 border-t border-[var(--rule-subtle)] flex items-center justify-between text-[8px] font-mono text-[var(--ink-muted)]">
        <span>Direct Channel</span>
        <span className="text-[var(--accent)] font-semibold">Ready to Connect</span>
      </div>
    </div>
  );
}

