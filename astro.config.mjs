import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  output: "hybrid",
  adapter: cloudflare({
    mode: "directory",
    functionPerRoute: true,
    platformProxy: {
      enabled: true,
    },
  }),
  security: {
    checkOrigin: true,
  },
});
