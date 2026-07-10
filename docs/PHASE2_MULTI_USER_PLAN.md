# Phase 2 Plan: Multi-User Enablement

Status: planned, not implemented. Written 2026-07-08.

Goal: open Spine to other users with minimal architectural change — shared Anthropic key with per-user rate limits as the default path, optional bring-your-own-key later, plus fixing the one real blocker: the coach prompt is hardcoded with Raghu's personal clinical history.

## Good news: the architecture is already multi-user

No structural changes are needed. The original single-user design happens to be multi-user safe:

- Every table keys on `user_id` with RLS (`user_id = auth.uid()`) — see `03_schema.sql`
- First-login bootstrap clones milestone templates per user (`app/actions/auth.ts`)
- The daily cron already loops over **all** profiles, honoring each user's timezone and reminder prefs (`app/api/cron/daily/route.ts`)
- `generate-now` is already rate-limited per user (1/day) in `lib/coach.ts`

Adding a user is literally: append their email to `ALLOWED_EMAILS` in Vercel and redeploy.

## The four real gaps

1. **Clinical prompt is Raghu's medical record.** `CLINICAL_CONTEXT` in `lib/prompts.ts` hardcodes MRI findings, age, and case history. Another user's weekly coach would reason from *someone else's* spine. This is the only must-fix before sharing.
2. **Quick-log parse has no per-user rate limit** — only an auth check. A logged-in user could spam it against the shared Anthropic key.
3. **Supabase's built-in mailer** (~3-4 magic links/hour) won't survive more than 1-2 users.
4. **Milestones/habits are Raghu's program** — acceptable if sharing with people doing a similar recovery program; genericizing is optional work otherwise.

## Cost reality check (shared key)

Per active user per month, roughly:

- Quick-log (Haiku): ~30 parses x ~700 tokens — under $0.05
- Weekly coach (Sonnet): ~4-5 reports x ~3k tokens — about $0.20-0.30

**Total: well under $0.50/user/month.** Sharing the key with a handful of trusted people is economically trivial. BYO-key is an isolation/trust feature, not a cost necessity.

## Recommendation: Stage 1 now, Stage 2 only if needed

### Stage 1 — Shared key with guardrails (small, recommended)

1. **Per-user clinical context**
   - Add `profiles.clinical_context text` (nullable) via a small SQL migration
   - Add a generic `GENERIC_CLINICAL_CONTEXT` constant (safe, non-personalized coaching frame with the same safety rules)
   - `lib/coach.ts`: use `profile.clinical_context ?? GENERIC_CLINICAL_CONTEXT` instead of the hardcoded constant; Raghu pastes his existing context into his own profile row once
   - Optional: textarea in the settings sheet so users can edit their own context

2. **Rate-limit quick-log parse**
   - New `llm_calls` table (`user_id`, `kind`, `created_at`, RLS) via migration
   - In `app/api/quick-log/parse/route.ts`: reject with 429 after N calls/day (e.g. 20)

3. **Spend cap (no code)** — set a monthly budget limit in the Anthropic console so worst case is bounded.

4. **Custom SMTP (no code)** — connect Resend/SendGrid in Supabase Auth settings so magic links don't rate-limit with 2+ users.

5. **Onboarding = allowlist** — add each person's email to `ALLOWED_EMAILS`. Keeping this gate is what makes the shared key safe; do not remove it.

### Stage 2 — Optional BYO API key (only for isolation or >5-10 users)

1. Add `profiles.anthropic_key_encrypted text` (nullable); encrypt/decrypt server-side with a new `KEY_ENCRYPTION_SECRET` env var (AES-GCM in a small `lib/crypto.ts`)
2. Settings sheet: "Use your own Anthropic key" input; validate with a cheap test call before saving
3. `lib/anthropic.ts`: accept an optional per-user key; resolution order: user's key -> shared env key
4. Optional strict mode: env flag `REQUIRE_BYOK=true` makes LLM features return a friendly "add your API key in settings" error for users without one, so the shared key is never used by others

Stage 2 is additive — nothing in Stage 1 gets reworked.

## What deliberately stays unchanged

- Auth flow, RLS model, server actions, cron structure, PWA/offline — all already multi-user
- Fixed habit set and milestone templates (fine for similar recovery programs; genericizing is v2 parking-lot material)
- Vercel Hobby single daily cron

## Execution order

1. SQL migration: `profiles.clinical_context` + `llm_calls` table
2. Code: generic clinical context fallback + parse rate limit
3. Config (owner): Anthropic spend cap, Resend SMTP in Supabase, add first guest email to `ALLOWED_EMAILS`
4. Later, if wanted: Stage 2 BYOK
