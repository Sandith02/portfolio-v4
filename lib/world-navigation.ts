export function worldReturn(hash: string) {
  if (hash === "#about-world") return { world: "about", progress: 7.6 };
  if (hash === "#work-world") return { world: "work", progress: 3.3 };
  return null;
}
