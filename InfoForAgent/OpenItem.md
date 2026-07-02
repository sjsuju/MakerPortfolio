# Open Items

This is the working checklist for future cleanup, content, and polish.

## Content

- [ ] Replace placeholder project SVGs in `public/placeholders/` with final project images or richer project visuals.
- [ ] Review all project descriptions in `lib/data.ts` for final admissions, internship, or public portfolio wording.
- [ ] Confirm all contact details shown on `/contact` and in the printable resume are current and safe to publish.
- [ ] Add real external links for project demos, repositories, writeups, videos, or outreach materials when available.
- [ ] Decide whether the portfolio should include deeper case-study pages for each project or keep the current single `/projects` page.

## Resume

- [x] Decide whether to keep print-to-PDF only or also host a static downloadable PDF. Resolved: both, via the `Print / Download resume` dropdown; the static PDF is `public/Sooraj-Sathyajith-Resume.pdf`.
- [x] Update resume content to match the 2026 source resume and remove the home street address.
- [x] Resolve resume dimension fidelity: the on-page resume is now a rasterized image of the actual source PDF (`public/resume-page-1.png`) rather than a hand-built HTML approximation, so screen preview, print, and download all match the original 8.5x11in file exactly.
- [ ] Do a final visual proofread of the rasterized resume image at full size (zoom in) to confirm no text is clipped or blurry at the resolution it's rendered at.
- [ ] Keep `public/Sooraj-Sathyajith-Resume.pdf` and `public/resume-page-1.png` in sync whenever the source resume changes (regenerate the PNG from the new PDF; see `ProjectMemory.md` for the exact PyMuPDF command).

## Design And UX

- [ ] Test mobile layouts for `/`, `/projects`, and `/contact` after final content/images are added.
- [ ] Check the PCB homepage interaction and visual density on common laptop and phone viewport sizes.
- [ ] Replace any remaining placeholder-feeling copy in the about/contact sections with final voice.
- [ ] Verify color contrast after final images are added.
- [ ] Revisit gear meshing in `components/gear-field.tsx`; user deferred this while prioritizing liquid-glass card transparency.
- [ ] Continue tuning cards from screenshots toward Apple-style liquid glass: very transparent, clear/lens-like, bright rim highlights, and minimal smoky/tinted fill.

## Engineering

- [ ] Keep `npm run lint` warning-free.
- [ ] Keep `npm run build` passing before deployment.
- [ ] Remove speculative or unused components/data whenever a route no longer references them.
- [ ] Keep durable agent notes in `InfoForAgent/`; keep `.agents/` as ignored local scratch space.
- [ ] Update `InfoForAgent/ProjectMemory.md` after substantial project changes.

## Deployment

- [ ] Decide deployment target.
- [ ] Add production environment notes if deployment needs any provider-specific setup.
- [ ] Verify redirects for `/about`, `/resume`, and `/maker-portfolio` after deployment.
- [ ] Check metadata/title/description before publishing.
