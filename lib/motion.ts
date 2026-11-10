import type { Transition, Variants } from "motion/react";

/**
 * MOTION TOKENS — Single source of truth.
 * No magic numbers elsewhere.
 */
export const MOTION_TOKENS = {
  duration: {
    fast: 0.15, // 150ms
    base: 0.3, // 300ms
    slow: 0.5, // 500ms
    ruleDraw: 0.6, // 600ms for accent/section rules
    max: 0.9, // 900ms absolute ceiling
  },
  ease: {
    standard: [0.22, 1, 0.36, 1] as const, // cubic-bezier(0.22, 1, 0.36, 1)
    exit: [0.4, 0, 1, 1] as const, // cubic-bezier(0.4, 0, 1, 1)
  },
  spring: {
    type: "spring" as const,
    stiffness: 260,
    damping: 32,
    mass: 1,
  },
} as const;

/**
 * Standard transition definitions based on tokens
 */
export const transitions: Record<string, Transition> = {
  fast: {
    duration: MOTION_TOKENS.duration.fast,
    ease: MOTION_TOKENS.ease.standard,
  },
  base: {
    duration: MOTION_TOKENS.duration.base,
    ease: MOTION_TOKENS.ease.standard,
  },
  slow: {
    duration: MOTION_TOKENS.duration.slow,
    ease: MOTION_TOKENS.ease.standard,
  },
  ruleDraw: {
    duration: MOTION_TOKENS.duration.ruleDraw,
    ease: MOTION_TOKENS.ease.standard,
  },
  spring: MOTION_TOKENS.spring,
  exit: {
    duration: MOTION_TOKENS.duration.fast,
    ease: MOTION_TOKENS.ease.exit,
  },
};

/**
 * Standard motion variants.
 * Strictly animating only transform, opacity, and clip-path.
 */

// 1. reveal: General element and section entry
export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.base,
      ease: MOTION_TOKENS.ease.standard,
      delay: custom * 0.06, // 60ms stagger
    },
  }),
};

// 2. lineMask: Headline lines revealing through clipped overflow container
export const lineMaskVariants: Variants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: (custom: number = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: MOTION_TOKENS.duration.slow,
      ease: MOTION_TOKENS.ease.standard,
      delay: custom * 0.08, // 80ms line stagger
    },
  }),
};

// 3. ruleDraw: 1px divider lines drawing left-to-right
export const ruleDrawVariants: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    originX: 0,
    transition: {
      duration: MOTION_TOKENS.duration.ruleDraw,
      ease: MOTION_TOKENS.ease.standard,
    },
  },
};

// 4. fadeRise: Positioning text, status badges, buttons fade & rise 12px
export const fadeRiseVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.base,
      ease: MOTION_TOKENS.ease.standard,
      delay: custom * 0.07, // 70ms stagger
    },
  }),
};

// 5. pageTransition: Shared route change crossfade with 8px rise
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.base,
      ease: MOTION_TOKENS.ease.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: MOTION_TOKENS.duration.fast,
      ease: MOTION_TOKENS.ease.exit,
    },
  },
};

/**
 * Reduced-motion variant replacements (opacity only, 100ms)
 */
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

