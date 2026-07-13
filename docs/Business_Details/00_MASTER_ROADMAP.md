# MASTER ROADMAP: from working app to revenue, solo, in NC

This is the control file. Every other file hangs off it. Work the phases in order; each has an exit gate. Gates protect your money, your legal exposure, and your back.

**The business (current thesis):** [NAME] is the adherence layer for structured MSK recovery: clinics author their program in the product, patients run it daily in a free app, clinicians see adherence between visits. The consumer edition exists as the live demo, the founder story, and a preserved fallback (appendices in 01/04/05).

## Decision log
- **v1 (July 2026):** B2C-first wedge, clinics as month-6 expansion.
- **v2 (current):** B2B clinic-first. Rationale: the shipped app's differentiated asset (clinician-authored context driving a guardrailed coach) is exactly the B2B feature and the strongest legal posture; the allowlist already maps to a clinic roster; one clinic equals dozens of consumer subs with near-zero churn; the B2C content engine did not fit an 8 hr/wk calendar; the live single-tenant app with real longitudinal data is a stronger demo than any landing page.

---

## Phase A: Validate + harden (weeks 1-4, ~$60, ~7 hrs/wk)
No LLC. No clinic features built. Two tracks plus one build task.

**Track 1, clinics (primary):**
1. Build a list of 40-50 PT/chiro/sports-med clinics in the Charlotte metro (01_STRATEGY section 4).
2. Outreach 10/week, meetings capped at 3/week in 7am/lunch/5:30pm slots (05_MARKETING sections 2-3).
3. Demo = your own app with your own data. Ask for a signed pilot LOI at the end of every good meeting (01_STRATEGY section 6).

**Track 2, consumer (background, option preservation):** ship the $60 landing page + waitlist (05_MARKETING appendix). No content engine commitment.

**Build task (Fable 5, 1-2 days, required for ANY second user):** load the three skills; implement consent capture (versioned ToS/privacy), 18+ and red-flag intake screener, server-side red-flag check before every LLM call including the quick-log parse path, custom SMTP replacing Supabase's built-in mailer.

**Before any of it: Wells Fargo Outside Business Activity disclosure** (02_LEGAL section 10). Non-negotiable, first.

**GATE A: 2+ signed pilot LOIs within 4-6 weeks.**
- Pass -> Phase B. 
- 0 LOIs after 20 conversations, but consumer gate passed (200+ waitlist, 3%+ conversion) -> switch to the B2C fallback appendices in 01/04/05 with eyes open.
- Both miss -> shelve; the app remains your daily tool and portfolio piece. Total loss: $60.

## Phase B: Legal + company (weeks 4-6, ~$2,600-4,800)
1. NC LLC per 03_COMPANY_SETUP ($125 file, $203/yr report).
2. EIN, business bank, bookkeeping from dollar one.
3. Insurance: GL + tech E&O + cyber (~$600-1,200/yr) before the first pilot patient.
4. Attorney fixed-fee engagement ($1,500-3,000): the seven asks in 02_LEGAL section 8, including the HIPAA/BAA fork and LOI review.
5. DPT consultant ($500-1,500): reviews the generic patient-app content and fallback tracks; clinic partners review their own authored programs.

## Phase C: Build the pilot product (weeks 5-8, overlaps B)
Per the saas-foundations and product-guardrails skills: clinic workspace + roster invites, clinician program/context editor with guardrail linter, adherence-only dashboard (percentages, streaks, last-log, red-flag counts; no scores or notes), weekly clinic digest email. Explicitly NOT built: EMR integration, clinician-patient messaging, billing codes.

**GATE C:** a clinician who has never seen the product can author a program and enroll a test patient without your help.

## Phase D: Run pilots (90 days)
3 clinics, free, up to 20 patients each, biweekly feedback calls, success criteria written into the LOI (e.g., 60%+ weekly patient adherence, clinician time saved vs status quo). Collect FTC-safe proof: adherence numbers and clinician workflow quotes, never patient medical outcomes.

**GATE D:** 2 of 3 pilots convert to paid.

## Phase E: Convert + grow (months 5-12)
Founding price $99/mo locked 12 months (first 5 clinics), then $149/mo standard (04_MONETIZATION). Growth = referrals between clinic owners + the case study + steady outreach. Year-1 realistic: 8-15 clinics, $12k-25k ARR, churn near zero. The consumer edition reopens as a funnel only after the clinic motion is stable.

---

## Budget: year 1, lean
| Item | Cost |
|---|---|
| Domain, landing tools | $60 |
| NC LLC + first annual report | $125 + $203 |
| Registered agent (optional) | ~$125 |
| Attorney (docs, claims, LOI, HIPAA fork) | $1,500-3,000 |
| Insurance | $600-1,200 |
| DPT content review | $500-1,500 |
| SaaS tools | $0-60/mo early |
| LLM API | usage-based, capped per skills |
| **Total** | **~$3,500-7,000** |

## Time reality
Phase A: ~7 hrs/wk (3 meetings + outreach + the 2-day build). Phases C-D: 8-12 hrs/wk. If that budget eats sleep, hold at Phase A; sleep is not the line you raid.

## Kill criteria (written while sober)
- 20 clinic conversations, zero LOIs, and consumer gate also missed: shelve 12 months.
- Month 6 post-pilot: under 5 paying clinics and no referral motion: maintenance mode, keep the asset.
- Any month your own recovery adherence drops below 60% because of this project: two-week full pause, no negotiation. The founder story dies if the founder relapses building it.
