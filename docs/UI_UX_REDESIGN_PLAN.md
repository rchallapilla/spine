# July 10 UI/UX Redesign Plan

Status: **implemented** · Owner: agent · Goal: principal-level look & feel upgrade, then commit + push.

## Context (from logs)

- July 9 shipped **clarity** (labels, Guide tab, plain language) — not visual polish.
- July 10 request: improve colors / look & feel; research; self-iterate; commit + push.
- This plan was created July 10 after confirming no prior redesign plan existed.

## Design brief (constraints we keep)

From `docs/PRD.md` §7 and user rules:

| Keep | Change |
|---|---|
| Calm clinical recovery tool (not wellness spa, not purple AI) | Flat ink-night feels generic and lifeless |
| Dark evening-first (user logs at night) | Add atmosphere: subtle depth, not flat `#0B1220` slabs |
| Teal = completion / progress; amber = risk; red = flare only | Refine palette for better contrast & hierarchy |
| Spine widget is the emotional reward | Elevate spine + Today as one composed screen |
| Space Grotesk + IBM Plex | Tune sizes, weight, letter-spacing |
| One primary motion: spine fill | Add 2–3 intentional micro-motions (nav active, sheet open, score settle) — respect `prefers-reduced-motion` |
| No cards-for-decoration; no pill clusters; no glow spam | Surfaces that earn their borders |

**Avoid (user rule):** purple-on-white / indigo gradients; cream+serif+terracotta; broadsheet newspaper look; default Inter/Roboto; dark-mode purple glow clichés.

## Research synthesis (direction)

1. **Clinical night, not gamer HUD** — deep blue-green ink, warm bone text, one living accent (recovery teal). Feels like a quiet exam room at night, not a crypto dashboard.
2. **Atmosphere without noise** — soft radial wash behind Today header / spine; hairline borders with slightly warmer line color; elevated surfaces for interactive controls only.
3. **Hierarchy** — page titles larger/clearer; dim helper text quieter; accent reserved for *done* and primary CTAs.
4. **Touch** — keep ≥48px targets; bottom nav clearer active state (accent underline or soft fill, not just color swap).
5. **Signature spine** — labeled segments stay; refine fill (inner highlight, not neon glow); incomplete segments slightly recessed.

## Token proposal (v2)

```
--bg:         #070d18   (deeper ink)
--bg-glow:    radial wash teal/blue at ~8% opacity (CSS only)
--surface:    #101929
--surface-2:  #162235  (interactive / elevated)
--line:       #2a3a52
--text:       #f2efe6
--text-dim:   #8a96a9
--accent:     #3ecfba   (slightly clearer teal)
--accent-dim: #1a4a45
--warn:       #e8a13d
--flare:      #d96a5b
radius: 12px (was 10) for controls; keep austere elsewhere
```

Fonts unchanged: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (data).

## Implementation phases

### Phase A — Foundation (globals + layout)
- [x] Update `app/globals.css` tokens + `@theme`
- [x] Body background atmosphere (gradient/radial, subtle)
- [x] Shared utility classes: nav underline, sheet enter, spine fill
- [x] App shell header + bottom nav polish (`layout.tsx`, `BottomNav.tsx`)

### Phase B — Today (hero composition)
- [x] Today page spacing / section rhythm
- [x] SpineWidget visual refinement (fill, labels, ⓘ, counter)
- [x] ScoreDial elevated interactive surfaces + clearer typography
- [x] QuickLogBox quieter chrome, stronger primary button
- [x] Flare FAB / banner contrast check

### Phase C — Secondary screens
- [x] Guide accordion polish
- [x] Dashboard / Coach / Plan / Flare / Login / Settings / Dialogs consistency
- [x] shadcn `button` / `dialog` / `input` / `slider` token alignment

### Phase D — Self-iterate
- [x] Browser preview + screenshots
- [x] Contrast pass (text-dim on bg, accent on filled spine)
- [x] Update design tokens in `docs/ARCHITECTURE.md` + this plan status

### Phase E — Ship
- [x] `npm run build`
- [x] Commit (`6c91836`)
- [ ] Push to `origin/master` (approval UI failed; run locally: `git push origin master`)

## Out of scope

- New features, schema, multi-user Phase 2
- Light theme
- Replacing the Guide content or habit model
- Decorative illustrations / stock photos

## Success criteria

1. First glance at Today: clearly *Spine* (brand + lit spine), not a generic dark form.
2. Completed habits read as rewarding without neon/glow spam.
3. Scores and nav hierarchy obvious in one thumb-scroll.
4. Still calm enough for flare mode (no playful motion there).
5. Build green; committed and pushed.
