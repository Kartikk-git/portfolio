"use client";

import React, { useEffect, useState, useRef } from "react";
import { m, AnimatePresence, useReducedMotion } from "motion/react";
import { phoneContent } from "@/content/phone";
import { usePhoneState } from "@/lib/phone-state";
import { useActiveSection } from "@/lib/active-section";
import { MOTION_TOKENS } from "@/lib/motion";
import { BugdroidSvg } from "./BugdroidSvg";

type BotInviteStage = "waiting" | "inviting" | "peeking";

/**
 * Android Hero Companion Bot
 * - Lives only while #hero is in view. Outside #hero, not rendered and not focusable.
 * - 1.5s after entering hero, slides in from right, waves for ~2s, and shows speech bubble: "Click me!".
 * - After 6s, slides back out to a peeking state at the right edge with subtle idle bob.
 * - Clicking the bot plays a hop animation, opens the phone preview, and companions beside the phone.
 * - Complies strictly with prefers-reduced-motion and WCAG accessibility standards.
 */
export function HeroBot() {
  const { isOpen, openPhone } = usePhoneState();
  const { activeSection } = useActiveSection();
  const prefersReduced = Boolean(useReducedMotion());

  const [isHeroInView, setIsHeroInView] = useState(true);
  const [stage, setStage] = useState<BotInviteStage>("waiting");
  const [showBubble, setShowBubble] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isHopping, setIsHopping] = useState(false);

  const hasInvitedRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 1. Observe #hero with IntersectionObserver
  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsHeroInView(inView);

        // When user scrolls away from hero, reset the invite flag for the next visit
        if (!inView) {
          hasInvitedRef.current = false;
          setStage("waiting");
          setShowBubble(false);
          setIsWaving(false);
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  // 2. Handle invite timing when entering hero
  useEffect(() => {
    // Only run invite cycle if hero is in view, phone is closed, and hasn't invited this visit
    if (!isHeroInView || isOpen || hasInvitedRef.current) {
      if (!isOpen && hasInvitedRef.current) {
        setStage("peeking");
      }
      return;
    }

    if (prefersReduced) {
      setStage("peeking");
      hasInvitedRef.current = true;
      return;
    }

    // 1.5s delay after load / return to hero before sliding in
    const startInviteTimer = setTimeout(() => {
      setStage("inviting");
      setShowBubble(true);
      setIsWaving(true);
      hasInvitedRef.current = true;

      // Wave arm actively for ~2 seconds
      const waveTimer = setTimeout(() => {
        setIsWaving(false);
      }, 2000);

      // Total ~6s after hero visit (4.5s after invite starts), slide out to peeking state
      const peekingTimer = setTimeout(() => {
        setShowBubble(false);
        setStage("peeking");
      }, 4500);

      return () => {
        clearTimeout(waveTimer);
        clearTimeout(peekingTimer);
      };
    }, 1500);

    return () => {
      clearTimeout(startInviteTimer);
    };
  }, [isHeroInView, isOpen, prefersReduced]);

  // Handle bot click / open
  const handleBotClick = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isOpen) return;

    if (!prefersReduced) {
      setIsHopping(true);
      setIsWaving(true);
      setTimeout(() => {
        setIsHopping(false);
      }, 250);
      setTimeout(() => {
        setIsWaving(false);
      }, 1500);
    }

    setShowBubble(false);
    openPhone();
  };

  // If hero is NOT in view, the bot is not rendered / hidden and not focusable
  if (!isHeroInView) {
    return null;
  }

  // Position calculations based on state and viewport
  // When phone is open at >=1600px, bot sits as companion atop phone frame
  const isCompanionMode = isOpen;

  return (
    <div
      className={`fixed z-bot transition-all pointer-events-auto ${
        isCompanionMode
          ? "hidden min-[1600px]:flex flex-col items-center select-none"
          : "top-1/2 -translate-y-1/2 right-0 select-none"
      }`}
      style={
        isCompanionMode
          ? {
              bottom: "calc(50% + clamp(200px, calc((100vw - 1120px) / 2 - 56px), 260px) * 580 / 280 / 2 + 10px)",
              right: "calc(max(24px, calc((50vw - 560px - clamp(200px, calc((100vw - 1120px) / 2 - 56px), 260px)) / 2)) + clamp(200px, calc((100vw - 1120px) / 2 - 56px), 260px) / 2 - 28px)",
            }
          : undefined
      }
    >
      <div
        className={`relative flex items-center ${isCompanionMode ? "cursor-default" : "cursor-pointer"}`}
        onClick={isCompanionMode ? undefined : handleBotClick}
      >
        {/* Speech Bubble: "Click me!" (during invite only) */}
        <AnimatePresence>
          {showBubble && !isCompanionMode && (
            <m.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 8, scale: 0.95 }}
              transition={{
                duration: prefersReduced ? 0.1 : MOTION_TOKENS.duration.fast,
                ease: MOTION_TOKENS.ease.standard,
              }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--surface)] text-[var(--ink)] border border-[var(--accent)]/50 rounded-[4px] px-2.5 py-1 font-mono text-xs shadow-md flex items-center select-none pointer-events-none z-10"
            >
              <span>{phoneContent.botInviteBubble}</span>
              {/* Pointing triangle to bot */}
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-l-[6px] border-l-[var(--accent)]"
                aria-hidden="true"
              />
            </m.div>
          )}
        </AnimatePresence>

        {/* Bot Trigger Button */}
        <button
          ref={triggerRef}
          id="hero-bot-trigger"
          type="button"
          onClick={handleBotClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleBotClick(e);
            }
          }}
          aria-label={phoneContent.botOpenAria}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls="phone-mockup-frame"
          className={`group relative p-1 rounded-[6px] cursor-pointer transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 ${
            isCompanionMode
              ? "cursor-default"
              : stage === "inviting"
              ? "translate-x-[-12px] sm:translate-x-[-24px]"
              : stage === "peeking"
              ? "translate-x-[20px] hover:translate-x-[-8px] focus-visible:translate-x-[-8px]"
              : "translate-x-[60px]"
          } ${isHopping && !prefersReduced ? "-translate-y-3" : ""}`}
        >
          {/* Bobbing Mascot Container */}
          <div
            className={`relative w-12 h-12 sm:w-14 sm:h-14 transition-transform duration-200 ${
              stage === "peeking" && !isCompanionMode && !prefersReduced
                ? "bugdroid-peeking-bob"
                : ""
            } ${!isCompanionMode ? "group-hover:scale-105" : ""}`}
          >
            <BugdroidSvg
              className="w-full h-full"
              isWaving={isWaving || isCompanionMode}
              isNodding={!prefersReduced}
              prefersReduced={prefersReduced}
            />
          </div>
        </button>
      </div>
    </div>
  );
}
