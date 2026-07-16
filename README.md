# Atmos Weather Dashboard

A Next.js 14 (App Router) weather dashboard with English/Arabic i18n + RTL, React Query
caching, dynamic Unsplash backgrounds, offline support, and localStorage favorites.

## Local setup

1. Install Node.js 18.17+.
2. In this folder, run `npm install`.
3. Copy `.env.local.example` to `.env.local` and fill in the values (see comments in
   that file for where to get each key — `WEATHER_API_KEY` is required,
   `UNSPLASH_ACCESS_KEY` is optional).
4. Run `npm run dev` and visit [http://localhost:3000](http://localhost:3000).

Both API keys are server-only — never exposed to the browser. All external calls go
through Next.js route handlers in `app/api/*`, which delegate to `backend/services/*`.

## Project structure

Next.js requires `app/` to stay at the project root for its file-based routing, so it
acts as a thin routing layer. Everything it delegates to is organized by concern:

```
app/                # Routing only (Next.js requirement) — pages, layouts, API routes
  [locale]/          # Localized pages (en/ar), redirected to by middleware.ts
  api/                # Route handlers — thin wrappers around backend/services

backend/            # Server-only code, never bundled into client JS
  env.ts              # Env var validation
  services/
    weatherService.ts    # WeatherAPI.com integration
    backgroundService.ts # Unsplash integration + in-memory cache

frontend/           # Client-side code
  components/          # UI components
  hooks/                # React Query hooks, geolocation, keyboard shortcuts
  providers/            # React Query provider, error boundary
  lib/                  # Client-side fetch wrapper, localStorage favorites

shared/             # Used by both backend and frontend
  weatherTheme.ts       # Weather-condition -> theme/gradient derivation

i18n/, messages/     # next-intl routing config and translation files
middleware.ts         # Locale detection/redirect (excludes /api)
public/sw.js           # Service worker (production-only, caches /api/weather + /api/locations)
```

## Deploying

This is a standard Next.js app — [Vercel](https://vercel.com) is the path of least
resistance (zero config, matches the `next build`/`next start` scripts already in
`package.json`). Any Node.js host that runs `npm run build && npm run start` works too.

**Before deploying:**
- Set `WEATHER_API_KEY` (required) and `UNSPLASH_ACCESS_KEY` (optional) as environment
  variables on your host — the same names as in `.env.local`. Never commit `.env.local`
  itself (it's gitignored).
- `next.config.js` already whitelists `images.unsplash.com` for `next/image`; if you
  change the background image source, update `images.remotePatterns` there too.
- The service worker (`public/sw.js`) only registers when `NODE_ENV=production`, so it
  won't interfere with local dev.
