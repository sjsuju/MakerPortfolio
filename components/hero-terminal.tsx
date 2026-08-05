"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

const BOOT_KEY = "hero-terminal-booted";
const MAX_LINES = 40;

const BOOT_LINES = [
  "> boot sequence initiated",
  "> loading maker profile... ok",
  `> ${projects.length} projects indexed`,
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
    "sooraj sathyajith. i founded and captain an FTC robotics team, build embedded systems, and write software. usually in the middle of soldering something.",
  ],
  whyexist: [
    "this site is my workbench, left open. most portfolios show you the finished version. i wanted somewhere to also show the revisions, including the ones that did not work.",
    "it is a build in its own right too: next.js, a 3d wireframe gear i wrote from scratch, and whatever this is that you are typing into.",
    "the nav above has the actual projects.",
  ],
  robotics: [
    "i founded FIRST Tech Challenge team 23918 in 2023 and have captained it every season since. we have been competitive every single year.",
    "in the DECODE season we won the coveted first place Inspire Award at both the regional and state levels, advancing to the FIRST Championship as Oregon's #1 placed team.",
    "my part is mostly CAD, mechanism design, and fabrication, plus working out why the thing that ran fine yesterday does not run on the field today.",
  ],
  assistive: [
    "mostly an EMG prosthetic hand that reads muscle activation off the forearm, so you control it by trying to close your hand rather than by operating a switch.",
    "the constraints i keep coming back to are cost and comfort. a device nobody can afford or wants to wear does not help anyone, which makes those engineering problems and not details for later.",
  ],
  aiandml: [
    "on the hardware side, classifying EMG activation patterns to drive that prosthetic hand. on the software side, Veridex, a browser assistant that reads long pages and shows you what it based its summary on.",
    "the AI work i like is the kind you can check. a classifier with visible confidence, a summary that points at its sources.",
  ],
  embedded: [
    "ESP32 prototyping, sensor integration, PWM driver control, bench validation. this sits underneath most of what i build.",
    "the thing embedded work keeps teaching me is that hardware never matches the datasheet. clocks drift, sensors read off, and you have to leave yourself somewhere to calibrate.",
  ],
  web: [
    "next.js and react builds like this site, VibeShuffle for filtering music by feel rather than genre, and SoleLedger, a resale tracker on FastAPI and postgres that does careful decimal math and deliberately does not automate checkouts.",
    "web is where the rest of the work turns into something you can actually hand to a person.",
  ],
};

type Line = { text: string; tone?: "prompt" | "output"; cmd?: string };

/**
 * Mini interactive terminal for the home hero. Always docked in place;
 * info commands only, the nav handles routing.
 * Glass-themed, mono font, zero new dependencies.
 */
export function HeroTerminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const append = (newLines: Line[]) => {
    setLines((prev) => [...prev, ...newLines].slice(-MAX_LINES));
  };

  // Boot sequence, once per session, on mount.
  useEffect(() => {
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
  }, []);

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

  return (
    <div
      role="region"
      aria-label="Interactive terminal"
      className="glass-panel print-hide flex h-80 w-full flex-col overflow-hidden rounded-lg"
    >
      <div className="flex shrink-0 items-center border-b border-white/30 px-3 py-2 dark:border-white/10">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          terminal
        </span>
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
}
