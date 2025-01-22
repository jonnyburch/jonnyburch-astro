import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://toy.studio",
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),
  vite: {
    plugins: [tailwindcss()],
  }
});