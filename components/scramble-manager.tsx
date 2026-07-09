"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const CHARS = "abcdefghijklmnopqrstuvwxyz<>/{}[]=+*#$_";
const DURATION = 700;

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

/**
 * Scrambles main h1/h2 text on mount and route change, then decodes it
 * left to right into the real heading, VS Code style.
 */
export function ScrambleManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("print").matches
    ) {
      return;
    }

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("main h1, main h2")
    ).filter(
      (el) => el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE
    );
    if (headings.length === 0) {
      return;
    }

    const originals = new Map<HTMLElement, string>();
    const frames = new Map<HTMLElement, number>();

    const restoreAll = () => {
      for (const [el, text] of originals) {
        el.textContent = text;
      }
    };

    headings.forEach((el) => {
      const original = el.textContent ?? "";
      originals.set(el, original);
      const length = original.length;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION, 1);
        let out = "";
        for (let i = 0; i < length; i++) {
          const ch = original[i];
          out += ch === " " || progress >= i / length ? ch : randomChar();
        }
        el.textContent = out;
        if (progress < 1) {
          frames.set(el, requestAnimationFrame(tick));
        } else {
          el.textContent = original;
          frames.delete(el);
        }
      };
      frames.set(el, requestAnimationFrame(tick));
    });

    window.addEventListener("beforeprint", restoreAll);

    return () => {
      frames.forEach((id) => cancelAnimationFrame(id));
      window.removeEventListener("beforeprint", restoreAll);
      restoreAll();
    };
  }, [pathname]);

  return null;
}
