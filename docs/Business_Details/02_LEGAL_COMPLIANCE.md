# LEGAL & COMPLIANCE: the lines you must not cross

**Read me first:** none of this is legal advice; I am organizing the landscape so your paid attorney hour is spent reviewing, not educating you. Budget $1,500-3,000 for a healthtech/FTC-literate attorney before public launch. The exact asks for that attorney are in section 8.

## 1. The single organizing principle
There is a bright line between a **general wellness product** (unregulated: promotes healthy habits, general fitness, relaxation, self-management of well-being) and a **medical device / medical service** (regulated: diagnoses, treats, cures, mitigates a disease or condition, or provides individualized clinical care). Everything in your product, copy, and AI behavior is designed to stay on the wellness side. FDA's General Wellness guidance (search "FDA general wellness enforcement policy") is the reference doc; low-risk lifestyle products making only general wellness claims are outside device regulation.

## 2. Claims: allowed vs prohibited (the table your whole company runs on)
| ALLOWED (wellness) | PROHIBITED (medical) |
|---|---|
| "Build a daily routine for a strong, resilient back" | "Treats / relieves / cures chronic low back pain" |
| "Track your habits, sleep, and how you feel" | "Reduces pain by X%" or any outcome statistic |
| "Educational programs reviewed by a licensed physical therapist" | "Your personalized treatment plan" |
| "Stay consistent with the routine your clinician gave you" | "Replaces physical therapy / skip the doctor" |
| "Feel steadier, stronger, more in control" | "AI analyzes your symptoms and tells you what's wrong" (diagnosis) |
| "A calm checklist for rough days" | "Follow this protocol to fix your flare" (treatment) |
| "General exercises commonly used for back health" | Naming/claiming benefit for a diagnosis ("for herniated discs", "sciatica relief") |
Gray zone to simply avoid: "manage your pain", "recover from injury", "therapy". Use: "manage your routine", "rebuild your habits", "recovery habits".
The compliant-copy skill operationalizes this table for every string Fable 5 writes.

## 3. Practicing medicine / physical therapy without a license
Individualized exercise *prescription* for a person's *condition* is what licensed PTs do; an app (or its AI) doing that invites state-board trouble and liability.
Your safe architecture:
- **Authorship tiers (mirrors the product-guardrails skill):** owner account may hold its own context (personal use); invited individuals get generic pre-built tracks only, never self-authored medical history in a coach prompt; clinic patients get content authored by THEIR licensed clinician in the product. The clinic tier is the strongest posture available: a licensed professional authors the individualized content, and the app is the delivery and adherence layer.
- **General, pre-built educational programs** for the non-clinic tiers, created/reviewed by a **paid licensed DPT** whose review is documented (contract in section 7). Users self-select tracks; the app never selects based on symptoms.
- **The AI coach is an adherence coach, not a clinician.** It may discuss consistency, motivation, scheduling, streaks, and reflect the user's own logged data. It must never: interpret symptoms, modify exercises based on reported pain, recommend medications/dosages/supplements, or discourage professional care. The product-guardrails skill contains the enforcing system-prompt requirements.
- **Red-flag hard stop:** any user text matching red-flag patterns (bladder/bowel changes, saddle numbness, leg weakness, fever with back pain, severe worsening) gets one fixed response: stop, seek in-person medical care now; and the AI coach declines further symptom talk. Non-negotiable, logged.
- **"Coach" framing is fine; "your therapist/clinician" framing is not.** Health coaching for habits is broadly unlicensed; clinical care is not.

## 4. Privacy: you are a health app even without HIPAA
- **HIPAA does not apply** to a direct-to-consumer app with no insurer/provider relationships. Do not claim "HIPAA compliant" in marketing; it is meaningless here and attorneys wince.
- **The FTC absolutely applies.** The Health Breach Notification Rule (amended 2024) covers health apps: sharing user health data with third parties without authorization = a "breach" (see GoodRx and Premom enforcement actions: their sin was ad-SDK data leakage). Rules of the house: no ad SDKs, no Meta/Google pixels on logged-in pages, analytics via a privacy-respecting setup (PostHog with data minimization), no sale or sharing of health data, ever.
- **State laws:** Washington's My Health My Data Act reaches non-HIPAA health data of WA consumers (broad, private right of action: design to its standard and you are safe most places); California CCPA/CPRA thresholds likely exempt you early but build the rights anyway (access, deletion, no-sale). NC currently lacks a comprehensive privacy law; do not architect to the weakest state.
- **Ship with:** plain-language privacy policy, consent checkbox at signup with versioned timestamp stored, in-app data export and delete-my-account that actually deletes, encryption in transit and at rest (Supabase default), minimal retention.

## 4b. The clinic path and HIPAA (the fork your attorney decides with you)
The moment clinics are involved, ask whether you have become a **business associate** handling PHI.
- **Path 1, clean start (default for pilots):** patients self-enroll into a wellness tool their clinician recommends; clinicians author programs and see an ADHERENCE-ONLY dashboard (percentages, streaks, last-log date, red-flag counts; no scores, no notes, no free text). Position: patient-initiated wellness tracking, not the clinic's medical record. Likely avoids business-associate status; get the attorney's confirmation in writing and keep the dashboard scope enforced in code (saas-foundations skill).
- **Path 2, full clinical (only when a paying clinic demands scores/notes):** you accept business-associate status: BAAs with each clinic, a HIPAA-capable hosting tier (Supabase's BAA-eligible plan), a BAA/zero-retention arrangement with the LLM provider, breach procedures, and security documentation. Real cost and ceremony; take it only when revenue justifies it, and never silently.
Cardinal rule either way: nothing about a patient enters an LLM prompt beyond what the guardrail architecture already permits, and never free-text clinical notes.

## 5. Liability shielding (layers, in order)
1. **NC LLC** separates personal assets (03_COMPANY_SETUP). Keep it real: separate bank, no commingling, sign contracts as "Member, [LLC name]".
2. **Terms of Service must include** (attorney drafts/reviews): not-medical-advice and no clinician relationship formed; assumption of risk for physical activity; "consult a physician before beginning any exercise program"; limitation of liability + arbitration/class-waiver (ask attorney for enforceability trade-offs); 18+ only; medical emergency = call 911.
3. **In-product moments, not just legalese:** onboarding screen restating not-medical-advice in human words + physician-consult prompt + the red-flag list with "this app is not for these situations"; flare-mode screens repeat the ER list. Courts and the FTC both like disclosures where decisions happen.
4. **Insurance:** general liability + technology E&O (sometimes "miscellaneous professional") + cyber. Small SaaS bundles run ~$600-1,200/yr (Hiscox, Next, Vouch, Embroker). Buy before beta users, not after.

## 6. Content IP hygiene
- Do not reproduce copyrighted programs, books, or videos (e.g., do not ship pages of any clinician's book, or the branded name of a proprietary method as your feature name). Generic exercise names and independently written descriptions + your DPT's review = clean. Credit inspirations in a bibliography if you like; never imply endorsement.
- Everything your DPT reviews or writes: work-for-hire/assignment language in the contract so the LLC owns it.
- Trademark: knockout search before naming (01_STRATEGY section 5); file after Gate A.

## 7. Contracts you need (templates exist; attorney glances)
- DPT consultant agreement: scope (review + sign-off memo), fee, work-for-hire/IP assignment, right to state their name/credentials in credits ("content reviewed by..."), no clinician-patient relationship created with users.
- **Clinic pilot LOI** (outline in 01_STRATEGY section 6): pilot terms, success criteria, stated post-pilot pricing, exit clause, content ownership split, data-handling scope per section 4b.
- Standard mutual NDA (rarely needed; do not fetishize it).
- ToS + Privacy Policy (user-facing, from section 4-5).
- If you later record exercise videos with a model/trainer: release + IP assignment.

## 8. The exact asks for your attorney (one engagement, fixed fee)
1. Review ToS + Privacy Policy drafts (bring drafts; do not pay drafting-from-scratch rates).
2. Review the claims table (section 2) and your landing page + app store copy against FTC and state consumer-protection law.
3. Confirm the AI-coach guardrail design and red-flag flow do not create a duty-of-care or unauthorized-practice problem in their view.
4. Arbitration clause: yes/no and wording for NC.
5. Anything NC-specific for wellness apps they would flag.
6. The clinic fork (section 4b): does the adherence-only pilot design avoid business-associate status? Written answer.
7. Review the pilot LOI before the first clinic signs.
Finding one: NC Bar Lawyer Referral Service, or search "digital health attorney solo startup fixed fee"; many healthtech boutiques do startup packages.

## 9. App store notes (when you go there, month 4+)
Apple App Review 1.4.1 and Google Play health policies: health apps face extra scrutiny; medical claims trigger requests for evidence/clearances. Your wellness positioning is also your app-store strategy. Google Play requires health-app declarations; both require prominent disclaimers. Web/PWA-first at launch keeps 100% of revenue and zero review risk while you find PMF.

## 10. Employer conflict (personal, critical)
Wells Fargo (and most banks) require Outside Business Activity pre-approval for any outside venture, revenue-generating or sometimes even pre-revenue. Do this BEFORE forming the LLC: read the OBA policy, file the disclosure, keep the approval in writing. Build only on personal time, personal hardware, personal accounts. An unrelated wellness app is usually approvable; skipping the process is a fireable offense in financial services regardless of the app's innocence.
