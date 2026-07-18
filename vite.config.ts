import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves the app from https://tersit1989.github.io/Valencia_2026/
const BASE = "/Valencia_2026/";

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Valencia 2026 — семейный гид",
        short_name: "Valencia 2026",
        description:
          "Семейный виртуальный гид по Валенсии, 22–26 июля 2026: расписание, карта, рестораны, детские миссии, план B.",
        lang: "ru",
        start_url: BASE,
        scope: BASE,
        display: "standalone",
        orientation: "portrait",
        background_color: "#fdf6ec",
        theme_color: "#e8590c",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        // Offline shell: precache the whole built app, including data JSON.
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest,json}"],
        navigateFallback: BASE + "index.html",
        runtimeCaching: [
          {
            // OSM tiles: cache-first so the already-seen map works offline.
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles",
              expiration: {
                maxEntries: 600,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
});
