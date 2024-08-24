import { defineConfig, envField } from "astro/config";
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
  vite: {
    define: {
      "process.env": process.env,
    },
  },
  experimental: {
    serverIslands: true,
    env: {
      schema: {
        BYPASS_AUTH: envField.boolean({
          context: "server",
          access: "public",
          default: false,
        }),
        TEXTBELT_API_KEY: envField.string({
          context: "server",
          access: "secret",
        }),
        UPLOADTHING_APP_ID: envField.string({
          context: "server",
          access: "public",
        }),
        UPLOADTHING_SECRET: envField.string({
          context: "server",
          access: "secret",
        }),
      },
    },
  },
});
