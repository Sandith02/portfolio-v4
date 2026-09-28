"use client";

import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function withoutQuery<T extends { url: string }>(event: T): T {
  const url = new URL(event.url);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export function SiteInsights() {
  return <Suspense fallback={null}>
    <Analytics beforeSend={withoutQuery} />
    <SpeedInsights beforeSend={withoutQuery} />
  </Suspense>;
}
