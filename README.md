# Philosophy Game

Interactive philosophy preference quiz focused on branch affinity (not MBTI typing).

## Run locally

From the repo root:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

## Local config (email + Supabase)

1. Copy `config.local.example.js` to `config.local.js`
2. Fill in:
	- `SUPABASE_URL`
	- `SUPABASE_ANON_KEY`
	- `DEVELOPER_EMAIL`

`config.local.js` is gitignored.

## Deploy on Vercel

This project is static HTML/CSS/JS plus one Vercel serverless function at `/api/config`.

1. Import the repo into Vercel.
2. In Project Settings → Environment Variables, add:
	- `SUPABASE_URL`
	- `SUPABASE_ANON_KEY`
	- `DEVELOPER_EMAIL`
3. Redeploy after setting env vars.

How it works:
- `config.js` loads runtime config from `/api/config`
- `/api/config` reads the three values from `process.env`
- `supabase.js` reads `window.APP_CONFIG` dynamically so values loaded after page start still work

Important:
- In a static frontend, Vercel env vars are **not** automatically injected into browser JS files.
- They are only available server-side (like `api/config.js`) unless you run a build step that inlines them.

## Supabase schema

Run `supabase-schema.sql` in your Supabase SQL editor.

This enables persistent tracking for:

- Total site hits
- Start clicks
- Results completions
- Play again clicks
- Average questions completed
- Dominant-branch percentages
- Popular/least-popular answers
- Longest questions (per user + global)
