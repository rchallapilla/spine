# Spine: Your Setup Checklist

Everything you need to do to get Spine deployed and on your phone. The code is done — these are the external-service steps only you can do. Total time: ~30 minutes.

---

## Step 1: Supabase (~10 min)

1. Go to [supabase.com](https://supabase.com) and create a new project (any name, pick a strong DB password, region close to you).
2. In the project, open **SQL Editor**, paste the entire contents of [`03_schema.sql`](./03_schema.sql), and click **Run**. You should see "Success. No rows returned."
3. Go to **Authentication -> Sign In / Up -> Email** and make sure Email is **enabled** (magic link is the default; no password needed).
4. Go to **Project Settings -> API Keys** and copy these three values for Step 2:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **Publishable key** (`sb_publishable_...`) — on older projects this may instead show as the legacy **anon / public key**. Either works.
   - **Secret key** (`sb_secret_...`) — on older projects this may instead show as the legacy **service_role key**. Either works. Keep this one secret.

   Newer Supabase projects default to publishable/secret keys; older projects may still show anon/service_role, or a button to reveal legacy keys alongside the new ones. Both key formats work identically in Spine — just paste whichever pair your dashboard gives you into the matching env vars below.

## Step 2: Local env file (~3 min)

```bash
cd ~/projects/spine
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your publishable key, sb_publishable_... (or legacy anon key)>
SUPABASE_SERVICE_ROLE_KEY=<your secret key, sb_secret_... (or legacy service_role key)>
ALLOWED_EMAILS=<your email>
ANTHROPIC_API_KEY=<your key from console.anthropic.com>
CRON_SECRET=<any long random string, e.g. run: openssl rand -hex 32>
```

Leave the VAPID lines empty for now (Step 6).

## Step 3: Verify locally (~5 min)

```bash
npm install   # if you haven't already
npm run dev
```

Open http://localhost:3000:

1. You should be redirected to `/login`.
2. Enter your email, click **Send magic link**, check your inbox, click the link.
3. You should land on **Today** with the spine widget. Tap segments, set scores.
4. Check **Milestones** — you should see 14 seeded milestones.

If the magic link lands on a Supabase error page: in Supabase go to **Authentication -> URL Configuration** and set **Site URL** to `http://localhost:3000`.

## Step 4: Push to GitHub (~2 min)

```bash
cd ~/projects/spine
git add -A
git commit -m "Spine v1"
git remote add origin git@github.com:<you>/spine-app.git   # or your repo URL
git push -u origin main
```

## Step 5: Deploy to Vercel (~5 min)

1. Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo. Framework auto-detects as Next.js — accept defaults.
2. Before clicking Deploy, expand **Environment Variables** and add every variable from your `.env.local` (same names, same values).
3. Deploy. Note your production URL (e.g. `https://spine-app.vercel.app`).
4. Back in Supabase, **Authentication -> URL Configuration**:
   - Set **Site URL** to your production URL.
   - Add to **Redirect URLs**: `https://<your-app>.vercel.app/auth/callback` and `http://localhost:3000/auth/callback` (keeps local login working).
5. Test: open the production URL, log in via magic link, log a day.

The daily cron (evening reminder + Sunday report) is already configured in `vercel.json` and runs at 00:30 UTC (~8:30 PM ET). Vercel authenticates it with your `CRON_SECRET` automatically — nothing to do.

## Step 6: Push notifications (~5 min)

1. Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

2. Add to **both** `.env.local` and Vercel env vars:

```bash
VAPID_PUBLIC_KEY=<public key>
VAPID_PRIVATE_KEY=<private key>
VAPID_SUBJECT=mailto:<your email>
```

3. Redeploy on Vercel (env changes need a redeploy: Deployments -> ... -> Redeploy).

## Step 7: Install on your phone (~3 min)

1. On your Android phone, open the production URL in Chrome.
2. Log in via magic link.
3. Chrome menu (⋮) -> **Add to Home screen** -> **Install**.
4. Open the installed app, tap **Settings** (top right) -> **Enable reminders** -> allow notifications.

## Step 8: Final verification

- [ ] Log a full day from your phone in under 30 seconds
- [ ] Dashboard renders after a few days of data
- [ ] Flare mode: start flare -> protocol visible in 2 taps -> end flare
- [ ] Quick-log: type "walked 3x, big3 done, back 4, slept 7.5" -> preview -> confirm
- [ ] Coach: tap **Generate now** (needs `ANTHROPIC_API_KEY`; works best with a few days of data)
- [ ] Evening reminder arrives at ~8:30 PM with the app closed (day after enabling push)

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Magic link goes to an error page | Supabase **URL Configuration**: Site URL + Redirect URLs must match the domain you're using |
| "This email is not authorized" | The email on the magic link must exactly match `ALLOWED_EMAILS`. Request a **new** magic link using that email (old links keep the original email). If you changed `ALLOWED_EMAILS` after requesting the link, request again. |
| Quick-log parse fails | Check `ANTHROPIC_API_KEY` is set in Vercel |
| "Generate now is limited to once per day" | Rate limit working as designed; wait 24h |
| No push notification | VAPID keys set in Vercel + redeployed? Reminders enabled in app Settings? Notifications allowed for the installed app in Android settings? |
| Cron didn't run | Vercel dashboard -> your project -> **Cron Jobs** tab shows run history and errors |

## Reference

- Env var details: [`.env.example`](./.env.example)
- App architecture and product docs: [`docs/`](./docs)
- Database schema (already applied in Step 1): [`03_schema.sql`](./03_schema.sql)
