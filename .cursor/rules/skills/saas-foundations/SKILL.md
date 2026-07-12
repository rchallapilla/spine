---
name: saas-foundations
description: Technical foundations for converting a single-user Next.js/Supabase PWA into a commercial multi-tenant SaaS. MUST be consulted when implementing auth, signup, Stripe billing/subscriptions/webhooks, entitlements and paywalls, plan gating, analytics events, transactional or lifecycle email, admin tooling, rate limiting, LLM cost controls, monitoring, backups, or legal-consent capture. Trigger for any work involving payments, user accounts, upgrade flows, usage limits, or production readiness, even when the request doesn't say "billing" explicitly.
---

# SaaS Foundations: single-user app -> commercial product

Base assumption: the personal "Spine" codebase (Next.js 15 App Router, Supabase, Serwist PWA, Anthropic API) is the starting point. This skill lists the exact deltas. Keep the stack; resist new infrastructure.

## 1. Auth & tenancy
- Supabase auth: email magic link + Google OAuth. Remove ALLOWED_EMAILS gating; add `profiles` auto-provisioning trigger on signup. Replace Supabase's built-in mailer (~3-4 magic links/hour limit) with custom SMTP/Resend BEFORE any second user.
- **Clinic tenancy (B2B):** `clinics` entity, clinician role accounts, patient roster = per-clinic allowlist with invite emails. Clinician dashboard shows ADHERENCE-ONLY data (percentages, streaks, last-log date, red-flag event counts): never scores, notes, or free text, unless a signed BAA path has been explicitly enabled (attorney-gated env flag, off by default). Clinician program/context editor must call the guardrails linter (product-guardrails skill, authorship tiers) on save.
- 18+ attestation + ToS/Privacy consent at signup: store `consents(user_id, doc_type, version, accepted_at, ip_hash)`. Consent versioning is launch-blocking (legal requirement, not polish).
- RLS stays the security model on every table; add `plan` and `stripe_customer_id` to profiles. Admin access via service-role in server-only admin routes, never a "role" column trusted client-side.
- Delete-my-account endpoint: cancels Stripe sub, hard-deletes user rows (or 30-day soft-delete then purge job), confirms by email. Data export endpoint: JSON of all user rows. Both ship in v1.

## 2. Billing (Stripe, web-first)
- Products: `pro_monthly` $9.99, `pro_annual` $59.99, `founding_annual` $39.99 (archived after 200 sales). 7-day trial on paid.
- Flow: Stripe Checkout (hosted) for purchase, Stripe Customer Portal for manage/cancel; do not build custom card forms.
- Webhooks (route: /api/stripe/webhook, signature-verified, idempotent by event id): checkout.session.completed, customer.subscription.updated/deleted, invoice.payment_failed. Webhook writes to `entitlements(user_id, plan, status, current_period_end)`; the app reads entitlements ONLY from this table, never live from Stripe on request path.
- Grace period on payment failure: 7 days limited mode, then downgrade to free. Stripe Tax ON from day one. Test clocks in dev for renewal logic.

## 3. Plan gating
- Single source: `getEntitlement(userId)` server helper; UI receives a typed `plan` and gates features. Free: tracker + flare checklist. Pro: AI coach, weekly reports, full program library, trends >30 days, export.
- Paywall moments: coach tab, report generation, locked programs. Paywall copy passes compliant-copy skill. Never gate the flare checklist or safety content behind payment (safety features are free by policy).

## 4. LLM cost & abuse controls
- Per-user daily caps: coach messages (e.g., 20/day), report generations (1/day), enforced server-side in a `usage_counters` table; friendly limit message via compliant-copy voice.
- Models: cheap/fast model for parsing, mid-tier for weekly reports (verify current names/pricing at https://docs.claude.com/en/api/overview); max_tokens caps; 15s timeout + one retry; log token usage per user for cost dashboards.
- All user text passes the product-guardrails red-flag pre-check BEFORE any LLM call; user content is delimited as untrusted data in prompts (injection posture).
- Kill switch env flag to disable AI features instantly without deploy.

## 5. Analytics (PostHog) with a privacy allowlist
Event names (properties may include ONLY: plan, platform, count/duration numbers; NEVER free text, scores, or health fields):
`signup_completed, onboarding_finished, intake_screener_blocked, first_log_created, day_logged, streak_7, streak_30, program_started, program_completed_week, coach_message_sent, report_generated, paywall_viewed, checkout_started, subscription_started, subscription_canceled, flare_mode_opened, export_requested, account_deleted`.
Define activation = 7 `day_logged` events within 14 days of signup. Build one dashboard: the funnel in 05_MARKETING section 7. Session recording OFF (health app; do not record).

## 6. Email (Resend + react-email)
Transactional: magic link (Supabase), receipt (Stripe), trial-ending, payment-failed. Lifecycle: onboarding D0/D2/D7, activation nudge D3-if-no-logs, weekly report, D30 win-back. One `emails` table logs sends for support and rate-limiting (max 1 lifecycle email/day/user). Unsubscribe honored for lifecycle, never for transactional/legal.

## 7. Admin & support
- /admin (service-role, your account allowlisted): user lookup, entitlement view/override, usage/cost per user, red-flag event log (flags only), refund link to Stripe.
- Support: a `support@` inbox and an in-app "Email us" link is enough at this scale; no ticket system until >50 emails/wk. Refund policy: 14-day no-questions on annual (put in ToS); refunds fight chargebacks, which cost more.

## 8. Production readiness checklist
- Sentry (server+client) with PII scrubbing; health-text redaction in any log line (middleware).
- Rate limiting on auth, parse, coach, and webhook routes (Upstash Ratelimit or Vercel middleware).
- Supabase point-in-time recovery ON; weekly export of schema; environment secrets documented in a private runbook.
- Status/incident habit: if the app is down >30 min, an honest email/banner. Solo founders win trust on how they handle bad days.
- Legal pages routed and versioned: /terms, /privacy; consent re-prompt when versions bump.
- Load reality: at <10k users, Vercel+Supabase free/low tiers hold; optimize nothing prematurely.

## 9. Build order for the conversion (tell Fable 5 to follow)
1. Multi-tenant auth + consents + provisioning
2. Entitlements table + Stripe checkout/portal/webhooks (test mode e2e)
3. Plan gating + paywalls
4. Guardrail middleware (red-flag pre-check, redaction) wired before ANY AI feature is exposed
5. Analytics allowlist events
6. Email transactional, then lifecycle
7. Admin lookup + usage caps
8. Export/delete endpoints
9. Production checklist pass
Each step ends with the product-guardrails ship checklist.
