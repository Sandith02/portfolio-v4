"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { analyticsAllowed, GA_ID } from "@/lib/cookie-consent";

export function GoogleAnalytics({ enabled }: { enabled: boolean }) {
  const initialized = useRef(false);
  useEffect(() => {
    const allowed = enabled && analyticsAllowed();
    window["ga-disable-G-0DX5RCBC2Q"] = !allowed;
    if (!allowed) {
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      return;
    }
    window.dataLayer = window.dataLayer || [];
    // Google's queue expects the Arguments object used by the standard gtag snippet.
    // eslint-disable-next-line prefer-rest-params
    window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
    if (!initialized.current) {
      window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    }
    window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    if (!initialized.current) {
      window.gtag("js", new Date());
      window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
      initialized.current = true;
    }
  }, [enabled]);
  return enabled ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /> : null;
}
