import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Deploy target is controlled by NITRO_PRESET.
// - Lovable / Cloudflare (default): unset → "cloudflare-module".
// - Vercel:  NITRO_PRESET=vercel  (wired automatically in vercel.json)
// - Netlify: NITRO_PRESET=netlify
// - Node:    NITRO_PRESET=node-server
const nitroPreset = process.env.NITRO_PRESET;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  ...(nitroPreset ? { nitro: { preset: nitroPreset } } : {}),
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: null,
        filename: "sw.js",
        devOptions: { enabled: false },
        manifest: false,
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" && !url.pathname.startsWith("/~oauth") && !url.pathname.startsWith("/api/"),
              handler: "NetworkFirst",
              options: {
                cacheName: "upcare-pages",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
            {
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && /\.(?:js|css|woff2|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "upcare-assets",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com",
              handler: "StaleWhileRevalidate",
              options: { cacheName: "upcare-fonts" },
            },
          ],
        },
      }),
    ],
  },
});
