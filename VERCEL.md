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
7. (Optional) Add any runtime env vars your server functions need.

That's it — click **Deploy**.

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

## Switching targets

| Target          | Command                                 |
| --------------- | --------------------------------------- |
| Vercel (SSR)    | `NITRO_PRESET=vercel vite build`        |
| Netlify (SSR)   | `NITRO_PRESET=netlify vite build`       |
| Node server     | `NITRO_PRESET=node-server vite build`   |
| Cloudflare      | `vite build` (default)                  |

Static-only Vercel hosting is still possible via the `upcare-static-v2.zip`
export, but this SSR path is the recommended one for the real app.
