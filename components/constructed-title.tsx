"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export function ConstructedTitle({ lines, offset = 0 }: { lines: string[]; offset?: number }) {
  const title = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let disposed = false;
    // Wait for Megrim so the construction never runs in a fallback typeface.
    document.fonts.ready.then(() => {
      if (!disposed && title.current) title.current.dataset.construct = "true";
    });
    return () => { disposed = true; };
  }, []);

  return (
    <span className="inner-headline constructed-title" ref={title} aria-hidden="true">
      {lines.map((line, row) => (
        <span className="constructed-line" key={line}>
          {Array.from(line).map((letter, index) => letter === " " ? (
            <span className="constructed-space" key={index}>{"\u00a0"}</span>
          ) : (
            <span className="constructed-letter" key={index} style={{
              "--build-delay": `${offset + row * 160 + ((index * 3) % 5) * 65}ms`,
            } as CSSProperties}>
              <span className="constructed-letter-final">{letter}</span>
              {[0, 1, 2, 3].map(piece => (
                <span className={`constructed-piece constructed-piece-${piece}`} key={piece}>
                  <span>{letter}</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
