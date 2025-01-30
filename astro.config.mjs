import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import opengraphImages from "astro-opengraph-images";
import { customOgMediaLayout } from "./src/customRenderer";

export default defineConfig({
  site: "https://jonnyburch.com",
  trailingSlash: "never",
  vite: {
    plugins: [tailwindcss()],
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