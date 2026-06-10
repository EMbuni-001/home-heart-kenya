# Deploying UpCare (TanStack Start SSR) to Vercel

This project is a real TanStack Start app with SSR — not a static export. The
Vercel deploy uses **Nitro's Vercel preset** so server functions, loaders,
the sitemap route and the SSR-rendered HTML all work in production.

## How it's wired

- `vercel.json` sets `NITRO_PRESET=vercel` and runs `vite build`.
- `vite.config.ts` reads `NITRO_PRESET` and forwards it to the Lovable
  TanStack config (`nitro: { preset: "vercel" }`). When the env var is
  unset (i.e. Lovable's own preview/publish pipeline), it falls back to the
  default `cloudflare-module` preset so nothing changes for Lovable hosting.
- Nitro emits `.vercel/output/` in Vercel's
  [Build Output API](https://vercel.com/docs/build-output-api/v3) format,
  which Vercel picks up automatically — no functions folder, no rewrites,
  no adapter glue required.

## One-time setup

1. Push this repo to GitHub (or use `vercel` CLI from your machine).
2. In Vercel → **New Project** → import the repo.
3. Framework preset: **Other** (Vercel auto-detects the Build Output).
4. Build Command: leave blank (uses `vercel.json`).
5. Install Command: leave blank.
6. Output Directory: leave blank.
7. Add environment variables from [`.env.example`](./.env.example) — at
   minimum `NITRO_PRESET=vercel` and `VITE_SITE_URL=https://<your-domain>`.
   Add optional integration keys (Supabase, Lovable AI, Twilio, Stripe)
   only if your server functions use them.

That's it — click **Deploy**.

## Environment variables

The full template lives in [`.env.example`](./.env.example). Copy it to
`.env.local` for local dev, or paste keys into Vercel → Settings →
Environment Variables. Rules:

- `VITE_*` are PUBLIC (bundled into client JS) — never put secrets here.
- Unprefixed names are SERVER-ONLY — read via `process.env.X` inside
  `createServerFn` handlers or server route handlers.
- Set each variable for Production, Preview, and Development.

## CLI alternative

```bash
npm i -g vercel
vercel link
vercel --prod
```

## What works in production

- SSR rendering of every route in `src/routes/`
- `createServerFn` server functions
- The `sitemap.xml` server route
- Service worker / offline cache (built by `vite-plugin-pwa`)
- Static assets, fonts, images served from Vercel's edge CDN

## PWA / service worker pipeline

The PWA build is part of the same Vercel pipeline — no separate step:

1. `vercel-build` → `vite build` runs the `VitePWA` plugin (see `vite.config.ts`),
   which emits `sw.js`, the Workbox precache manifest, and hashed
   `workbox-*.js` runtime chunks into the client output.
2. Nitro's `vercel` preset copies that client output into
   `.vercel/output/static/`, so `sw.js` is served from the site root with
   scope `/` on every deploy.
3. `vercel.json` headers ensure correct caching:
   - `/sw.js` → `Cache-Control: max-age=0, must-revalidate` +
     `Service-Worker-Allowed: /` so browsers always re-check it and adopt
     the new worker immediately.
   - `/workbox-*.js` and all other hashed assets → `immutable, max-age=1y`.
   - The general hashed-asset rule explicitly excludes `sw.js` and
     `workbox-*` so the cache rules never conflict.
4. `registerType: "autoUpdate"` in `vite.config.ts` means clients fetch the
   new `sw.js`, activate it, and refresh the precache on the next visit
   after each deploy.



## Switching targets

| Target          | Command                                 |
| --------------- | --------------------------------------- |
| Vercel (SSR)    | `NITRO_PRESET=vercel vite build`        |
| Netlify (SSR)   | `NITRO_PRESET=netlify vite build`       |
| Node server     | `NITRO_PRESET=node-server vite build`   |
| Cloudflare      | `vite build` (default)                  |

Static-only Vercel hosting is still possible via the `upcare-static-v2.zip`
export, but this SSR path is the recommended one for the real app.
