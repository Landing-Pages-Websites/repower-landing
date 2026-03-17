"use client";

import { useEffect } from "react";

interface TrackingConfig {
  siteKey?: string;
  gtmId?: string;
  gaId?: string;
  pixelId?: string;
}

export function useTracking(config: TrackingConfig) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (document.getElementById("optimizer-script")) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    if (config.siteKey) {
      win.MEGA_TAG_CONFIG = {
        siteKey: config.siteKey,
        gtmId: config.gtmId,
        gaId: config.gaId,
        pixelId: config.pixelId,
      };
    }

    win.API_ENDPOINT = "https://optimizer.gomega.ai";
    win.TRACKING_API_ENDPOINT = "https://events-api.gomega.ai";

    const script = document.createElement("script");
    script.id = "optimizer-script";
    script.src = "https://cdn.gomega.ai/scripts/optimizer.min.js";
    script.async = true;
    document.head.appendChild(script);
  }, [config]);
}
