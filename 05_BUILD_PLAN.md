# Build Plan: 8 milestones of copy-paste Cursor prompts

Rules: one milestone per Cursor session. Start every session with:
> Read /docs/PRD.md, /docs/ARCHITECTURE.md, /docs/06_llm_prompts.md and follow .cursor/rules. We are on Milestone N. Do not scaffold beyond it.

Run the acceptance checklist yourself before committing (`git commit -m "M<N>: <name>"`).

---

## M0: Scaffold
**Prompt:**
"Milestone 0. Create the Next.js 15 App Router project with TypeScript strict, Tailwind, shadcn/ui (init with dark default), @serwist/next, Recharts, zod, date-fns + date-fns-tz, @supabase/supabase-js + @supabase/ssr, web-push, @anthropic-ai/sdk. Set up the folder structure from ARCHITECTURE section 5, the design tokens from section 6 as CSS variables + tailwind theme (fonts via next/font: Space Grotesk, IBM Plex Sans, IBM Plex Mono), an `.env.example` listing every env var from ARCHITECTURE section 4, and a bottom tab layout for the (app) group with tabs Today / Dashboard / Milestones / Coach using placeholder pages. Add the PWA manifest (name Spine, theme #0B1220) and a placeholder icon."

**Accept:** `pnpm dev` runs; tabs navigate; dark tokens visible; `pnpm build` passes.

## M1: Auth + profile bootstrap
**Prompt:**
"Milestone 1. Implement Supabase magic-link auth: /login page (email input, sent-state), auth callback route, middleware protecting the (app) group, sign-out in a minimal settings sheet. Gate access to emails in ALLOWED_EMAILS (comma-separated env), checked server-side after auth. On first login, create the profiles row and copy all milestone template rows (user_id null) into user-owned milestone rows. Timezone: capture from browser on first login into profiles."

**Accept:** magic link round-trip works locally and on Vercel; non-allowed email is rejected with a plain message; profiles + 14 user milestones exist after first login.

## M2: Today screen core (then DEPLOY)
**Prompt:**
"Milestone 2. Build the Today screen per PRD 4.1 without the quick-log box: date header with streak (streak = consecutive days where all 6 habits complete), the SpineWidget (6 vertebra segments per ARCHITECTURE section 6, tap toggles boolean habits, walks segment long-press opens a count stepper sheet), and three score controls for back/stress/sleep opening a large slider sheet. Server actions: toggleHabit, upsertDailyScores with upsert semantics and zod validation. Allow editing any of the last 7 days via a small date strip. Add the persistent Flare button (routes to /flare placeholder)."

**Accept:** a full day logs in under 30 seconds by thumb; refresh persists; yesterday editable; deployed to Vercel and installable from Chrome (Add to Home Screen).

## M3: Dashboard
**Prompt:**
"Milestone 3. Build /dashboard per PRD 4.3: range toggle 7/30/90; TrendChart (Recharts LineChart) with back/stress/sleep as toggleable series; adherence section with per-habit % bars and overall %, current + best streak; flare bands rendered under the trend chart (ReferenceArea) from flare_events; week-over-week deltas for the three scores and adherence. All queries via server components with a single SQL round-trip per section; create a `lib/queries.ts`."

**Accept:** with 10+ days of data every chart renders correctly; empty state (no data) is a clean invitation, not an error; mobile layout has no horizontal scroll.

## M4: Milestones + Flare Mode
**Prompt:**
"Milestone 4. Build /milestones per PRD 4.4: grouped by category, status cycling (todo -> scheduled -> done, long-press to skip), target-date picker, notes sheet, criteria_text rendered as a sub-checklist. Build Flare Mode per PRD 4.2: Start-flare with severity slider creates flare_event; protocol checklist and ER list rendered from FLARE_PROTOCOL and ER_FLAGS constants in lib/prompts.ts (copied verbatim from /docs/06); active-flare banner on Today; End-flare captures end date + suspected trigger. Flare-red color appears only inside this flow."

**Accept:** start-to-visible-protocol in 2 taps; active flare shows as band on dashboard; ER list pinned and legible.

## M5: LLM quick-log
**Prompt:**
"Milestone 5. Implement /api/quick-log/parse per ARCHITECTURE section 4: Anthropic SDK, model claude-haiku-4-5-20251001, forced tool_choice on tool `log_day` whose JSON schema mirrors QuickLogSchema in lib/schemas.ts, system prompt PARSER_SYSTEM from lib/prompts.ts (verbatim from /docs/06). Re-validate output with zod; on failure return a friendly parse-error. Build the QuickLogBox on Today: input -> parse -> preview card showing exactly what will be saved (scores, habit changes, flare, notes) -> Confirm calls saveQuickLog server action -> spine updates. Never write without confirmation."

**Accept:** "walked 3x, big3 and hips done, back 4 stress 6 slept 7.5" fills everything correctly; "felt weird after standing a lot" lands in notes with no score guesses; API key absent from client bundle (verify with build analyzer or grep of .next/static).

## M6: Weekly coach + cron
**Prompt:**
"Milestone 6. Implement coach generation in lib/coach.ts: aggregate last 28 days (logs, adherence per habit, flares, milestone status, current_phase) into a compact JSON; call claude-sonnet-4-6 with system prompt CLINICAL_CONTEXT + COACH_INSTRUCTIONS from lib/prompts.ts; parse trailing RISK_FLAG line; insert into weekly_reports. Build /coach page: latest report as rendered markdown with a risk badge, history list, and a Generate-now button rate-limited to once per day. Implement GET /api/cron/daily protected by CRON_SECRET: sends evening push placeholder log for now (push lands in M7) and on Sundays generates the report. Add vercel.json cron entry for one daily run."

**Accept:** Generate-now produces a sensible report from real data; risk_flag stored; cron endpoint 401s without secret and runs clean with it (test via curl).

## M7: Push notifications + offline
**Prompt:**
"Milestone 7. Web Push: generate VAPID keys (document the npx web-push command in README), /api/push/subscribe storing subscription, permission prompt behind an explicit 'Enable reminders' button in settings (never on load), service worker push + notificationclick handlers opening the app. Wire cron/daily to send 'Complete your spine' at the daily run to users whose today is incomplete, and the Sunday report notification. Offline: Serwist precache app shell; IndexedDB mutation queue in lib/offlineQueue.ts wrapping toggleHabit/upsertDailyScores; flush on online; Today reads render from cache first with a subtle 'offline, will sync' indicator."

**Accept:** notification received on a real Android phone with app closed; airplane-mode logging syncs correctly on reconnect.

## M8: Polish + hardening
**Prompt:**
"Milestone 8. Pass over the whole app: loading skeletons, empty states written per the copy rules, error toasts with retry, reduced-motion respected, Lighthouse PWA + accessibility 90+, 404/redirects, favicon + maskable icon, verify RLS by attempting cross-user reads with a second test account (must fail), confirm service key and Anthropic key absent from client bundle, add a README with setup + env + VAPID + cron notes."

**Accept:** Lighthouse PWA installable + a11y >= 90; second-account access denied; you would show this app to a stranger.

---

## After M8 (v2 parking lot, only if still useful after 4 weeks of real use)
Bubblewrap TWA for a Play Store APK; Google Fit step import; CSV export; Sorensen timer with history; per-habit reminder times.
