import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import opengraphImages, { presets } from "astro-opengraph-images";


import opengraphImages from "astro-opengraph-images";

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
            name: "Inter Variable",
            weight: 400,
            style: "normal",
            data: fs.readFileSync("node_modules/@fontsource/inter/files/inter-latin-400-normal.woff"),
          },
        ],
      },
      render: presets.simpleBlog,
    }),
  ]
});