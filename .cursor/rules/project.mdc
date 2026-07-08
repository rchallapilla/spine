# Save this file's contents as `.cursor/rules/project.mdc` in the repo root

---
description: Spine app project rules
alwaysApply: true
---

You are building "Spine", a single-user recovery-tracking PWA. The source of truth is /docs/PRD.md and /docs/ARCHITECTURE.md. When a decision is ambiguous, follow those docs; do not invent alternative architectures, libraries, or schemas.

## Stack rules
- Next.js 15 App Router, TypeScript strict mode, no `any`. Tailwind + shadcn/ui. Recharts for charts. Supabase JS v2. @serwist/next for PWA.
- Mutations via server actions in `app/actions/`. Route handlers only for: LLM parse, cron, push subscribe, coach generate-now.
- Every payload crossing a boundary (form, LLM output, API body) is validated with zod schemas from `lib/schemas.ts`. LLM tool output is ALWAYS re-validated server-side before any write.
- Secrets only in server code. `SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` must never appear in client bundles. Cron route checks `CRON_SECRET` header and returns 401 otherwise.
- Supabase RLS is the security model; client uses anon key + session, no service key outside cron/coach routes.

## Code style
- Small focused components; one component per file; server components by default, `"use client"` only where interaction requires it.
- Dates: store as `date` (YYYY-MM-DD) in user's timezone from `profiles.timezone`; all date math through `lib/dates.ts` (use date-fns + date-fns-tz). Never use raw `new Date()` string slicing for log_date.
- Errors: server actions return `{ok: true, data} | {ok: false, error}`; never throw across the client boundary. Show errors as inline toast, plain language, with the failed action retryable.
- Copy style: sentence case, plain verbs, no exclamation marks, buttons say what they do ("Save day", "Start flare", "End flare").

## Design rules
- Implement design tokens from ARCHITECTURE section 6 as CSS variables in `globals.css` and mirror in tailwind config. Do not introduce new colors. Amber only for risk, flare-red only inside Flare Mode.
- Dark theme is default. Touch targets >= 48px. `prefers-reduced-motion` disables the spine fill animation.
- The SpineWidget is the only decorative element. Everything else is quiet: no gradients, no card shadows deeper than subtle, no emoji in UI.

## LLM rules
- Prompts are constants in `lib/prompts.ts`, copied VERBATIM from /docs/06_llm_prompts.md. Do not paraphrase or "improve" clinical content.
- Parser: model `claude-haiku-4-5-20251001`, forced tool_choice on tool `log_day`, max_tokens 1000. Coach: model `claude-sonnet-4-6`, max_tokens 2000. Both with 15s timeout and one retry.
- The parse endpoint returns a preview; it never writes to the database.

## Process rules
- Work one milestone at a time from /docs (the build plan). Do not scaffold ahead. After each milestone print a manual test checklist for the user.
- If a package is needed that is not named in ARCHITECTURE, ask before adding it.
- Never mock data in shipped code paths; seed data lives only in SQL.
