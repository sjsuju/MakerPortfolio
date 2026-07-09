# Decision Log

This document records the major decisions made so far for the MakerPortfolio project.

## Product And Content Decisions

- The site is a technical maker portfolio for Sooraj Sathyajith.
- The core story is hands-on engineering across robotics, assistive technology, embedded systems, AI tooling, recommendation experiments, and web deployment.
- The tone should feel clean, technical, practical, and portfolio-focused rather than like a generic landing page.
- Project content should emphasize constraints, iteration, leadership, implementation, and real systems.
- The main project set currently includes FTC Team 23918 Super Sigma Robotics, EMG Prosthetic Hand, Veridex Browser Extension, VibeShuffle / Spotify Tuner, and Portfolio Website.
- Contact content should focus on email, GitHub, and LinkedIn as the primary outbound links.
- Resume content should be available inside the contact page instead of as a disconnected standalone experience.
- Durable project memory for future agents should live in `InfoForAgent/`, including `ProjectMemory.md`, `overview.md`, `decisions.md`, and `OpenItem.md`.
- `.agents/` is local scratch/tool metadata and should not be treated as the durable project memory source.

## Route Decisions

- `/` is the main homepage.
- `/projects` is the single destination for project work and maker portfolio context.
- `/contact` is the single destination for about, contact, and resume content.
- `/about` redirects to `/contact` to preserve old links while avoiding duplicate content.
- `/resume` redirects to `/contact` to preserve old links while keeping resume content consolidated.
- `/maker-portfolio` redirects to `/projects` to preserve old links while keeping project content consolidated.
- The resume print route is `/contact?print=resume#resume`.
- The homepage Resume action points to `/contact?print=resume#resume` so the browser can open the contact page and trigger printing.

## Resume Flow Decisions

- The previous `PDF soon` placeholder was replaced with a working `Print resume` action.
- The print action uses the browser's print dialog rather than requiring a committed static PDF file.
- The single print button was later replaced with a `Print / Download resume` dropdown offering two choices: `Print resume` (browser print of the styled HTML resume) and `Download PDF` (the committed static PDF).
- The dropdown is a lightweight in-component menu in `components/print-resume-button.tsx` (`useState` + outside-click/Escape handling) rather than a new dropdown dependency, consistent with the debloat preference.
- The downloadable PDF lives at `public/Sooraj-Sathyajith-Resume.pdf` and is served directly via an `<a download>` link.
- The hand-reconstructed HTML resume (dark header, sidebar/main grid, custom typography) was replaced with a rasterized image of the actual source PDF's page 1 (`public/resume-page-1.png`, 2550x3300px, rendered at 300 DPI, exact 8.5:11 aspect ratio). This guarantees the on-page preview and the printed output are pixel-faithful to the real resume rather than a manually re-typeset approximation that could drift from the original wording/layout/dimensions.
- The resume image is rendered via `next/image` in `app/contact/page.tsx` with explicit `width={2550} height={3300}` so its intrinsic aspect ratio matches the source PDF exactly.
- Print CSS for the resume was drastically simplified: `.resume-sheet` and `.resume-sheet img` are pinned to `8.5in` x `11in` in the `@media print` block (`app/globals.css`), replacing ~150 lines of per-section print sizing rules that no longer apply now that the resume is a single image.
- If the resume content changes again, regenerate `public/resume-page-1.png` from the new source PDF (e.g. via PyMuPDF: `page.get_pixmap(matrix=fitz.Matrix(300/72, 300/72))`) rather than hand-editing HTML/CSS to match.
- The home street address was intentionally removed. The resume contact block shows city/state only (`Portland, OR`) so no home address is published.
- `components/print-resume-handler.tsx` remains the client-side bridge for the `?print=resume` query parameter.
- The contact page includes a screen preview of the resume and a print-specific layout for polished paper output.
- Print CSS hides the navbar, footer, non-resume sections, and print-hidden controls.
- Resume print CSS targets letter paper with `@page { size: letter; margin: 0; }`.
- The resume layout is designed as a one-page sheet with a dark header, left sidebar, and main content column.
- The resume preview was widened on desktop so it is readable beside the sticky print action panel.

## Architecture Decisions

- The app uses Next.js App Router with TypeScript.
- Page routes live under `app/`.
- Reusable UI and layout components live under `components/`.
- Small generic UI primitives live under `components/ui/`.
- Site content that is reused across pages lives in `lib/data.ts`.
- Tailwind class merging is centralized through `lib/utils.ts`.
- `PageShell` is the shared wrapper for the navbar, main route content, and footer.
- The navbar and footer both read navigation from `lib/data.ts` to keep route labels consistent.
- Unused historical components and their data fields should be removed instead of kept as speculative reuse.

## Styling Decisions

- Tailwind CSS is the main styling system.
- Global design tokens are defined in `app/globals.css` as CSS variables.
- Design direction (2026 redesign): "machine shop behind shower glass" — a fixed, scroll-driven gear-train background sits behind every page, and content floats above it on frosted-glass (backdrop-blur) panels, like machinery seen through the polycarbonate guard of a CNC mill.
- Typography: Chakra Petch (squared, mecha/robotics display face) for h1–h3 and the wordmark; Space Grotesk for body; JetBrains Mono for eyebrows, nav links, badges, timeline years, and other "engineering annotation" text. Loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-display` / `--font-sans` / `--font-mono`, wired in `tailwind.config.ts` (`font-display`, `font-sans`, `font-mono`).
- Accent shifted from soft amber to safety orange: `--accent` retuned and a new `--hazard` token (+ Tailwind `hazard` color) marks slashes, hover borders, and interactive highlights. Cyan (`--primary`) = information; orange (`--hazard`) = action/hazard.
- Eyebrow labels are mono uppercase prefixed with an orange `//` (rendered as `{"//"}` in JSX to satisfy `react/jsx-no-comment-textnodes`).
- Gear background: `components/gear-field.tsx` renders three clusters of SVG gears (generated by a `gearPath(teeth, module)` function with trapezoid teeth, rim/hub/bore circles, lightening holes, and CAD center marks) in a `position: fixed; z-index: -10` layer with a faint two-level drafting grid (`.gear-field::before`). Scrolling is the crank: a rAF-throttled scroll handler rotates each gear at a speed inversely proportional to its tooth count, with adjacent gears counter-rotating, so the meshing ratios are physically honest. Gears are static when `prefers-reduced-motion: reduce`. Clusters scale to 0.6 on mobile. Hidden in print.
- Glass system: `.glass-panel` (cards; blur(20px) saturate(1.45), light/dark variants), `.glass-hover` (150–160ms lift + cyan border), `.glass-bar` (navbar/footer). The `Card` primitive applies `glass-panel glass-hover` by default; pages must not re-add opaque `bg-card/NN` overrides or the gears will not show through.
- Nested backdrop-filters are avoided (Safari bugs): the homepage `.pcb-home` outer panel is a plain translucent tint, and only the chip card and pcb buttons inside it blur.
- Scroll reveals: `components/reveal-manager.tsx` observes `[data-reveal]` elements via IntersectionObserver and adds `.is-revealed`; hiding only activates once `.reveal-ready` is set on `<html>` so content stays visible without JS, and reduced-motion users get no animation.
- The homepage keeps the PCB-inspired visual language (traces, pads, pulses, chip card) layered over the gear field — electromechanical, but the PCB surfaces were made translucent so the gears show through.
- Mobile homepage behavior removes complex SVG traces and stacks the navigation actions.
- Print styles live in `app/globals.css` because print behavior needs to override global page chrome and layout.
- The printable resume uses exact physical units where helpful so browser print and Save as PDF output stay predictable.

## Component Decisions

- `Button` supports `asChild` so links can look like buttons without nesting invalid interactive elements.
- `Card`, `Badge`, and `SectionHeading` are lightweight primitives rather than a large design system.
- `Timeline` stays data-driven through `lib/data.ts`.

## Data Decisions

- `lib/data.ts` owns navigation items.
- `lib/data.ts` owns project titles, roles, descriptions, image paths, and tags.
- `lib/data.ts` owns timeline entries and contact links.
- Resume-specific detailed content currently lives inside `app/contact/page.tsx` because it is tightly tied to that route's print layout.
- Placeholder SVG files are used until final project imagery is available.

## Validation Decisions

- `npm run lint` is the standard lint command.
- `npm run build` is the standard production verification command.
- Current lint/build checks pass without warnings.
- Browser visual checks were used for the resume section to catch layout issues that lint/build cannot see.

## Agent Memory Decisions

- Future models should read `InfoForAgent/ProjectMemory.md` first for the most complete current handoff.
- `InfoForAgent/OpenItem.md` is the working checklist.
- `InfoForAgent/decisions.md` records durable architectural and product decisions.
- `InfoForAgent/overview.md` maps files and responsibilities.
- Any substantial project decision or completed task should update these notes so future models do not rediscover context.
- Claude/Fable 5 should use project-scoped lean agents in `.claude/agents/` for `code-explorer`, `code-architect`, and `code-reviewer` before using heavier plugin flows. Default to no subagent for small fixes, one focused subagent for medium tasks, and multiple parallel agents only when the user asks for deep or broad analysis.

## Known Follow-Up Decisions

- Replace placeholder project SVGs with final project images when available.
- Keep reviewing project descriptions for admissions, internship, or public portfolio wording.
- Static PDF hosting is now resolved: both a print-to-PDF flow and a committed downloadable PDF exist via the resume dropdown.
- Pagination/font-fit concerns from the old HTML reconstruction are moot now that the resume is a rasterized image of the real one-page PDF at its native 8.5x11in size — there is no re-flow risk.
