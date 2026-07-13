# MONETIZATION: model, pricing, unit economics

## 1. Model: clinic SaaS, patient app free
- **Patients pay nothing, ever.** The patient app (tracker, flare mode, guide, coach) is free to them; adherence dies behind a patient paywall, and the free app is your future consumer funnel.
- **Clinics pay per clinic per month** for: roster and invites, the program/context editor, the adherence dashboard, the weekly digest.
- **Billing:** Stripe subscriptions/invoicing per clinic (card or ACH, net-30 acceptable early). Stripe Tax on from the first invoice. No consumer checkout exists until the fallback activates.

## 2. Pricing
- **Pilot:** free, 90 days, up to 20 patients, terms per the LOI (01_STRATEGY section 6).
- **Founding:** $99/mo locked for 12 months, first 5 clinics only.
- **Standard:** $149/mo per clinic, up to 30 active patients; $3/active patient/mo beyond 30. Annual option $1,490 (2 months free).
- Anchor: incumbent HEP tools run per-clinician subscriptions in a similar range while delivering worse patient engagement; you are priced as software, well under what one retained patient's plan-of-care is worth to the clinic.
- Raise standard price with each proof point (case study #1, referral engine working); founding clinics stay locked as promised.

## 3. Unit economics (write on the wall)
- Variable cost per active patient: well under $0.50/mo in LLM spend (capped per the saas-foundations skill). A 30-patient clinic costs ~$15/mo to serve against $149: ~90% gross margin.
- Real cost is your time: support and feedback calls. Budget 1 hr/clinic/month post-pilot; productize answers into the guide as they repeat.
- Churn target: near zero. Clinics that convert after a 90-day pilot with written success criteria rarely leave; the program content they authored is the lock-in (theirs to export, but rebuilt nowhere easily).

## 4. Revenue math (sober)
| Milestone | Clinics | MRR / ARR |
|---|---|---|
| Pilots convert (2 of 3) | 2 | ~$250-450 MRR |
| End of year 1 | 8-15 | $12k-25k ARR |
| Compounding motion | 100 | ~$178k ARR |
Year-1 realistic for a solo with a demanding job: 8-15 clinics. Anyone promising faster is selling you something. The consumer fallback (appendix) has a different curve: slower trust, bigger ceiling.

## 5. Gates before scaling spend
No paid acquisition of any kind until: (a) 2+ paying clinics, (b) one written case study, (c) at least one clinic acquired via referral. B2B at this stage grows on proof and founder outreach, not ads.

## 6. Expansion paths (in order)
1. **More clinics, same metro, referral-led** (cheapest growth in B2B is a happy owner telling a peer).
2. **Consumer edition reopens** as a funnel once clinic motion is stable: free personal tier already exists; paid consumer tier per appendix.
3. **Adjacent programs on the same pipeline:** post-op knee, neck/posture, return-to-run: the engine is the asset, not the body part.
4. **Corporate wellness lite** (year 2+), sold as engagement, never healthcare.

## 7. Never monetized (per 02_LEGAL)
Ads, data sale/sharing, supplement affiliates, "premium AI diagnosis," sponsored coach messages. Any of these breaks the FTC posture and the trust the brand stands on.

---

## Appendix: B2C fallback pricing (activate only per Gate A in 00_ROADMAP)
Freemium: free forever tracker + flare checklist (safety features never paywalled); Pro $9.99/mo or $59.99/yr (AI coach, weekly reports, full library, trends, export); founding offer $39.99/yr for first 200; 7-day trial; web billing via Stripe first, app-store IAP only when store distribution demonstrably matters. Targets: free-to-paid 2-5% of activated users, month-6 paid retention >60%, ads only after week-6 retention >25% and one organic channel producing 50+ signups/wk.
