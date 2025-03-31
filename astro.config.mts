import react from "@astrojs/react";

// @ts-ignore
import lighthouse from "astro-lighthouse";
import tunnel from "astro-tunnel";
// @ts-check
import { defineConfig, envField } from "astro/config";
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	integrations: [ react(), tunnel(), lighthouse()],
	output: "server",
	adapter: netlify(),
	env: {
		schema: {
		  API_URL: envField.string({ context: "client", access: "public", optional: true }),
		  PORT: envField.number({ context: "server", access: "public", default: 4321 }),
		  API_SECRET: envField.string({ context: "server", access: "secret" }),
		}
	  },
	experimental: {
		session: true,
	  },
	i18n: {
		defaultLocale: "en",
		locales: ["en", "pl"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
	vite: {
		resolve: {
			alias: {
				"~": "/src",
				"~components": "/src/components",
			},
		},
	},
});
