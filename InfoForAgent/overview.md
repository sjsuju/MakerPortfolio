# Project File Overview

This document explains what each file in the portfolio does and how the pieces fit together.

## Root Files

- `README.md`: Short repository introduction.
- `read.md`: Longer project notes covering site purpose, routes, content locations, stack, and publishing reminders.
- `InfoForAgent/overview.md`: This file. A file-by-file map of the codebase.
- `InfoForAgent/decisions.md`: Decision log for product, architecture, route, content, and styling choices made so far.
- `InfoForAgent/OpenItem.md`: Working checklist for future content, resume, design, engineering, and deployment tasks.
- `InfoForAgent/ProjectMemory.md`: Detailed handoff log for future agents and models.
- `package.json`: Project metadata, npm scripts, dependencies, and dev dependencies.
- `package-lock.json`: Locked dependency tree for reproducible npm installs.
- `next.config.ts`: Next.js configuration.
- `next-env.d.ts`: Generated Next.js TypeScript environment declarations. Do not edit manually.
- `tsconfig.json`: TypeScript compiler configuration.
- `tsconfig.tsbuildinfo`: TypeScript incremental build cache.
- `tailwind.config.ts`: Tailwind theme configuration, including container behavior, design tokens, radius values, and custom shadow.
- `postcss.config.js`: PostCSS configuration used by Tailwind.
- `eslint.config.mjs`: ESLint configuration for the Next.js and TypeScript project.
- `.gitignore`: Git ignore rules for dependencies, build output, local env files, and caches.

## App Routes

- `app/layout.tsx`: Root HTML layout. Imports global CSS, sets metadata, and renders all route children.
- `app/globals.css`: Global design tokens, base styling, fixed gear/wire background styling, liquid-glass card system, PCB homepage styling, responsive behavior, and resume print CSS.
- `app/page.tsx`: Homepage. Renders the PCB-inspired first screen with direct links to Projects, Contact, and the printable Resume route.
- `app/projects/page.tsx`: Projects page. Lists all projects from shared data, adds maker portfolio sections, and includes the timeline.
- `app/contact/page.tsx`: Contact, about, and resume page. Renders about content, contact cards, a resume preview, and the print-ready resume layout.
- `app/about/page.tsx`: Redirect route that sends old `/about` traffic to `/contact`.
- `app/resume/page.tsx`: Redirect route that sends old `/resume` traffic to `/contact`.
- `app/maker-portfolio/page.tsx`: Redirect route that sends old `/maker-portfolio` traffic to `/projects`.

## Components

- `components/page-shell.tsx`: Shared page wrapper that mounts the gear background and reveal manager, then places the navbar above page content and the footer below it.
- `components/gear-field.tsx`: Fixed scroll-driven gear and charge-wire background (procedural SVG gears over a drafting grid plus a scroll-following current node/path). Gear rotation speed is scroll-driven and mostly ratio-based, but gear meshing is still a known follow-up.
- `components/reveal-manager.tsx`: IntersectionObserver scroll reveals for `[data-reveal]` elements.
- `components/navbar.tsx`: Sticky responsive navigation. Uses `navItems` from `lib/data.ts` and supports a mobile menu.
- `components/footer.tsx`: Shared footer with short portfolio positioning and repeated navigation links.
- `components/print-resume-handler.tsx`: Client component that watches the query string and calls `window.print()` when `?print=resume` is present.
- `components/print-resume-button.tsx`: Client `Print / Download resume` dropdown with a `Print resume` action (`window.print()`) and a `Download PDF` action (links to `public/Sooraj-Sathyajith-Resume.pdf`).
- `components/section-heading.tsx`: Reusable centered section heading with optional eyebrow and body text.
- `components/timeline.tsx`: Timeline renderer using timeline data from `lib/data.ts`.
- `components/ui/button.tsx`: Reusable button primitive with variants, sizes, and Radix Slot support for `asChild` links.
- `components/ui/card.tsx`: Reusable card container and simple card content helper. Applies the shared liquid-glass surface by default.
- `components/ui/badge.tsx`: Reusable badge/span primitive with merged Tailwind classes and translucent glass-chip styling.

## Shared Libraries

- `lib/data.ts`: Main content source for navigation, project cards, timeline entries, and contact links.
- `lib/utils.ts`: Shared `cn()` helper that combines `clsx` and `tailwind-merge` for Tailwind class merging.

## Public Assets

- `public/placeholders/robotics.svg`: Placeholder artwork for the FTC robotics project.
- `public/placeholders/prosthetic.svg`: Placeholder artwork for the EMG prosthetic hand project.
- `public/placeholders/veridex.svg`: Placeholder artwork for the Veridex browser extension project.
- `public/placeholders/music.svg`: Placeholder artwork for the VibeShuffle / Spotify tuner project.
- `public/placeholders/portfolio.svg`: Placeholder artwork for the portfolio website project.
- `public/Sooraj-Sathyajith-Resume.pdf`: Committed static resume PDF served by the resume dropdown's `Download PDF` option.
- `public/resume-page-1.png`: Rasterized page 1 of the source resume PDF (2550x3300px, 300 DPI, exact 8.5:11 aspect ratio), used as the on-page resume preview and print source in `app/contact/page.tsx`. Regenerate from the source PDF whenever the resume changes; see `ProjectMemory.md`.

## Generated Or Local-Only Folders

- `.next/`: Next.js build and dev output. Generated locally and not meant to be edited.
- `node_modules/`: Installed npm dependencies. Generated by `npm install`.
- `.git/`: Git repository metadata.
- `.vscode/`: Local editor configuration.
- `.agents/`: Local agent/workflow metadata for this workspace.
