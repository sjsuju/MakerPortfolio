# Sooraj Sathyajith Maker Portfolio

This site is a technical maker portfolio for Sooraj Sathyajith. It presents robotics work, assistive technology, embedded systems, AI tooling, recommendation experiments, web deployment experience, and the build process behind those projects.

The portfolio is built as a Next.js app with TypeScript and Tailwind CSS. It uses reusable React components, shared data in `lib/data.ts`, placeholder project artwork in `public/placeholders`, and a responsive layout for desktop and mobile.

## Site Overview

The site focuses on hands-on engineering and product-minded technical work. The main story is that Sooraj builds systems where mechanical design, software, embedded control, iteration, and clear communication all matter.

Featured themes include:

- FTC robotics leadership and mechanism design.
- EMG-controlled prosthetic hand development.
- Local AI browser assistant workflows.
- Music recommendation and playlist tuning experiments.
- Web development, deployment, and portfolio storytelling.
- A repeatable build process: frame, prototype, instrument, and ship.

## Pages

### Home: `/`

The homepage introduces Sooraj as a technical maker and builder of robots, assistive devices, browser AI tools, and web systems.

It includes:

- Large name-focused introduction.
- Animated spinning gear background.
- Big navigation boxes for the remaining main pages.
- Direct links to the combined projects page and the combined contact/resume page.

### Projects: `/projects`

The projects page lists the full project set with descriptions, roles, images, and tags. It also includes the former maker portfolio content so project work and build-process context live together.

Current projects:

- FTC Team 23918 Super Sigma Robotics: founder, captain, and design lead.
- EMG Prosthetic Hand: embedded systems and mechatronics project.
- Veridex Browser Extension: local AI browser assistant concept.
- VibeShuffle / Spotify Tuner: music filtering and recommendation experiment.
- Portfolio Website: Flask, Docker, AWS, and web deployment project.

Maker portfolio sections:

- Robotics mechanisms.
- Assistive hardware.
- Embedded systems.
- Fabrication workflow.
- A timeline of key maker milestones.

Old `/maker-portfolio` links redirect to `/projects`.

### Contact + Resume: `/contact`

The contact page combines about, contact, and resume content.

It includes:

- About copy explaining the thinking behind the work.
- Working style notes.
- Email, GitHub, and LinkedIn cards.
- A send-email button.
- Screen resume preview and print-ready resume layout.
- Working print action through `/contact?print=resume#resume`.
- Timeline.

The current contact data is stored in `lib/data.ts`.

Old `/about` and `/resume` links redirect to `/contact`.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React icons
- Radix Slot
- ESLint

## Project Structure

```text
app/
  about/page.tsx
  contact/page.tsx
  maker-portfolio/page.tsx
  projects/page.tsx
  resume/page.tsx
  globals.css
  layout.tsx
  page.tsx

components/
  footer.tsx
  navbar.tsx
  page-shell.tsx
  print-resume-handler.tsx
  section-heading.tsx
  timeline.tsx
  ui/

lib/
  data.ts
  utils.ts

public/
  placeholders/

InfoForAgent/
  OpenItem.md
  ProjectMemory.md
  decisions.md
  overview.md
```

`InfoForAgent/` is the intended home for durable agent-readable project notes.
`.agents/` is treated as local tool scratch space and is ignored.

## Where Content Lives

Most site content is centralized in `lib/data.ts`.

Edit that file to update:

- Navigation links.
- Project names, roles, descriptions, tags, and images.
- Timeline items.
- Contact links.

Individual page copy lives inside the corresponding files under `app/`.

Collapsed routes are handled with redirects:

- `/about` redirects to `/contact`.
- `/resume` redirects to `/contact`.
- `/maker-portfolio` redirects to `/projects`.

## Styling

Global design tokens are defined in `app/globals.css` using CSS variables for colors, borders, background, and radius.

Tailwind theme settings are configured in `tailwind.config.ts`, including:

- Centered container layout.
- Custom color tokens.
- Border radius values.
- A reusable glow shadow.

The visual style is clean, technical, and portfolio-focused, with light backgrounds, teal and amber accents, cards, badges, sticky navigation, and responsive grids.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the production server after building:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

## Notes Before Publishing

- Replace placeholder contact information in `lib/data.ts`.
- Replace placeholder SVG images in `public/placeholders` with final project images if available.
- Add real external links for GitHub, LinkedIn, project demos, repositories, or writeups.
- Add or connect a downloadable resume PDF when ready.
- Review project descriptions for final admissions, internship, or public portfolio wording.
