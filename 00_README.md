# Recovery App Kit: START HERE

A complete build kit for **Spine**, your personal recovery tracking PWA. Feed these files to Cursor in order and you will have a deployed app on Vercel.

## What's in this kit

| File | What it is | Who reads it |
|---|---|---|
| 01_PRD.md | Full requirements: features, UX, screens, out-of-scope | You (review once), Cursor (always in context) |
| 02_ARCHITECTURE.md | Stack, data model, API surface, folder structure, design tokens | Cursor (always in context) |
| 03_schema.sql | Ready-to-run Supabase schema with RLS and seed data | Paste into Supabase SQL editor |
| 04_cursor_rules.md | Project rules. Save contents as `.cursor/rules/project.mdc` | Cursor (automatic) |
| 05_BUILD_PLAN.md | 8 milestones, each a copy-paste Cursor prompt with acceptance criteria | You, milestone by milestone |
| 06_llm_prompts.md | System prompts for the quick-log parser and weekly coach, including your clinical context | Cursor copies into code as constants |

## Your first 30 minutes

1. **Supabase** (10 min): create project at supabase.com -> SQL Editor -> paste `03_schema.sql` -> run. Enable Email auth (magic link) under Authentication. Copy the project URL + anon key + service role key.
2. **Anthropic API key** (2 min): console.anthropic.com -> API keys. Docs: https://docs.claude.com/en/api/overview
3. **Repo** (5 min): create empty GitHub repo `spine-app`, clone in WSL, open in Cursor.
4. **Cursor setup** (5 min): copy 01, 02, 06 into a `/docs` folder in the repo. Create `.cursor/rules/project.mdc` with the contents of 04.
5. **Build** (rest of day): open `05_BUILD_PLAN.md`, paste Milestone 0 into Cursor. Verify acceptance criteria. Proceed to Milestone 1. Do not skip ahead.

## Rules of engagement with Cursor

- One milestone per chat session. Start each session with: "Read /docs/PRD.md, /docs/ARCHITECTURE.md and the rules. We are on Milestone N."
- After each milestone, run the acceptance checklist yourself before moving on. Commit with the milestone name.
- If Cursor drifts from the architecture, paste the relevant section back and say "follow the architecture doc."
- Deploy to Vercel at Milestone 2, not at the end. Ship early, iterate deployed.

## Time estimate

Milestones 0-3 (usable tracker with dashboard): one focused weekend day.
Milestones 4-7 (LLM features, notifications, PWA polish): a second day.

Remember the WIP rule from your recovery guide: this app IS allowed because it serves recovery, but timebox it. A finished simple tracker you use daily beats a perfect one you build for a month.
