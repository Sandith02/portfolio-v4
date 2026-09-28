"use client";

import { useLayoutEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { ArrowRight, X } from "@phosphor-icons/react";
import { ANSWER_CHARACTER_LIMIT, ANSWER_WORD_LIMIT, answerError, answerWordCount } from "@/lib/thread-answer";
import styles from "./thread-answer-dialog.module.css";

export function ThreadAnswerDialog({ open, onClose, slug, question, anchorRef }: { open: boolean; onClose: () => void; slug: string; question: string; anchorRef: RefObject<HTMLElement | null> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const pending = useRef(false);
  const attempt = useRef<{ answer: string; id: string } | null>(null);
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const words = answerWordCount(answer);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    element.showModal();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && anchorRef.current) {
      const source = anchorRef.current.getBoundingClientRect();
      const target = element.getBoundingClientRect();
      const transform = `translate(${source.x + source.width / 2 - target.x - target.width / 2}px, ${source.y + source.height / 2 - target.y - target.height / 2}px) scale(${source.width / target.width}, ${source.height / target.height})`;
      element.animate([{ transform, borderRadius: "40px", background: "#020108" }, { transform: "none", borderRadius: "24px", background: "#0e0f11" }], { duration: 420, easing: "cubic-bezier(.22, 1, .36, 1)" });
      content.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 120, fill: "backwards" });
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previous; };
  }, [open, anchorRef]);

  async function close() {
    if (closing.current) return;
    closing.current = true;
    const element = dialog.current;
    if (element && anchorRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const target = anchorRef.current.getBoundingClientRect();
      const source = element.getBoundingClientRect();
      const transform = `translate(${target.x + target.width / 2 - source.x - source.width / 2}px, ${target.y + target.height / 2 - source.y - source.height / 2}px) scale(${target.width / source.width}, ${target.height / source.height})`;
      content.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100, fill: "forwards" });
      await element.animate([{ transform: "none", background: "#0e0f11" }, { transform, background: "#020108" }], { duration: 280, easing: "cubic-bezier(.4, 0, .2, 1)", fill: "forwards" }).finished.catch(() => {});
    }
    element?.close();
    element?.getAnimations().forEach(animation => animation.cancel());
    content.current?.getAnimations().forEach(animation => animation.cancel());
    onClose();
    closing.current = false;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    const validation = answerError(answer);
    setError(validation);
    if (validation) { textarea.current?.focus(); return; }
    const trimmed = answer.trim();
    if (attempt.current?.answer !== trimmed) attempt.current = { answer: trimmed, id: crypto.randomUUID() };
    pending.current = true;
    setState("sending");
    try {
      const response = await fetch("/api/thread-answers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, answer: trimmed, submissionId: attempt.current.id }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || "Your answer couldn’t be sent. Please try again.");
      setState("sent"); setAnswer(""); attempt.current = null;
    } catch (error) {
      setError(error instanceof Error && error.name !== "TimeoutError" ? error.message : "I couldn’t confirm your answer arrived. Please try again. Your words are still here.");
      setState("idle");
    } finally { pending.current = false; }
  }

  return (
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="answer-title" onCancel={event => { event.preventDefault(); void close(); }} data-lenis-prevent>
      <div ref={content}>
      <button className={styles.close} type="button" aria-label="Close answer" onClick={close}><X size={20} aria-hidden="true" /></button>
      {state === "sent" ? <div className={styles.success}>
        <h2 id="answer-title">Thanks for sharing your thoughts.</h2>
        <p role="status">Your answer made it. I’ll read it.</p>
        <button className={styles.send} type="button" onClick={close}>Back to reading<span className={styles.sendIcon}><ArrowRight size={18} aria-hidden="true" /></span></button>
      </div> : <form onSubmit={submit} aria-busy={state === "sending"}>
        <p className={styles.eyebrow}>A thought in return</p>
        <h2 id="answer-title">{question}</h2>
        <label htmlFor="thread-answer">Your answer</label>
        <textarea ref={textarea} id="thread-answer" value={answer} onChange={event => { setAnswer(event.target.value); setError(""); }} maxLength={ANSWER_CHARACTER_LIMIT} rows={6} placeholder="What comes to mind?" readOnly={state === "sending"} aria-describedby="answer-count answer-privacy" aria-invalid={words > ANSWER_WORD_LIMIT || !!error} />
        <div className={styles.details}>
          <span id="answer-privacy">Sent privately to Sandith.</span>
          <span id="answer-count" className={words > ANSWER_WORD_LIMIT ? styles.overLimit : undefined}>{words} / {ANSWER_WORD_LIMIT} words</span>
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button className={styles.send} type="submit" disabled={state === "sending" || words > ANSWER_WORD_LIMIT}>{state === "sending" ? "Sending…" : "Send answer"}<span className={styles.sendIcon}><ArrowRight size={18} aria-hidden="true" /></span></button>
      </form>}
      </div>
    </dialog>
  );
}
