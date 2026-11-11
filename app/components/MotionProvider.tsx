"use client";

import React, { useEffect } from "react";
import { LazyMotion, domMax } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let scrollTimer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      document.documentElement.classList.add("is-scrolling");
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}

