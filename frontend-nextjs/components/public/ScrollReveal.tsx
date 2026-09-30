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

function revealElement(element: HTMLElement, observer: IntersectionObserver | null) {
  // Deja visible -> rien a faire
  if (element.classList.contains("is-visible")) return;
  // Sans IntersectionObserver (vieux navigateur) -> afficher direct
  if (!observer) {
    element.classList.add("is-visible");
    return;
  }
  observer.observe(element);
}

export function ScrollReveal() {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const applyDelay = (element: HTMLElement, index: number) => {
      if (!element.style.getPropertyValue("--reveal-delay")) {
        element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
      }
    };

    const observeAll = (root: ParentNode = document) => {
      const elements = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));
      // Inclure la racine elle-meme si elle matche (cas des listes remplacees)
      if (root instanceof HTMLElement && root.matches(revealSelector)) {
        elements.unshift(root);
      }
      elements.forEach((element, index) => {
        applyDelay(element, index);
        revealElement(element, observer);
      });
    };

    if (!("IntersectionObserver" in window)) {
      observeAll();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      }
    );

    // 1) Observer le contenu initial
    observeAll();

    // 2) Observer les contenus injectes apres fetch API (services / blog / temoignages...)
    // Sans ca, les cartes remplacees par les donnees MySQL restaient en opacity:0 -> section vide.
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            observeAll(node);
          }
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // 3) Securite : si un element reste invisible hors ecran / observer rate, on force
    // l'affichage des elements deja dans le viewport apres 1.2s (evite page blanche).
    const safetyTimer = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(revealSelector).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("is-visible");
        }
      });
    }, 1200);

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(safetyTimer);
    };
  }, []);

  return null;
}
