"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { CONTACT_EMAIL, CONTACT_LIMITS, CONTACT_TOPICS, validateContact, type ContactErrors, type ContactField } from "@/lib/contact";
import styles from "./contact-form.module.css";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [error, setError] = useState("");
  const receipt = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const request = useRef<{ id: string; payload: string } | null>(null);
  const busy = useRef(false);
  useEffect(() => { if (state === "sent") receipt.current?.focus(); }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    const checked = validateContact(fields);
    setErrors(checked.errors); setError("");
    if (!checked.valid) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(checked.errors)[0]}"]`)?.focus();
      return;
    }
    busy.current = true; setState("sending");
    try {
      const payload = JSON.stringify(checked.data);
      // Keep the same ID when retrying an unchanged message after a timeout.
      if (!request.current || request.current.payload !== payload) request.current = { id: crypto.randomUUID(), payload };
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checked.data, website: fields.website, submissionId: request.current.id }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (result.errors) setErrors(result.errors);
        setError(result.error || "Your message couldn’t be sent. Please try again or email me directly.");
        setState("error"); return;
      }
      form.reset(); request.current = null; setState("sent");
    } catch {
      setError("I couldn’t confirm your message arrived. Please try again. Your message is still here.");
      setState("error");
    } finally { busy.current = false; }
  }

  function fieldError(field: ContactField) {
    return errors[field] ? <span id={`contact-${field}-error`} className={styles.fieldError}>{errors[field]}</span> : null;
  }
  const accessibility = (field: ContactField) => ({ "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? `contact-${field}-error` : undefined });

  if (state === "sent") return (
    <div className={styles.receipt} ref={receipt} tabIndex={-1} role="status">
      <h3>Your message made it.</h3>
      <p>Thanks for reaching out. I’ll read it and get back to you at the email you shared.</p>
      <button type="button" className={styles.send} onClick={() => { setState("idle"); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("input")?.focus()); }}>Send another message<span><ArrowUpRight size={18} aria-hidden="true" /></span></button>
    </div>
  );

  return (
    <form ref={formRef} className={styles.form} onSubmit={submit} noValidate aria-label="Send an inquiry" aria-busy={state === "sending"}>
      <fieldset disabled={state === "sending"} className={styles.fields}>
        <legend className="inner-accessible-title">Your contact details and message</legend>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" autoComplete="name" required maxLength={CONTACT_LIMITS.name} placeholder="What should I call you?" {...accessibility("name")} />
            {fieldError("name")}
          </div>
          <div className={styles.field}>
            <label htmlFor="contact-email">Your email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" autoCapitalize="none" required maxLength={CONTACT_LIMITS.email} placeholder="Where can I reach you?" {...accessibility("email")} />
            {fieldError("email")}
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-company">Company or organisation <span>Optional</span></label>
          <input id="contact-company" name="company" autoComplete="organization" maxLength={CONTACT_LIMITS.company} placeholder="If you’re reaching out for a team" {...accessibility("company")} />
          {fieldError("company")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-topic">What brings you here? <span>Optional</span></label>
          <select id="contact-topic" name="topic" defaultValue="" {...accessibility("topic")}>
            <option value="">Choose a starting point</option>
            {CONTACT_TOPICS.map(topic => <option key={topic}>{topic}</option>)}
          </select>
          {fieldError("topic")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-message">What’s on your mind?</label>
          <textarea id="contact-message" name="message" required minLength={10} maxLength={CONTACT_LIMITS.message} rows={5} placeholder="An idea, a little context, a link. Start wherever feels right." {...accessibility("message")} />
          {fieldError("message")}
        </div>
        <div className={styles.honeypot} aria-hidden="true" inert>
          <label htmlFor="contact-website">Leave this field empty</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>
      {error && <p className={styles.error} role="alert">{error} <a href={`mailto:${CONTACT_EMAIL}`}>Email me directly <ArrowUpRight size={12} aria-hidden="true" /></a></p>}
      <div className={styles.actions}>
        <button type="submit" disabled={state === "sending"} className={styles.send}>{state === "sending" ? "Sending your message…" : "Send message"}<span><ArrowUpRight size={18} aria-hidden="true" /></span></button>
        <p>Your details stay private.<br />I’ll only use them to reply.</p>
      </div>
      <span className="inner-accessible-title" role="status">{state === "sending" ? "Sending your message." : ""}</span>
    </form>
  );
}
