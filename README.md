# Emperor Quiz

Interactive quiz that determines which Roman emperor matches your personality. Each question scores points toward specific emperors based on whether you agree or disagree. 20 questions across 6 categories: Power, Warfare, Justice, Culture, Character, and Politics.

## Run locally

From the repo root:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

> Note: The `/api/config` and `/api/geo` endpoints only work on Vercel. Locally, the quiz works but Supabase tracking and GDPR geo-detection won't function without the API routes.

## Local config (email + Supabase)

1. Copy `config.local.example.js` to `config.local.js`
2. Fill in:
	- `SUPABASE_URL`
	- `SUPABASE_ANON_KEY`
	- `DEVELOPER_EMAIL`

`config.local.js` is gitignored.

## Deploy on Vercel

This project is static HTML/CSS/JS plus two Vercel serverless functions:
- `/api/config` — serves Supabase credentials and developer email from env vars
- `/api/geo` — returns the visitor's country code via Vercel's `x-vercel-ip-country` header

### Setup

1. Import the repo into Vercel.
2. In Project Settings → Environment Variables, add:
	- `SUPABASE_URL`
	- `SUPABASE_ANON_KEY`
	- `DEVELOPER_EMAIL`
3. Redeploy after setting env vars.

### How it works

- `config.js` loads runtime config from `/api/config`
- `/api/config` reads the three values from `process.env`
- `supabase.js` reads `window.APP_CONFIG` dynamically so values loaded after page start still work
- `/api/geo` returns the visitor's country for GDPR cookie consent detection

Important:
- In a static frontend, Vercel env vars are **not** automatically injected into browser JS files.
- They are only available server-side (like `api/config.js`) unless you run a build step that inlines them.

## Admin Panel

The admin panel is accessible only via `/access` (not `/admin.html`). Direct access to `/admin.html` is redirected away by the Vercel config.

Default test credentials: `admin` / `imperator`

## GDPR Cookie Consent

Cookie consent is shown only to visitors from countries that legally require it:
- EU/EEA member states (GDPR)
- United Kingdom (UK GDPR)
- Brazil (LGPD)
- South Africa (POPIA)
- Switzerland (FADP)

Visitors from other countries have analytics enabled automatically. All users can clear their choice by clearing localStorage.

## Supabase schema

Run `supabase-schema.sql` in your Supabase SQL editor.

This enables persistent tracking for:

- Total site hits
- Start clicks
- Results completions
- Play again clicks
- Average questions completed
- Emperor result percentages
- Popular/least-popular answers
- Longest questions (per user + global)
