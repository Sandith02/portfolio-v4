"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-status" role="status">
        <h2>It worked.</h2>
        <p>Your message successfully survived the internet. I’ll get back to you soon.</p>
        <button className="submit-button" onClick={() => setSent(false)}>Send another</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required placeholder="What should I call you?" autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required placeholder="Where can I reach you?" autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" placeholder="Who are we building this for?" autoComplete="organization" />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="project-type">Project type</label>
          <select id="project-type" name="projectType" defaultValue="">
            <option value="" disabled>Choose a project type</option>
            <option>Website</option><option>Frontend Development</option><option>Full-Stack Development</option><option>AI Website Rescue</option><option>Creative Development</option><option>Something Else</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">Budget</label>
          <input id="budget" name="budget" placeholder="Give me the scary number." />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required placeholder="Tell me what’s happening." />
      </div>
      <button className="submit-button" type="submit">Send it into the internet →</button>
    </form>
  );
}
