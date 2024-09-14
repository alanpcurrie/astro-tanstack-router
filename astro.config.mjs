import db from "@astrojs/db";
import node from "@astrojs/node";
import react from "@astrojs/react";
import webVitals from "@astrojs/web-vitals";
// @ts-ignore
import lighthouse from "astro-lighthouse";
import tunnel from "astro-tunnel";
// @ts-check
import { defineConfig } from "astro/config";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
	integrations: [
		react(),
		tunnel(),
		lighthouse(),
		webVitals(),
		db(),
		sentry(),
		spotlightjs(),
	],
	output: "server",

	adapter: node({
		mode: "standalone",
	}),
});
