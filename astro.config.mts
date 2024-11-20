import react from "@astrojs/react";
// @ts-ignore
import deno from "@deno/astro-adapter";
import elm from "astro-integration-elm";
// @ts-ignore
import lighthouse from "astro-lighthouse";
import tunnel from "astro-tunnel";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [elm(), react(), tunnel(), lighthouse()],
	output: "server",
	adapter: deno(),
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
