# Architecture: Spine

## 1. Stack (final, do not relitigate mid-build)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript strict | One repo, one deploy, server actions kill most API boilerplate |
| UI | Tailwind CSS + shadcn/ui + Recharts | Fast, consistent, chart lib that handles time series well |
| PWA | @serwist/next (service worker, offline queue, push) | Maintained successor to next-pwa |
| DB + Auth | Supabase (Postgres, RLS, magic link) | Relational data, SQL reporting, auth in 10 minutes |
| LLM | Anthropic API. Parser: claude-haiku-4-5-20251001. Coach: claude-sonnet-4-6 | Haiku = cheap/fast structured extraction; Sonnet = quality weekly reasoning. Verify current model names at https://docs.claude.com/en/api/overview |
| Push | web-push (VAPID) + Supabase push_subscriptions table | Standard Web Push, works on Android Chrome |
| Scheduling | Vercel Cron: ONE daily job 20:30 local-equivalent UTC | Hobby plan constraint: keep to a single daily cron; Sunday logic branches inside it |
| Deploy | Vercel, GitHub integration, preview deploys | Already in your workflow |
| Validation | zod everywhere data crosses a boundary | Especially re-validating LLM tool output |

Explicitly rejected: FastAPI/Railway (second deploy for zero benefit at this scale), LangGraph (no multi-step agent workflows exist here; two single-call LLM jobs), Firebase (document store fights relational reporting).

## 2. Data model (authoritative DDL in 03_schema.sql)

- `profiles` 1:1 with auth.users; timezone, reminder prefs.
- `habit_definitions` seeded fixed set; `input_type` in ('boolean','count').
- `daily_logs` unique (user_id, log_date); back_score, stress_score, sleep_hours, notes.
- `habit_entries` unique (user_id, log_date, habit_id); numeric value (booleans as 0/1).
- `milestones` category, target_date, status, criteria_text, sort.
- `flare_events` started_on, ended_on nullable, severity, suspected_trigger, notes.
- `weekly_reports` unique (user_id, week_start); content_md, risk_flag, model.
- `push_subscriptions` endpoint unique; keys.

All tables RLS: `user_id = auth.uid()`. Service-role key used ONLY inside cron route handlers.

## 3. App surface

### Server actions (mutations)
`upsertDailyScores(date, {back, stress, sleep})`, `toggleHabit(date, habitId, value)`, `startFlare(severity)`, `endFlare(id, trigger, notes)`, `updateMilestone(id, patch)`, `saveQuickLog(confirmedPayload)`.

### Route handlers
- `POST /api/quick-log/parse` -> calls Haiku with tool schema, returns preview payload (NO db write).
- `POST /api/push/subscribe` and `/unsubscribe`.
- `GET /api/cron/daily` (Vercel Cron, protected by CRON_SECRET header):
  - every day: find users with incomplete today -> send "Complete your spine" push.
  - if Sunday: aggregate last 28 days -> call Sonnet coach -> insert weekly_reports -> send report push.
- `POST /api/coach/generate-now` (rate limit 1/day) same generation path.

### Pages
`/` Today, `/dashboard`, `/milestones`, `/coach`, `/flare` (modal route), `/login`.

## 4. LLM integration pattern

Both calls go through one thin client `lib/anthropic.ts` using fetch to `https://api.anthropic.com/v1/messages` (or the official TS SDK; either is fine, pick SDK).

**Parser (Haiku):** tool-use with a single tool `log_day` whose input schema mirrors zod `QuickLogSchema` (03 of this doc + 06 prompts). `tool_choice: {type:"tool", name:"log_day"}` forces structured output. Server re-validates with zod. Unparseable fragments land in `unparsed_notes`. Response returned to client as a PREVIEW; user confirms; only then does `saveQuickLog` write.

**Coach (Sonnet):** system prompt = CLINICAL_CONTEXT + COACH_INSTRUCTIONS (both verbatim constants from 06). User message = JSON blob: 28 days of logs, habit adherence rates, flares, upcoming milestones, current phase. Output = markdown + a final line `RISK_FLAG: green|amber|red` parsed by regex into the risk_flag column.

Env: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_EMAILS`, `CRON_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`.

## 5. Folder structure

```
app/
  (app)/            # authed group: layout with bottom tabs
    page.tsx        # Today
    dashboard/page.tsx
    milestones/page.tsx
    coach/page.tsx
    flare/page.tsx  # modal route
  login/page.tsx
  api/
    quick-log/parse/route.ts
    push/subscribe/route.ts
    cron/daily/route.ts
    coach/generate-now/route.ts
components/
  spine/SpineWidget.tsx   # signature component
  ScoreDial.tsx  QuickLogBox.tsx  FlareChecklist.tsx
  charts/TrendChart.tsx  AdherenceBars.tsx  FlareBand.tsx
lib/
  supabase/ (client.ts, server.ts, middleware.ts)
  anthropic.ts  push.ts  dates.ts  schemas.ts (zod)
  prompts.ts    # constants copied verbatim from docs/06
docs/             # PRD, ARCHITECTURE, llm prompts (kit files live here)
public/           # manifest, icons, sw
```

## 6. Design tokens (from PRD section 7; implement as CSS vars + Tailwind theme)

```
--bg:        #0B1220   (ink night)
--surface:   #121B2E
--line:      #22304A
--text:      #EDE9E0   (bone)
--text-dim:  #8B96A8
--accent:    #2FD4B8   (recovery teal: completed states, spine fill)
--warn:      #E8A13D   (amber: risk flags only)
--flare:     #D96A5B   (muted red: Flare Mode only)
fonts: display "Space Grotesk"; body "IBM Plex Sans"; mono "IBM Plex Mono"
radius: 10px; spacing base 4px; touch targets >= 48px
motion: spine segment fill 150ms ease-out; nothing else animates
```

The SpineWidget: 6 stacked rounded-rectangle "vertebrae" (wider middle, tapering top/bottom), gap 6px, unfilled = --surface with --line border, filled = --accent with subtle inner glow. Column height ~44vh on mobile. This is the only decorative element in the app; keep everything else austere.

## 7. Offline strategy

Serwist precache shell; runtime cache GETs stale-while-revalidate. Mutations while offline enqueue to IndexedDB (simple queue in `lib/offlineQueue.ts`) and flush on `online` event. Today screen reads render from local cache first. Conflict rule: last-write-wins per field (single user, acceptable).

## 8. v2 parking lot (do not build now)

Bubblewrap TWA for Play Store APK; Google Fit steps auto-import; per-habit reminder times; CSV export; Sorensen test timer with history chart; light theme refinement.
