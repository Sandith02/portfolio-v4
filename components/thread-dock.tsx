"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ChatCircle, ShareNetwork } from "@phosphor-icons/react";
import styles from "./thread-dock.module.css";

export function ThreadDock({ title, url, slug }: { title: string; url: string; slug: string }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);

  async function share() {
    setBusy(true);
    setStatus("");
    setManualCopy(false);
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
          return;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }
      await navigator.clipboard.writeText(url);
      setStatus("Link copied");
    } catch {
      setStatus("Copy the link below to share this thread.");
      setManualCopy(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <nav className={styles.dock} aria-label="Thread actions">
      <Link href="/blogs" className={`${styles.action} ${styles.back}`} aria-label="Back to all threads" title="All threads">
        <span className={styles.icon}><ArrowLeft size={18} aria-hidden="true" /></span>
      </Link>
      <Link href={`/contact?thread=${encodeURIComponent(slug)}#contact-form`} className={styles.action}>
        <ChatCircle size={18} aria-hidden="true" />
        <span>Answer</span>
      </Link>
      <button type="button" className={`${styles.action} ${styles.share}`} onClick={share} disabled={busy} aria-label="Share this thread" title="Share this thread">
        <ShareNetwork size={18} aria-hidden="true" />
      </button>
      <div className={styles.feedback}>
        <p role="status">{status}</p>
        {manualCopy && <input aria-label="Article link" readOnly value={url} onFocus={(event) => event.currentTarget.select()} />}
      </div>
    </nav>
  );
}
