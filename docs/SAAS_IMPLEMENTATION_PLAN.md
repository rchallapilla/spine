# SaaS Conversion: Implementation Plan

Status: planned, not implemented. Written 2026-07-11.
Sources: `.cursor/rules/skills/` (saas-foundations, product-guardrails, compliant-copy), current codebase, `docs/PHASE2_MULTI_USER_PLAN.md` (which this plan supersedes and absorbs).

Goal: convert the personal Spine PWA into a commercial multi-tenant wellness SaaS while keeping the owner's personal experience fully intact, following the three skills — with three explicit, reasoned deviations listed below.

---

## 1. Current-state audit (what the skills change)

What already complies:

- Every table keys on `user_id` with RLS — genuinely multi-tenant at the data layer.
- Cron loops over all profiles with per-user timezone; `generate-now` is rate-limited 1/day.
- The coach prompt already refuses diagnosis/medication and replaces the whole report with "seek urgent care" when red-flag language appears in notes (`lib/prompts.ts`) — a rough draft of the required red-flag hard stop, but it runs *inside* the LLM call, not before it.
- No ads, no tracking pixels, no analytics at all today.

What violates the skills **for non-owner users** (fine for the owner under Tier 1):

| Item | Where | Skill rule broken |
|---|---|---|
| Hardcoded personal clinical history in coach prompt | `lib/prompts.ts` `CLINICAL_CONTEXT` | Tier 2/3 users must never get owner's context |
| Personal medical narrative, MRI findings, supplement **dosages** (creatine 3-5g, magnesium 200-400mg, NSAID advice) | `lib/guideContent.ts` (`SUPPLEMENTS`, `DIAGNOSIS_PLAIN`, `FLARE_GUIDE`) | "No medication, supplement, dosage content anywhere" for non-owner users |
| Banned vocabulary in shared UI copy: "cure", "pain-free", "treatment", "diagnosis" | `lib/guideContent.ts`, guide UI | compliant-copy vocabulary law |
| No red-flag pre-check before LLM sees quick-log text | `app/api/quick-log/parse/route.ts` | Guardrails: check runs BEFORE the LLM, cannot be prompt-disabled |
| No per-user rate limit on quick-log parse | same route | LLM cost/abuse controls |
| Supabase built-in mailer (~3-4 magic links/hr) | auth flow | Must be replaced before any second user |
| No consents, no 18+ gate, no intake screener, no export/delete | — | All launch-blocking |

Gap in the skills themselves: saas-foundations references "the funnel in 05_MARKETING section 7" — no such document exists in this repo. The activation definition (7 `day_logged` events within 14 days of signup) is specified in the skill, so analytics work is unblocked, but a marketing doc needs to be authored or imported before the funnel dashboard step.

---

## 2. Where I disagree with the skills, and the alternatives

The skills are well-constructed; I follow them ~90%. Three deviations, each with reasoning:

### 2a. Defer clinic (B2B) tenancy to a later phase — do not build it in the first pass

The skill describes clinics, clinician roles, patient rosters, a clinician program editor with a compliance linter, adherence-only dashboards, and a BAA env flag. That is the single largest scope item in the entire document — realistically bigger than Stripe + guardrails + analytics combined — and it serves a customer segment (clinics) that requires a sales motion no solo founder has before B2C revenue exists.

**Alternative:** ship B2C first (Tier 1 owner + Tier 2 invited/self-serve users on generic tracks), but make the schema forward-compatible now so clinics bolt on without a migration: nullable `clinic_id` on `profiles`, a `role` enum (`owner`, `member`, future `clinician`), and the authorship-tier concept baked into how coach context is resolved from day one. Nothing in the guardrails is weakened — Tier 3 simply has zero users until the clinician editor exists. The skill's own build order (section 9) never sequences clinics, so this is a sequencing decision, not a rule violation.

### 2b. No chat coach at launch — the weekly report *is* the coach

The skill's cost controls assume a chat coach ("coach messages, e.g., 20/day"). The current product has no chat; it has a weekly Sonnet report plus a 1/day generate-now button, which is cheaper, safer (no free-form conversation surface to contain), and already built. Building chat means building the full containment stack (output filter, regeneration fallback, injection posture on a conversational surface) for a feature with unproven demand.

**Alternative:** launch with report-only coaching. The red-flag pre-check, prompt-injection delimiting, and output filter still get built (they apply to quick-log parse and report generation), so when chat is added later the guardrail machinery already exists. `usage_counters` is designed generically (`counter_type` column) so chat caps slot in without schema change.

### 2c. Intake screener: pregnancy is a full stop in v1, not a re-route

The skill routes pregnant users to "clinician-guided programs" — which are a Tier 3/clinic feature that doesn't exist yet (per 2a). Routing to a feature that doesn't exist is worse than declining.

**Alternative:** in v1, pregnancy checks the same polite full-stop screen as the other screener items. The guardrails skill itself endorses this: "When uncertain, the answer is the more conservative design." Re-route lands with the clinic phase.

Minor refinements (not disagreements): the 7-day trial applies to `pro_monthly` and `pro_annual` only — `founding_annual` is already discounted 33% and stacking a trial on it invites abuse; `ALLOWED_EMAILS` is removed behind a `PUBLIC_SIGNUP` env flag rather than deleted, so beta stays gated until the launch-blocking items (consents, screener, export/delete) all pass.

---

## 3. The content fork (prerequisite for everything)

The deepest change is not billing — it is that `lib/guideContent.ts` and `lib/prompts.ts` are the owner's personal medical record rendered as an app. The commercial product needs two content planes:

- **Owner plane (Tier 1):** everything as-is — personal clinical context, supplement verdicts, MRI plain-language, personal milestones. Stored per-profile (`profiles.clinical_context`, owner-only content rows), shown only when `profile.role = 'owner'`.
- **Generic plane (Tier 2):** a generic wellness habit guide — same six habits, exercise how-tos with generic names and original descriptions, glossary, flare *checklist* (movement, positions of ease, ER red-flag list) — with all medication/supplement/dosage content removed, banned vocabulary rewritten per compliant-copy patterns, and a `reviewed_by` DPT credit slot. Coach prompts for Tier 2 use a generic fallback context plus self-selected track, never user-authored medical history.

Concretely: split `guideContent.ts` into `guideContent.generic.ts` (DPT-review pending) and `guideContent.owner.ts`; a `getGuideContent(profile)` resolver picks the plane. Same pattern for `CLINICAL_CONTEXT` → `getCoachContext(profile)`.

This is Phase 0 because every later phase (paywalls, emails, analytics) touches user-facing strings that must already be on the compliant plane.

---

## 4. Build order

Follows saas-foundations section 9, with 2a/2b/2c applied. Every phase ends with the product-guardrails ship checklist (section 5 of that skill). Non-owner accounts get **no AI features until Phase 4 ships** — enforced by a server check, not a UI hide.

### Phase 0 — Content fork & compliance groundwork
- Split content into owner/generic planes (section 3 above); vocabulary pass on all shared UI strings against the banned list.
- Env flags: `PUBLIC_SIGNUP` (off), `AI_FEATURES_ENABLED` (kill switch, on), `BAA_MODE` (off, attorney-gated, unused until clinics).
- Add disclosure moments: onboarding not-medical-advice consent line, program page footers, flare checklist first-open modal, coach header "Habit coach, not a clinician."

### Phase 1 — Multi-tenant auth, consents, provisioning
- Google OAuth alongside magic link; Resend custom SMTP replaces Supabase mailer (hard prerequisite for user #2).
- `profiles` auto-provision trigger on signup (replaces first-login bootstrap); add `role`, `plan`, `stripe_customer_id`, nullable `clinic_id`.
- `consents(user_id, doc_type, version, accepted_at, ip_hash)`; 18+ attestation + ToS/Privacy checkboxes at signup; consent re-prompt on version bump.
- Intake screener before any program: self-attestation checklist per guardrails section 2, full-stop screen on any check (incl. pregnancy per 2c), stored with timestamp + policy version, no workaround path.
- `/terms` and `/privacy` routed and versioned (attorney-reviewed text is a human dependency, section 6).

### Phase 2 — Entitlements + Stripe (test mode end-to-end)
- Products: `pro_monthly` $9.99, `pro_annual` $59.99, `founding_annual` $39.99 (archive after 200 sales). 7-day trial on monthly/annual only.
- Hosted Stripe Checkout + Customer Portal; no custom card forms.
- `/api/stripe/webhook`: signature-verified, idempotent by event id, handles `checkout.session.completed`, `customer.subscription.updated/deleted`, `invoice.payment_failed`; writes `entitlements(user_id, plan, status, current_period_end)`. App reads entitlements only from this table.
- 7-day grace on payment failure → free. Stripe Tax on. Test clocks for renewal logic.

### Phase 3 — Plan gating + paywalls
- `getEntitlement(userId)` server helper as single source; typed `plan` to UI.
- Free: tracker + flare checklist (safety content never paywalled, by policy). Pro: AI coach report, trends >30 days, full program library, export.
- Paywall copy written under compliant-copy (sell the system, never an outcome).

### Phase 4 — Guardrail middleware (before any AI reaches non-owners)
- Server-side red-flag pattern pre-check on ALL user free text (quick-log, notes) before any LLM call; fixed seek-care response on match; event logged flag-only; self-harm language routes to crisis resources.
- User text wrapped in delimited untrusted-data blocks; never in system prompts.
- Coach report prompt v2 per containment spec: role limits, hard refusals, claims capped to user's own logged data; output filter greps report against banned-claims patterns, one regeneration, then static fallback. Prompts versioned in repo.
- Per-user `usage_counters`: report generations 1/day (exists — move to table), parse calls capped (e.g., 30/day), friendly limit copy.
- Token-usage logging per user; `AI_FEATURES_ENABLED` kill switch honored in every AI route.

### Phase 5 — Analytics (PostHog)
- Event allowlist exactly as specified in saas-foundations section 5; properties restricted to plan/platform/counts; never free text, scores, or health fields; session recording off.
- Activation metric: 7 `day_logged` in 14 days. One funnel dashboard (marketing doc needed for the full funnel definition — flagged gap).

### Phase 6 — Email (Resend + react-email)
- Transactional: magic link, trial-ending, payment-failed (receipts via Stripe).
- Lifecycle: onboarding D0/D2/D7, D3 activation nudge, weekly report notification, D30 win-back; `emails` log table; max 1 lifecycle/day/user; unsubscribe for lifecycle only.
- Subject lines and previews never mention pain or symptoms (lock-screen privacy rule).

### Phase 7 — Admin + support
- `/admin` (service-role, owner allowlisted): user lookup, entitlement view/override, per-user usage/cost, red-flag event log (flags only), Stripe refund link.
- `support@` inbox + in-app "Email us" link; 14-day no-questions refund on annual in ToS.

### Phase 8 — Export & delete (launch-blocking, not backlog)
- Data export: JSON of all user rows.
- Delete account: cancels Stripe sub, 30-day soft-delete then purge job, email confirmation.

### Phase 9 — Production readiness pass
- Sentry server+client with PII scrubbing; health-text redaction middleware on logs.
- Rate limiting (Upstash) on auth, parse, report, webhook routes.
- Supabase PITR on; weekly schema export; private secrets runbook.
- Full guardrails ship-checklist sweep of every screen; flip `PUBLIC_SIGNUP` only when Phases 1, 4, and 8 are all green.

### Later phases (explicitly deferred)
- **Clinics/B2B (Tier 3):** clinician editor + linter, adherence-only dashboards, patient invites, BAA flag. Schema is already shaped for it.
- **Chat coach:** slots into existing guardrail + counter machinery.
- **Marketing doc + funnel dashboard completion.**

---

## 5. Schema deltas (sketch)

```sql
alter table profiles add column role text not null default 'member'; -- 'owner' | 'member' | 'clinician'
alter table profiles add column plan text not null default 'free';
alter table profiles add column stripe_customer_id text;
alter table profiles add column clinic_id uuid; -- null until clinics phase
alter table profiles add column clinical_context text; -- Tier 1 only; null for members

create table consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  doc_type text not null, -- 'tos' | 'privacy' | 'age_18' | 'intake_screener'
  version text not null,
  accepted_at timestamptz not null default now(),
  ip_hash text
);

create table entitlements (
  user_id uuid primary key references auth.users,
  plan text not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table usage_counters (
  user_id uuid not null references auth.users,
  counter_type text not null, -- 'parse' | 'report' | future 'chat'
  day date not null,
  count int not null default 0,
  tokens_in bigint default 0,
  tokens_out bigint default 0,
  primary key (user_id, counter_type, day)
);

create table safety_events ( -- red-flag log, flags only
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  surface text not null, -- 'quick_log' | 'notes' | 'report_input'
  flag_type text not null,
  created_at timestamptz not null default now()
);

create table emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  template text not null,
  sent_at timestamptz not null default now()
);
-- RLS on all of the above; entitlements/usage_counters/safety_events written only via service role.
```

---

## 6. What only you can do (everything else is buildable autonomously)

1. **Stripe account** — create, share test-mode keys; live keys at launch. Enable Stripe Tax.
2. **Resend account + sending domain** — verify DNS for your domain.
3. **PostHog account** — project API key (choose EU or US hosting).
4. **Sentry account** — DSN.
5. **Upstash Redis** — for rate limiting (or approve a Vercel-native alternative).
6. **Attorney:** ToS + Privacy Policy text, consent versioning sign-off, and the (future) BAA question. This is the one genuinely launch-blocking human dependency.
7. **DPT reviewer:** a licensed physical therapist to review the generic content plane and lend the "reviewed by [Name], DPT" credit. Generic content can be drafted and shipped to beta behind the allowlist before review completes, but public launch requires it.
8. **Product name/domain decision** — "Spine" as a consumer brand name is worth a pass (it gestures medical); not blocking.

Estimated effort: Phases 0-4 are the bulk (~70%); 5-9 are thin integrations. Phases 0-1 can start immediately with zero external accounts.
