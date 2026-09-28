"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ChatCircle, ShareNetwork } from "@phosphor-icons/react";
import { ThreadAnswerDialog } from "./thread-answer-dialog";
import styles from "./thread-dock.module.css";

export function ThreadDock({ title, url, slug, question }: { title: string; url: string; slug: string; question: string }) {
  const [answerOpen, setAnswerOpen] = useState(false);
  const dock = useRef<HTMLElement>(null);
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
    <>
    <nav ref={dock} className={styles.dock} aria-label="Thread actions" style={{ visibility: answerOpen ? "hidden" : undefined }}>
      <Link href="/blogs" className={`${styles.action} ${styles.back}`} aria-label="Back to all threads" title="All threads">
        <span className={styles.icon}><ArrowLeft size={18} aria-hidden="true" /></span>
      </Link>
      <button type="button" className={styles.action} onClick={() => setAnswerOpen(true)} aria-haspopup="dialog">
        <ChatCircle size={18} aria-hidden="true" />
        <span>Answer</span>
      </button>
      <button type="button" className={`${styles.action} ${styles.share}`} onClick={share} disabled={busy} aria-label="Share this thread" title="Share this thread">
        <ShareNetwork size={18} aria-hidden="true" />
      </button>
      <div className={styles.feedback}>
        <p role="status">{status}</p>
        {manualCopy && <input aria-label="Article link" readOnly value={url} onFocus={(event) => event.currentTarget.select()} />}
      </div>
    </nav>
    <ThreadAnswerDialog open={answerOpen} anchorRef={dock} onClose={() => setAnswerOpen(false)} slug={slug} question={question} />
    </>
  );
}
