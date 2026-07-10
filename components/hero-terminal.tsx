"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "docked" | "popout" | "collapsed";

const MODE_KEY = "hero-terminal-mode";
const BOOT_KEY = "hero-terminal-booted";
const MAX_LINES = 40;

const BOOT_LINES = [
  "> boot sequence initiated",
  "> loading maker profile... ok",
  "> 5 projects indexed",
  '> type "help" for commands',
];

const HELP_ENTRIES: [string, string][] = [
  ["whoami", "who is running this thing"],
  ["whyexist", "why this site is here"],
  ["robotics", "competition robotics work"],
  ["assistive", "assistive hardware work"],
  ["aiandml", "AI and machine learning work"],
  ["embedded", "embedded systems work"],
  ["web", "web builds"],
  ["clear", "clear the screen"],
];

// Each string is one paragraph; the output area wraps text naturally.
const INFO_COMMANDS: Record<string, string[]> = {
  whoami: [
    "sooraj sathyajith. maker, robotics team founder and captain, embedded systems builder, and software developer. permanently soldering something.",
  ],
  whyexist: [
    "this site is my workbench in public. most portfolios show polished results; this one also shows the iteration behind them: what i designed, what failed, and how each version got better.",
    "it is also a build in itself: next.js, a hand-rolled 3d wireframe gear, and the terminal you are typing into right now.",
    "use the nav above to see the actual projects.",
  ],
  robotics: [
    "i founded FIRST Tech Challenge team 23918 in 2023 and have captained it every season since. we have been competitive every single year.",
    "in the DECODE season we won the coveted first place Inspire Award at both the regional and state levels, advancing to the FIRST Championship as Oregon's #1 placed team.",
    "my work on the team spans CAD, mechanism design, fabrication, failure analysis, and quick redesign loops, all under competition deadlines and field reality.",
  ],
  assistive: [
    "i build assistive hardware, most notably an EMG prosthetic hand that reads muscle activation signals so control feels intuitive instead of mechanical.",
    "the goal is shifting control away from traditional input methods toward interfaces anyone can use. cost, comfort, and reliability are engineering requirements here, not afterthoughts.",
  ],
  aiandml: [
    "i use AI where it earns trust. on the hardware side, that means classifying EMG activation patterns to drive prosthetic control. on the software side, it means Veridex, a browser assistant designed for clearer reading instead of noise.",
    "i care about AI tools that make thinking visible: classifier plans, interface decisions, and the notes that explain why one version replaced another.",
  ],
  embedded: [
    "ESP32 prototyping, sensor integration, PWM driver control, and bench validation. this is the physical layer under every project i build.",
    "embedded work taught me that hardware is never the ideal on paper: real clocks drift, real sensors read off, and calibration is part of the design.",
  ],
  web: [
    "next.js builds like this site and VibeShuffle, a more human way to filter music on top of Spotify.",
    "web work is where the projects meet people, so everything is designed for visitors who want clarity, not noise.",
  ],
};

type Line = { text: string; tone?: "prompt" | "output"; cmd?: string };

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

/**
 * Mini interactive terminal for the home hero. Docks in the hero left column
 * on desktop, collapses to a floating button on mobile (and on request).
 * Info commands only; the nav handles routing.
 * Glass-themed, mono font, zero new dependencies.
 */
export function HeroTerminal() {
  const [mode, setMode] = useState<Mode>("collapsed");
  const [hydrated, setHydrated] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const collapsedBtnRef = useRef<HTMLButtonElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply the persisted mode after mount, once, to avoid hydration mismatch.
  useEffect(() => {
    const desktop = isDesktop();
    const stored = sessionStorage.getItem(MODE_KEY) as Mode | null;
    if (stored && (desktop || stored !== "docked")) {
      setMode(stored);
    } else {
      setMode(desktop ? "docked" : "collapsed");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(MODE_KEY, mode);
  }, [mode, hydrated]);

  const append = (newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines].slice(-MAX_LINES));
  };

  // Boot sequence, once per session, on first expand.
  useEffect(() => {
    if (!hydrated || mode === "collapsed") return;
    if (sessionStorage.getItem(BOOT_KEY)) return;
    sessionStorage.setItem(BOOT_KEY, "1");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      append(BOOT_LINES.map((text) => ({ text })));
      return;
    }

    setBooting(true);
    let i = 0;
    const tick = () => {
      if (i >= BOOT_LINES.length) {
        setBooting(false);
        return;
      }
      append([{ text: BOOT_LINES[i] }]);
      i += 1;
      bootTimerRef.current = setTimeout(tick, 260);
    };
    tick();

    return () => {
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, mode]);

  // Focus management: input on expand, floating button on collapse.
  useEffect(() => {
    if (!hydrated) return;
    if (mode === "collapsed") {
      collapsedBtnRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [mode, hydrated]);

  // Escape collapses popout / mobile sheet.
  useEffect(() => {
    if (mode === "collapsed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMode("collapsed");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    append([{ text: raw, tone: "prompt" }]);
    if (!cmd) return;

    if (cmd === "help") {
      append([
        { text: "available commands:" },
        ...HELP_ENTRIES.map(([name, desc]) => ({ text: desc, cmd: name })),
      ]);
    } else if (cmd === "clear") {
      setLines([]);
    } else if (INFO_COMMANDS[cmd]) {
      append(INFO_COMMANDS[cmd].map((text) => ({ text })));
    } else {
      append([{ text: `command not found: ${cmd} (try "help")` }]);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (booting) return;
    const value = input;
    setInput("");
    runCommand(value);
  };

  if (mode === "collapsed") {
    return (
      <div
        className="print-hide fixed bottom-6 left-6 z-40"
        data-tooltip="Open terminal"
        data-tooltip-top=""
      >
        <button
          ref={collapsedBtnRef}
          type="button"
          aria-label="Open terminal"
          aria-expanded={false}
          onClick={() => setMode("popout")}
          className="glass-panel flex h-12 w-12 items-center justify-center rounded-full font-mono text-sm text-primary shadow-glow"
        >
          {">_"}
        </button>
      </div>
    );
  }

  const isSheet = mode === "popout" && !isDesktop();

  const panel = (
    <div
      role="region"
      aria-label="Interactive terminal"
      className={cn(
        "glass-panel flex flex-col overflow-hidden rounded-lg",
        mode === "docked" && "h-80 w-full",
        mode === "popout" && !isSheet && "fixed bottom-6 right-6 z-40 h-96 w-[420px] max-w-[90vw] print-hide",
        isSheet && "fixed inset-x-0 bottom-0 z-40 h-[70vh] max-h-[28rem] rounded-b-none print-hide"
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/30 px-3 py-2 dark:border-white/10">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          terminal
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Collapse terminal"
            data-tooltip="Collapse terminal"
            data-tooltip-end=""
            onClick={() => setMode("collapsed")}
            className="rounded p-1 text-muted-foreground hover:text-foreground"
          >
            {mode === "docked" ? <Minus className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        ref={outputRef}
        aria-live="polite"
        className="flex-1 overflow-y-auto px-3 py-2 font-mono text-xs leading-relaxed"
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              "text-muted-foreground",
              i > 0 && (line.tone === "prompt" ? "mt-3" : "mt-1.5")
            )}
          >
            {line.tone === "prompt" ? (
              <>
                <span className="text-hazard">visitor@sooraj:~$</span>{" "}
                <span className="text-primary">{line.text}</span>
              </>
            ) : line.cmd ? (
              <>
                <span className="inline-block w-24 text-primary">{line.cmd}</span>
                {line.text}
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex shrink-0 items-center gap-2 border-t border-white/30 px-3 py-2 dark:border-white/10">
        <span className="font-mono text-xs text-hazard">visitor@sooraj:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={booting}
          aria-label="Terminal command input"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
          placeholder={booting ? "" : 'try "help"'}
        />
      </form>
    </div>
  );

  return panel;
}
