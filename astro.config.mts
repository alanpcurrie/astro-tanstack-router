import react from "@astrojs/react";

// @ts-ignore
import deno from "@deno/astro-adapter";
// import sentry from "@sentry/astro";
// import spotlightjs from "@spotlightjs/astro";
import elm from "astro-integration-elm";
// @ts-ignore
import lighthouse from "astro-lighthouse";
import tunnel from "astro-tunnel";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		elm(),
		react(),
		tunnel(),
		lighthouse(),
		// sentry(),
		// spotlightjs(),
	],
	output: "server",
	adapter: deno(),
	// env: {
	// 	schema: {
	// 		CLIENT_API_URL: envField.string({ context: "client", access: "public" }),
	// 		SERVER_API_URL: envField.string({ context: "server", access: "public" }),
	// 		API_SECRET: envField.string({ context: "server", access: "secret" }),
	// 	},
	// },
	i18n: {
		defaultLocale: "en",
		locales: ["en", "pl"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
