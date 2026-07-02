"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const RESUME_PDF = "/Sooraj-Sathyajith-Resume.pdf";

export function PrintResumeButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="print-hide relative">
      <Button
        type="button"
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="w-full justify-between border-white/[0.16] bg-white/[0.08] text-white hover:bg-white/[0.14]"
      >
        <span className="flex items-center gap-2">
          <Printer className="h-4 w-4" /> Print / Download resume
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-lg border border-white/[0.12] bg-slate-900/[0.85] shadow-glow backdrop-blur-xl"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              window.print();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-white hover:bg-white/10"
          >
            <Printer className="h-4 w-4" /> Print resume
          </button>
          <a
            role="menuitem"
            href={RESUME_PDF}
            download="Sooraj-Sathyajith-Resume.pdf"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 border-t border-white/[0.08] px-4 py-3 text-left text-sm text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4" /> Download PDF
          </a>
        </div>
      ) : null}
    </div>
  );
}
