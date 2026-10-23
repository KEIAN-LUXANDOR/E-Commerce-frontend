"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollReveal — attaches an IntersectionObserver to an element and
 * adds/removes the CSS class "in-view" so .reveal styles animate in.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="reveal">...</div>
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  threshold = 0.12
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in-view");
          observer.unobserve(el); // fire once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * useScrollRevealAll — attaches observers to all children matching [data-reveal]
 * within a container. Each child will get "in-view" when it scrolls into view,
 * with an optional stagger delay based on data-index.
 */
export function useScrollRevealAll<T extends HTMLElement = HTMLElement>(
  threshold = 0.08
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay ?? "0";
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        });
      },
      { threshold }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
