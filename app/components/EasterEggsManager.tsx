"use client";

import { useEffect } from "react";
import { initSecretsTracker } from "@/lib/secrets";
import { FooterBugdroid } from "./FooterBugdroid";
import { TabReturnEasterEgg } from "./TabReturnEasterEgg";

export function EasterEggsManager() {
  useEffect(() => {
    initSecretsTracker();
  }, []);

  return (
    <>
      <FooterBugdroid />
      <TabReturnEasterEgg />
    </>
  );
}
