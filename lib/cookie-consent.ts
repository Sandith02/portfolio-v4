export const CONSENT_KEY = "sandith-cookie-choice-v1";
export const CONSENT_EVENT = "sandith-cookie-choice";
export const SETTINGS_EVENT = "sandith-cookie-settings";
export const GA_ID = "G-0DX5RCBC2Q";
export const CONSENT_DAYS = 180;
export type CookieChoice = "accepted" | "rejected" | "unknown";
type StoredChoice = { choice: Exclude<CookieChoice, "unknown">; expires: number };
let memory: StoredChoice | null = null;
let storageUnavailable = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    "ga-disable-G-0DX5RCBC2Q"?: boolean;
  }
}

export function cookieChoice(): CookieChoice {
  if (typeof window === "undefined") return "unknown";
  if (storageUnavailable) return memory && memory.expires > Date.now() ? memory.choice : "unknown";
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    if (stored && typeof stored === "object" && "choice" in stored && "expires" in stored &&
      (stored.choice === "accepted" || stored.choice === "rejected") && typeof stored.expires === "number" && stored.expires > Date.now()) return stored.choice;
    return "unknown";
  } catch { return memory && memory.expires > Date.now() ? memory.choice : "unknown"; }
}
export const analyticsAllowed = () => typeof window !== "undefined" && cookieChoice() !== "rejected";
export const serverCookieChoice = () => "pending" as const;

function clearAnalyticsCookies() {
  const domains = location.hostname.split(".");
  const scopes = ["", ...domains.map((_, i) => `; domain=${domains.slice(i).join(".")}`), ...domains.map((_, i) => `; domain=.${domains.slice(i).join(".")}`)];
  for (const item of document.cookie.split(";")) {
    const name = item.split("=")[0].trim();
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const scope of scopes) document.cookie = `${name}=; Max-Age=0; path=/${scope}; SameSite=Lax`;
  }
}
export function saveCookieChoice(choice: Exclude<CookieChoice, "unknown">) {
  memory = { choice, expires: Date.now() + CONSENT_DAYS * 86400000 };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(memory)); } catch { storageUnavailable = true; }
  window["ga-disable-G-0DX5RCBC2Q"] = choice !== "accepted";
  if (choice === "rejected") clearAnalyticsCookies();
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
export function subscribeCookieChoice(update: () => void) {
  const sync = () => { window["ga-disable-G-0DX5RCBC2Q"] = !analyticsAllowed(); if (!analyticsAllowed()) clearAnalyticsCookies(); update(); };
  window.addEventListener(CONSENT_EVENT, sync);
  window.addEventListener("storage", sync);
  window.addEventListener("focus", sync);
  return () => { window.removeEventListener(CONSENT_EVENT, sync); window.removeEventListener("storage", sync); window.removeEventListener("focus", sync); };
}
export function openCookieSettings() { window.dispatchEvent(new Event(SETTINGS_EVENT)); }
