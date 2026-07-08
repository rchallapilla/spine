# PRD: Spine, a personal recovery command center

**Version:** 1.0 | **Owner:** Raghu | **Platform:** PWA (installable on Android via Chrome "Add to Home Screen")

## 1. Problem and goal

Raghu is executing a 6-12 month structured back-recovery program (daily habits, phased training, milestones, flare protocol). The program lives in a markdown guide he does not want to keep re-reading. He needs a zero-friction daily tracker with reminders and reporting that makes the program automatic and shows whether it is working.

**Product goal:** logging a full day takes under 30 seconds; the app surfaces trends and flare risk without being asked; the guide's key protocols are one tap away in the moment they are needed.

**Success metrics:** 90%+ days logged over 8 weeks; weekly report read every Sunday; time-to-log under 30s; user can answer "is my back trending better?" from the dashboard in one glance.

## 2. User

Single user (Raghu). 43M, analytical PM, Android phone, evenings are the logging window. Dark environment at night. One-thumb use. No tolerance for friction or decorative UI.

## 3. Core objects

- **Daily log:** one row per date holding the 3 clinical scores: back (1-10), stress (1-10), sleep hours.
- **Habit entries:** per-date completion of the 6 fixed daily habits (see 5.1).
- **Milestones:** the program checkpoints (PT eval, labs, phase exits) with status and target dates.
- **Flare events:** start date, end date, severity, suspected trigger, notes.
- **Weekly report:** LLM-generated Sunday summary.

## 4. Screens (5 total, bottom tab nav)

### 4.1 Today (home)
- Date header with day streak count.
- **The Spine widget (signature element):** the 6 daily habits rendered as a vertical stack of 6 vertebra-shaped segments. Each completed habit fills its segment. A fully logged day shows an aligned, fully lit spine. This is the emotional core of the app: complete your spine every day.
- Tap a segment to toggle done/undone. Long-press opens detail (count/duration where applicable).
- Three score dials below: Back, Stress, Sleep. Tap to set via a large slider sheet.
- **Quick-log box** at top: free-text field + mic-friendly. "walked 3x, big3 done, back 4, slept 7.5" -> parsed by LLM -> pre-fills the day -> user confirms with one tap. Parse preview must show what will be saved before commit.
- **Flare button** (persistent, small, bottom of Today): opens Flare Mode.

### 4.2 Flare Mode (modal flow, reachable in 2 taps from anywhere)
- Tap 1: "Start flare" logs a flare_event (today, severity slider).
- Immediately shows the 48-hour protocol as a calm checklist (content from docs/06, verbatim): keep moving, 90/90 position, heat, NSAID note, brace 1-2 days max, the mantra line.
- ER red-flag list pinned at bottom in red: new bladder/bowel loss, saddle numbness, leg weakness/foot drop, fever with back pain -> "Go to ER."
- Active flare shows as a banner on Today until "End flare" is tapped (captures end date + trigger guess).

### 4.3 Dashboard
- Range toggle: 7 / 30 / 90 days.
- Line chart: back score, stress, sleep hours (3 series, toggleable).
- Adherence: % per habit for range + overall; current streak and best streak.
- Flare timeline strip: flares as bands overlaid under the line chart so visual correlation with stress/sleep dips is obvious.
- "This week vs last week" deltas for the 3 scores and adherence.

### 4.4 Milestones
- Grouped checklist by category: Medical, PT, Labs, Training phases, Checkpoints.
- Each: title, target date, status (todo / scheduled / done / skipped), notes.
- Seeded from schema (03_schema.sql) with the real program milestones, including "Hip mobility screen at PT eval" (screen, not imaging), ferritin + HbA1c draw, Sorensen baseline, Phase 2 exit criteria, month-4 relapse checkpoint, burpee reintroduction gate.
- Phase exit milestones display their criteria as sub-checklist text.

### 4.5 Coach
- Latest weekly report rendered as markdown (generated Sundays by cron; also a "Generate now" button, rate-limited to 1/day).
- Report history list.
- Report contents (see 06_llm_prompts.md): adherence summary, 3-score trends, correlation observations in careful correlational language, next-week flare-risk flag (green/amber/red) based on the stress-lag model, one single focus for the week.

## 5. Functional requirements

### 5.1 Fixed habit set (seeded, editable labels only in v1)
1. Sleep window (8.25h in bed, fixed wake) - boolean "kept window" + sleep hours captured in scores
2. Walks (target 3+/day) - count
3. McGill Big 3 - boolean
4. Hip openers - boolean
5. Sit-stand position changes (target: every 30-45 min followed) - boolean
6. Morning rule (no loaded flexion first hour) - boolean

### 5.2 Logging
- Any past date editable (7-day back-edit window).
- Upsert semantics: one daily_log row per date; habit entries unique per (date, habit).
- Quick-log parse must never write without user confirmation of the preview.

### 5.3 Reminders (push notifications, Android Chrome)
- 8:30 PM local: "Complete your spine" if today incomplete.
- Sunday 8:00 AM: "Your weekly coach report is ready."
- v1 explicitly excludes intraday sit-stand nudges (phone timer does that job better).

### 5.4 Reporting/LLM
- Weekly coach report auto-generated Sunday via cron using last 28 days of data.
- Quick-log parser converts free text to structured payload via tool use; ambiguous text falls back to notes field, never guesses scores.

### 5.5 Auth and privacy
- Supabase magic-link auth. Access restricted to an ALLOWED_EMAILS env list. RLS on every table. Health data leaves the system only to the Anthropic API for the two LLM features; no analytics SDKs.

## 6. Non-functional
- Today screen interactive < 1.5s on 4G; all logging works offline (queued writes via service worker, sync on reconnect); installable PWA with icon + splash; WCAG AA contrast; reduced-motion respected; dark mode default with light mode toggle.

## 7. Design direction (tokens in 02_ARCHITECTURE.md)
Calm clinical-night aesthetic: deep ink-blue surfaces, bone-white text, a single recovery-teal accent for completion, amber reserved for risk flags, muted red only inside Flare Mode. Display type: Space Grotesk (numerals and headers). Body: IBM Plex Sans. Data/mono: IBM Plex Mono. No gradients, no confetti; the lit spine IS the reward. Motion: one moment only, the spine segment fill (150ms ease-out); everything else static.

## 8. Out of scope for v1
Multi-user, social, Apple Health/Google Fit sync, native APK (Bubblewrap TWA is a documented v2 path), exercise video content, AI chat interface, intraday nudges, wearable integration.

## 9. Risks
- Push notification permission denied -> app still fully usable; reminders degrade gracefully.
- LLM parse errors -> preview-before-commit prevents bad writes.
- Vercel Hobby cron limits (once daily) -> single daily cron handles evening reminder; Sunday branch also generates the report.
- Motivation cliff at month 2 -> the streak + spine visual + Sunday coach are the retention design; keep them working before adding features.
