"use client";

import { useEffect } from "react";

const revealSelector = [
  ".reveal-up",
  ".section-band",
  ".section-band article",
  ".section-band aside",
  ".section-band form",
  ".section-band blockquote",
  ".section-band details",
  ".section-band .shadow-premium",
  ".section-band .shadow-sm"
].join(",");

export function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      }
    );

    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
