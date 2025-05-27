import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import opengraphImages from "astro-opengraph-images";
import { customOgMediaLayout } from "./src/customRenderer.tsx";
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: "https://jonnyburch.com",
  trailingSlash: "never",
  output: 'server',
  adapter: cloudflare({
    mode: 'directory'
  }),
  vite: {
    plugins: [tailwindcss()],
    envPrefix: ['PLUNK_'] // Allow PLUNK_ prefixed environment variables
  },
  integrations: [
    opengraphImages({
      options: {
        fonts: [
          {
            name: "Inter",
            weight: 400,
            style: "normal",
            data: fs.readFileSync("./src/assets/fonts/Inter-Regular.ttf"),
          },
          {
            name: "Inter",
            weight: 700,
            style: "normal",
            data: fs.readFileSync("./src/assets/fonts/Inter-Bold.ttf"),
          },
        ],
      },
      render: customOgMediaLayout,
    }),
  ]
});