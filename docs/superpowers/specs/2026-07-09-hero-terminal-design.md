# Hero terminal design

Date: 2026-07-09
Status: approved pending review

## Purpose

Fill the empty left space in the home hero and restore the missing navigation
CTA with an interactive mini-terminal. It must not hurt the mobile experience,
so it collapses into a small floating button.

## Component

`components/hero-terminal.tsx`, a single client component with zero new
dependencies. Rendered only on the home page (`app/page.tsx`), docked in the
hero's left column under the description.

## States

One `mode` state: `"docked" | "popout" | "collapsed"`.

- **Docked** (desktop default): in-flow glass panel inside the hero left
  column. Title bar has two controls: pop out and collapse.
- **Popout**: `position: fixed` bottom-right panel (approx 420px wide, max
  90vw), same content, survives scrolling. Controls: dock back and collapse.
- **Collapsed**: small fixed round button, bottom-left, `>_` glyph, glass
  styling. Click expands to popout (desktop) or bottom sheet (mobile).
- **Mobile** (below md): always starts collapsed. Expanded state renders as a
  fixed bottom sheet (full width, capped height, rounded top corners). No
  docked mode on mobile.

Mode persists in `sessionStorage` (key `hero-terminal-mode`) so it does not
re-boot or re-expand unexpectedly during a session. Initial render uses the
breakpoint default to avoid hydration mismatch, then applies the stored mode
in an effect.

## Terminal behavior

- Boot sequence types four short lines on first expand per session
  (`> boot sequence initiated`, `> loading portfolio modules... ok`,
  `> 5 projects indexed`, `> type "help" for commands`). Skipped when
  `prefers-reduced-motion` is set, and not repeated within a session.
- Prompt line: `visitor@sooraj:~$ ` in hazard amber, input inherits mono font.
- Commands (case-insensitive, trimmed):
  - `help`: lists commands
  - `projects`: router.push `/projects`
  - `resume`: router.push `/contact#resume`
  - `contact`: router.push `/contact`
  - `whoami`: fun one-liner
  - `clear`: clears scrollback
  - unknown: `command not found: X (try "help")`
- Navigation commands print a `-> /path` line, then navigate after a short
  delay so the feedback is visible.
- Scrollback capped (keep last ~40 lines). Output area scrolls internally
  with a fixed height in docked/popout modes.

## Styling

Existing theme only: `.glass-panel` treatment, `--primary` blue,
`--hazard` amber, mono font stack already used for eyebrows. Works in light
and dark via existing CSS variables. No generic AI-card look: translucent
glass, subtle 1px borders, background stays visible. Floating button and
popout hidden in print (`print-hide`).

## Accessibility

- Panel: `role="region"` with `aria-label="Interactive terminal"`.
- Collapsed button: `aria-label="Open terminal"`, `aria-expanded`.
- Output: `aria-live="polite"`.
- Escape collapses popout/bottom sheet. Focus moves to input on expand and
  back to the floating button on collapse.

## Out of scope (deferred)

Command history with arrow keys, tab completion, dragging the popout,
site-wide availability on other pages, GitHub API integration. Add any of
these only when asked.

## Testing

Manual verification via the preview browser: boot animation, each command
navigates, mode transitions on desktop, collapsed-by-default and bottom sheet
on mobile viewport, Escape and focus behavior, light and dark themes,
`npx tsc --noEmit` clean.
