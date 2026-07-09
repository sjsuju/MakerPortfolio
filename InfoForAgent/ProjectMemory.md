# Project Memory

This note is the durable handoff for future agents and models working on the Makerportfolio repo. Read this before making changes.

## Current Project Identity

- Project folder: `C:\Users\shubh\VSCODE\Makerportfolio`
- App type: Next.js App Router portfolio site.
- Owner/person represented: Sooraj Sathyajith.
- Purpose: a technical maker portfolio covering robotics, assistive technology, embedded systems, AI tooling, music/product experiments, and web deployment.
- Preferred notes folder: `InfoForAgent/`.
- Local scratch/tool folder: `.agents/`, ignored by Git and not meant as durable project memory.

## Current Route Model

- `/` is the homepage.
- `/projects` is the consolidated projects and maker portfolio page.
- `/contact` is the consolidated about, contact, and resume page.
- `/about` redirects to `/contact`.
- `/resume` redirects to `/contact`.
- `/maker-portfolio` redirects to `/projects`.
- The printable resume flow is `/contact?print=resume#resume`.

The user wants fewer, stronger pages rather than duplicate route surfaces. Do not recreate separate about/resume/maker pages unless explicitly requested.

## Major Work Completed

### Latest Card Transparency Pass (`codex/cards`)

The latest active card work happened on `codex/cards` after `codex/scrollanimations` was fast-forward merged into `main`.

- The user strongly disliked smoky/tinted "AI-looking" boxes and asked for Apple-style liquid glass.
- Current `app/globals.css` card direction: near-zero card fill, low blur so the grid/gears remain visible, high saturation/brightness, strong white rim highlights, and small cyan/magenta/yellow refraction glints localized near edges/corners.
- `components/ui/badge.tsx` was also made more transparent so badges do not look heavier than the cards.
- Preserve the clear/lens-like direction unless the user asks to return to heavier frosted glass.
- The scroll charge dot should remain fixed-size/circular on desktop, and the active wire should visually connect through the dot.
- Gear meshing was fixed by deriving exact phase values (A2=7.71°, A3=18.33°, B2=32.70°, C2=26.05°) in `components/gear-field.tsx`. The earlier C2=6.05° left the C18–C9 pair half a tooth out (cyan 9T tip landing on a gap *edge* rather than seated in the gap); adding half the 9T pitch (20°) fixed it (6.05 → 26.05). A26–A12, A12–A16 and B22–B10 were already correctly interleaved. Correct mesh condition (verified geometrically, not by fraction bookkeeping): where fixed gear A presents a **tooth CENTER** toward B (local tooth-center fraction 0.32 of the angular pitch facing the line-of-centers), driven gear B must present a **GAP CENTER** toward A (gap-center fraction 0.82). Equivalently B's tooth tips must fall into A's gaps — the reliable acceptance test is tip-to-gap screen distance << tip-to-tip distance at the contact point, evaluated on the actual rendered rotations. The old `target_f_b = (f_a + 0.5) mod 1` shortcut has the right *magnitude* (gap 0.82 − tooth 0.32 = 0.50) but mixes plain fractions with the 0.32/0.82 tooth/gap landmarks and can lock onto the wrong half by a full half-pitch (as it did for C). Reusable procedure for repositioning: for driven gear B meshing fixed A (y-down screen coords, degrees), th = atan2(cb.y-ca.y, cb.x-ca.x); p = 360/teeth; choose phase_b so that, at rotation R = phase + scrollY*0.055*(24/teeth)*dir, B's nearest tooth tip lands in A's nearest gap (tooth center local = (i+0.32)p, gap center local = (i+0.82)p, outerR = pitchR + m*0.85, rootR = pitchR − m*1.05). Sweep phase_b over [0, p) and pick the value minimizing tip-to-gap distance; keep result in [0, 360/teeth). Solve pairs in chain order (A12 before A16; re-check the downstream pair after fixing an upstream one). Center distance must equal (teethA+teethB)*module/2 and adjacent gears must counter-rotate.
- Follow-up: the C-cluster **18T** ("middle-of-the-page" large gear) was itself mis-meshed against the 9T (at scrollY=0, dTG=6.65 vs dTT=13.35 — its engaging tip sat near mid-tooth, not seated in the 9T gap). Fixed by phase-shifting ONLY the 18T: phase 8 → **13.5°** (9T left at 26.05). Re-verified on rendered rotations at scrollY=0: dTG=1.15, dTT=18.85 (cleanly interleaved). Current C-cluster phases: 18T=13.5, 9T=26.05. Note: this 2:1 pair's discrete tooth sampling drifts the metric away from perfect at intermediate scroll positions (affects any phase); solve/verify at scrollY=0. The A-train 12T↔16T pair still shows an inverted residual, but that is the 16T's phase to fix and is out of scope for the single-gear 18T correction.

### Resume Flow

The resume flow was finished and made functional.

Update (2026 resume + download option + exact-dimension image pivot):

- Initial pass rewrote the on-page HTML resume in `app/contact/page.tsx` to match the 2026 source resume content (new profile, skills, presentations, four experience blocks, updated education) and removed the home street address (contact block now shows `Portland, OR` only).
- That HTML reconstruction was then replaced entirely: the user asked whether the resume matched the original PDF's dimensions. It did not reliably, because the HTML/CSS reconstruction re-flows independently of the source file. The fix was to rasterize the actual source PDF's page 1 to `public/resume-page-1.png` (2550x3300px @ 300 DPI, exact 8.5:11 ratio via PyMuPDF) and render that image directly in `app/contact/page.tsx` via `next/image` (`width={2550} height={3300}`), instead of hand-typesetting the content in JSX.
- This removed the `resumeContact`, `resumeSkills`, `presentationExperience`, `resumeExperience` data arrays and the `ResumeSideSection` / `ResumeMainSection` helper components from `app/contact/page.tsx` — they're no longer needed since the resume is now a single faithful image.
- `app/globals.css` print rules were simplified accordingly: removed ~150 lines of per-section print sizing (`.resume-header`, `.resume-body`, `.resume-sidebar`, `.resume-main`, `.resume-side-section`, `.resume-main-section`, `.resume-section-content`, `.resume-row-title`, `.resume-icon`, `.resume-section-rule`) since those classes no longer exist in the markup. The remaining print rule just pins `.resume-sheet` and its `img` to `8.5in x 11in`.
- `components/print-resume-button.tsx` is now a `Print / Download resume` dropdown (lightweight `useState` + outside-click/Escape menu, no new dependency) with `Print resume` (calls `window.print()`, which prints the exact-dimension resume image) and `Download PDF` (links to the committed `public/Sooraj-Sathyajith-Resume.pdf`, the original source file).
- If the resume changes again: update `Sooraj Resume 2026.pdf` (or its successor), re-copy it to `public/Sooraj-Sathyajith-Resume.pdf`, and regenerate `public/resume-page-1.png` from it (PyMuPDF: `page.get_pixmap(matrix=fitz.Matrix(300/72, 300/72))` then `pix.save(...)`). Do not hand-edit resume content as JSX/HTML anymore.
- Verified: `npm run lint` and `npm run build` pass; browser check (accessibility snapshot + inspect) confirmed the dropdown opens with both options, the resume image renders with the correct 2550:3300 (= 8.5:11) intrinsic aspect ratio, and the PDF download serves correctly (200, application/pdf).

Original resume work:

- Kept the `?print=resume` route behavior.
- Added/kept `components/print-resume-handler.tsx`, a client component that reads search params and calls `window.print()` when `print=resume`.
- Updated the homepage Resume action in `app/page.tsx` to point at `/contact?print=resume#resume`.
- Replaced the old `PDF soon` resume button in `app/contact/page.tsx` with a working `Print resume` link.
- Built a print-ready resume inside the contact page.
- Added print CSS in `app/globals.css` so only the resume section prints.
- Print CSS hides navbar, footer, other contact/about sections, and print-only controls.
- Print CSS targets letter paper with `@page { size: letter; margin: 0; }`.
- Resume print layout uses a dark header, left sidebar, main content column, section icons, and exact physical sizing where useful.
- The resume preview was widened on desktop so it does not look cramped beside the print action panel.

Important resume files:

- `app/contact/page.tsx`: resume content and screen layout.
- `components/print-resume-handler.tsx`: auto-print behavior for `?print=resume`.
- `app/globals.css`: screen and print styling for the resume.
- `app/page.tsx`: homepage Resume link.

### Documentation And Agent Memory

The user wanted durable notes that future models can read.

- Created `InfoForAgent/overview.md`.
- Created `InfoForAgent/decisions.md`.
- Created `InfoForAgent/OpenItem.md`.
- Added this `InfoForAgent/ProjectMemory.md`.
- Updated `read.md` to list `InfoForAgent/` in project structure.
- Documented that `InfoForAgent/` is durable agent-readable project memory.
- Documented that `.agents/` is local scratch space.
- Updated `.gitignore` so `.agents/` is ignored but `InfoForAgent/*.md` is not ignored.

Important convention:

- Put durable handoff notes, decisions, and open tasks in `InfoForAgent/`.
- Do not put durable project memory in `.agents/`.

### Warning Cleanup And Debloat

The user asked to fix VS Code yellow warnings and debloat the code.

Fixed warnings:

- Removed unused `Cpu` and `Wrench` imports from `app/projects/page.tsx`.
- `npm run lint` now passes without warnings.

Removed dead code:

- Deleted `components/hero.tsx`.
- Deleted `components/bento-grid.tsx`.
- Deleted `components/project-card.tsx`.
- Deleted `components/skill-badge.tsx`.
- Deleted `lib/icons.ts`.

Trimmed unused data from `lib/data.ts`:

- Removed project `summary` fields.
- Removed project `icon` fields.
- Removed project `featured` flags.
- Removed unused `skills` export.
- Removed unused `processSteps` export.
- Removed unused `heroStats` export.

Removed unused dependency:

- Uninstalled `framer-motion`.
- Updated `package.json`.
- Updated `package-lock.json`.

Documentation was updated so the removed files and removed dependency are not described as current architecture.

### 2026 Visual Redesign ("machine shop behind shower glass")

The user asked for scroll-animated gears in the background, translucent frosted-glass boxes that blur the gears behind them, a modern engineering vibe, and new fonts with personality.

- New `components/gear-field.tsx`: fixed background layer with three clusters of procedurally generated SVG gears (trapezoid teeth, rim/hub/bore, lightening holes, CAD center marks) over a faint drafting grid. Scroll drives rotation via a rAF-throttled handler; gear speeds are inversely proportional to tooth count and adjacent gears counter-rotate (honest mesh ratios). Static under reduced motion; hidden in print; clusters scale 0.6 on mobile.
- New `components/reveal-manager.tsx`: IntersectionObserver-based `[data-reveal]` fade-up reveals, no-JS safe (requires `.reveal-ready` on `<html>`), reduced-motion safe.
- Both are mounted in `components/page-shell.tsx`.
- Fonts via `next/font/google` in `app/layout.tsx`: Chakra Petch (display, h1–h3 via a global CSS rule), Space Grotesk (body), JetBrains Mono (eyebrows/nav/badges/labels). Tailwind `fontFamily` wired in `tailwind.config.ts`.
- New `--hazard` safety-orange token (light `21 90% 45%`, dark `27 96% 61%`) + Tailwind `hazard` color; `--accent` retuned to orange tints. Selection highlight is orange. Convention: cyan = information, orange = action.
- Glass system in `app/globals.css`: `.glass-panel`, `.glass-hover`, `.glass-bar`. `Card` primitive now applies glass by default — do NOT re-add opaque `bg-card/NN` classes on cards or sections, it would hide the gears. Section bands use `bg-foreground/[0.03] dark:bg-white/[0.02]`.
- PCB homepage surfaces made translucent (light + dark variants) so gears show through; pcb buttons are now mono uppercase glass chips with orange hover; `.pcb-home` outer panel deliberately has NO backdrop-filter (nested backdrop-filters are buggy in Safari — only the chip card and buttons inside it blur).
- Eyebrows/labels are mono uppercase with an orange `//` prefix written as `{"//"}` in JSX (a bare `//` in JSX children fails `react/jsx-no-comment-textnodes`).
- Verified: lint + build pass; browser checks in light/dark/mobile confirmed gears render and blur behind glass, scroll rotation matches the intended ratio (600px scroll → 30.46° on the 26T gear), reveals fire, and the mobile menu/glass bars render.

## Current Architecture

### App

- `app/layout.tsx`: root HTML, metadata, global CSS import.
- `app/page.tsx`: PCB-inspired homepage with links to Projects, Contact, and printable Resume.
- `app/projects/page.tsx`: project list, maker portfolio sections, timeline.
- `app/contact/page.tsx`: about section, contact cards, resume preview, print-ready resume, timeline.
- `app/about/page.tsx`: redirects to `/contact`.
- `app/resume/page.tsx`: redirects to `/contact`.
- `app/maker-portfolio/page.tsx`: redirects to `/projects`.
- `app/globals.css`: global tokens, homepage PCB styling, responsive styling, resume print styling.

### Components

- `components/page-shell.tsx`: wraps pages with `Navbar`, `main`, and `Footer`.
- `components/navbar.tsx`: sticky responsive nav using `navItems`.
- `components/footer.tsx`: footer using `navItems`.
- `components/print-resume-handler.tsx`: client-side print trigger for the resume route.
- `components/section-heading.tsx`: shared section heading.
- `components/timeline.tsx`: renders timeline items from `lib/data.ts`.
- `components/ui/button.tsx`: button primitive with variants and `asChild`.
- `components/ui/card.tsx`: card primitive.
- `components/ui/badge.tsx`: badge primitive.

### Data

`lib/data.ts` currently owns:

- `navItems`
- `projects`
- `timeline`
- `contactLinks`

Resume-specific detailed content currently lives in `app/contact/page.tsx`, not in `lib/data.ts`, because it is tightly tied to print layout. This can be revisited later if resume content grows or needs reuse.

### Utilities

- `lib/utils.ts` exports `cn()`, combining `clsx` and `tailwind-merge`.

### Assets

Project images are still placeholder SVGs:

- `public/placeholders/robotics.svg`
- `public/placeholders/prosthetic.svg`
- `public/placeholders/veridex.svg`
- `public/placeholders/music.svg`
- `public/placeholders/portfolio.svg`

Replacing these is one of the main open polish items.

## Current Dependencies

Runtime dependencies after debloat:

- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `lucide-react`
- `next`
- `react`
- `react-dom`
- `tailwind-merge`

Dev dependencies:

- `@types/node`
- `@types/react`
- `@types/react-dom`
- `eslint`
- `eslint-config-next`
- `postcss`
- `tailwindcss`
- `typescript`

`framer-motion` was removed because the only components using it were deleted as dead code.

## Validation Status

After the resume work and debloat:

- `npm run lint` passes with no warnings.
- `npm run build` passes.
- A browser visual pass was done on the resume section after the print layout changes.

When future agents change code, run:

```bash
npm run lint
npm run build
```

For visual/layout changes, also run the app locally and inspect the relevant page.

## Important User Preferences Learned

- The user wants future models to know project context through Obsidian-readable notes.
- The user prefers `InfoForAgent/` over `.agents/` for durable handoff info.
- The user cares about cleaning warnings and avoiding unused/dead code.
- The user wants the portfolio to be practical and polished, not bloated.
- The user asked for a working resume print/download flow instead of placeholder text.
- The user wants all future models to understand what has already been done, not rediscover it.
- The user wants Claude/Fable 5 subagents to be token efficient: search first, read targeted ranges, avoid broad multi-agent committees for small frontend polish, and prefer lean project agents in `.claude/agents/`.

## Git And Workspace Notes

The working tree has multiple existing modifications from the current work sequence. Do not assume every changed file was changed in the current turn.

Known intentional changes include:

- `.gitignore`
- `app/contact/page.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/projects/page.tsx`
- `components/print-resume-handler.tsx`
- `lib/data.ts`
- `package.json`
- `package-lock.json`
- `read.md`
- `InfoForAgent/overview.md`
- `InfoForAgent/decisions.md`
- `InfoForAgent/OpenItem.md`
- `InfoForAgent/ProjectMemory.md`

Known intentional deletions:

- `components/bento-grid.tsx`
- `components/hero.tsx`
- `components/project-card.tsx`
- `components/skill-badge.tsx`
- `lib/icons.ts`

Do not restore deleted files unless the user explicitly asks for the old hero/grid/card architecture.

## Open Work Summary

See `InfoForAgent/OpenItem.md` for the working checklist. Highest-value next steps:

- Replace placeholder project artwork with real images.
- Review and polish project descriptions.
- Confirm public contact/resume details.
- Perform final mobile layout checks after final content/images.
- Decide whether to add a hosted static resume PDF in addition to print-to-PDF.
- Decide deployment target and verify redirects after deployment.

## Model Handoff Instructions

Future models should:

- Read `InfoForAgent/ProjectMemory.md` first.
- Read `InfoForAgent/OpenItem.md` before planning next work.
- Read `InfoForAgent/decisions.md` before changing routes, page structure, or resume behavior.
- Read `InfoForAgent/overview.md` when locating files.
- Keep `InfoForAgent/` current whenever making decisions or completing open items.
- Prefer small, direct changes that match the current simplified architecture.
- Avoid adding new abstractions or dependencies unless they clearly reduce complexity.
- Preserve the consolidated route decisions unless the user explicitly changes direction.
- For Claude/Fable 5 sessions, use `.claude/CLAUDE.md` and the lean project agents before reaching for the official feature-dev plugin's heavier multi-agent flow.
