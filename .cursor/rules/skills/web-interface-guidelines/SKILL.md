---
name: web-interface-guidelines
description: Vercel Web Interface Guidelines - usability, accessibility, and interaction-quality rules for UI code. MUST be used when writing or reviewing any component, form, animation, or page in this app. Ruleset inlined from vercel-labs/web-interface-guidelines (fetched 2026-07-11); re-fetch https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md for the latest.
source: vercel-labs/agent-skills (skills/web-design-guidelines/)
---

# Web Interface Guidelines

Check UI code against these rules. Output findings in terse `file:line` format.

## Accessibility
- Icon-only buttons need `aria-label`
- Form controls need a label or `aria-label`
- Interactive elements need keyboard handlers
- `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div>`)
- Images need `alt` (or `alt=""` if decorative); decorative icons `aria-hidden="true"`
- Async updates (toasts, validation) need `aria-live="polite"`
- Semantic HTML (`nav`, `main`, `header`, `section`) before ARIA
- Headings hierarchical h1-h6; skip link for main content
- `scroll-margin-top` on heading anchors

## Focus states
- Visible focus on interactive elements: `focus-visible:ring-*` or equivalent
- Never `outline-none` without a focus replacement
- Prefer `:focus-visible` over `:focus`; `:focus-within` for compound controls

## Forms
- Inputs need `autocomplete` and meaningful `name`; correct `type` and `inputmode`
- Never block paste
- Labels clickable (`htmlFor` or wrapping)
- `spellCheck={false}` on emails/codes/usernames
- Checkbox/radio: label + control share one hit target
- Submit stays enabled until request starts; spinner during request
- Errors inline next to fields; focus first error on submit
- Placeholders end with `…` and show example pattern
- Warn before navigation with unsaved changes

## Animation
- Honor `prefers-reduced-motion`
- Animate `transform`/`opacity` only; never `transition: all`
- Correct `transform-origin`; animations interruptible

## Typography
- `…` not `...`; curly quotes; non-breaking spaces for units/brands
- Loading states end with `…`
- `tabular-nums` for number columns/comparisons
- `text-wrap: balance`/`text-pretty` on headings

## Content handling
- Long content: `truncate`, `line-clamp-*`, or `break-words`; flex children `min-w-0`
- Handle empty states; anticipate short/average/very long user content

## Images
- Explicit `width`/`height` (prevents CLS); below-fold `loading="lazy"`

## Performance
- Virtualize lists >50 items; no layout reads in render; batch DOM reads/writes
- Prefer uncontrolled inputs; controlled must be cheap per keystroke

## Navigation & state
- URL reflects state (filters, tabs, pagination in query params)
- Links use `<a>`/`<Link>` (Cmd/Ctrl+click support)
- Destructive actions need confirmation or undo window

## Touch & interaction
- `touch-action: manipulation`; intentional `-webkit-tap-highlight-color`
- `overscroll-behavior: contain` in modals/drawers/sheets
- `autoFocus` sparingly; avoid on mobile

## Safe areas & layout
- Full-bleed layouts need `env(safe-area-inset-*)`
- Avoid unwanted scrollbars; flex/grid over JS measurement

## Dark mode & theming
- `color-scheme: dark` on html for dark themes (fixes scrollbar, native inputs)
- `theme-color` meta matches page background
- Native `<select>`: explicit `background-color` and `color`

## Locale
- `Intl.DateTimeFormat`/`Intl.NumberFormat`, not hardcoded formats

## Hydration safety
- Inputs with `value` need `onChange` (or `defaultValue`)
- Guard date/time rendering against server/client mismatch

## Hover & interactive states
- Buttons/links need `hover:` feedback; hover/active/focus more prominent than rest

## Content & copy
- Active voice; numerals for counts; specific button labels ("Save API key" not "Continue")
- Error messages include the fix, not just the problem; second person

## Anti-patterns (flag)
- `user-scalable=no` / `maximum-scale=1`; blocked paste; `transition: all`
- `outline-none` without replacement; div/span with click handlers
- Images without dimensions; inputs without labels; icon buttons without `aria-label`
- Hardcoded date/number formats; unjustified `autoFocus`
