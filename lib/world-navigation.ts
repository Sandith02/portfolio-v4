export function worldReturn(hash: string) {
  if (hash === "#about-world") return { world: "about", progress: 7.6 };
  if (hash === "#work-world") return { world: "work", progress: 3.3 };
  if (hash === "#contact-world") return { world: "contact", progress: 13.1 };
  if (hash === "#why-world") return { world: "why", progress: 19.35 };
  if (hash === "#threads-world") return { world: "threads", progress: 24.35 };
  return null;
}
