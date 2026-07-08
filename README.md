# Spine

Personal recovery-tracking PWA built with Next.js 15, Supabase, and Anthropic.

## Setup

1. Create a Supabase project and run [`03_schema.sql`](./03_schema.sql) in the SQL editor.
2. Enable Email auth (magic link) in Supabase Authentication.
3. Copy `.env.example` to `.env.local` and fill in values.
4. Install and run:

```bash
npm install
npm run dev
```

## Environment variables

See [`.env.example`](./.env.example) for the full list.

Required from day one:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (server code falls back to these too)
- `SUPABASE_SERVICE_ROLE_KEY` (cron/coach only, never in the client)
- `ALLOWED_EMAILS` (comma-separated; leave unset to allow any authenticated email)

Required for LLM features (quick-log parse, weekly coach):

- `ANTHROPIC_API_KEY`
- `CRON_SECRET` (any long random string; Vercel sends it automatically to the cron route)

Required for push reminders:

- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT`

Optional:

- `NEXT_PUBLIC_SITE_URL` (auth redirect origin; derived from the request when unset)

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

## Deploy (Vercel)

1. Connect the GitHub repo to Vercel.
2. Add env vars from `.env.example` to the Vercel project.
3. In Supabase: Authentication -> URL Configuration, add your Vercel domain to
   the Redirect URLs (e.g. `https://your-app.vercel.app/auth/callback`) and set
   it as the Site URL.
4. Deploy. Cron is configured in [`vercel.json`](./vercel.json) for one daily
   run at 00:30 UTC; Vercel automatically sends `Authorization: Bearer $CRON_SECRET`.

## Manual test checklist

- Magic-link login with an allowed email
- Log a full day on Today in under 30 seconds
- Dashboard charts render with 7+ days of data
- Start and end a flare in 2 taps
- Quick-log parse preview before confirm
- Generate a weekly coach report
- Enable push reminders on Android Chrome
- Airplane-mode logging syncs on reconnect

## Docs

Product and architecture source of truth lives in [`/docs`](./docs).
