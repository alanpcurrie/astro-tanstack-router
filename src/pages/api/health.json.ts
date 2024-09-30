import type { APIRoute } from "astro";
// import { z } from "astro:content";


export const GET: APIRoute = () => {
	return new Response(JSON.stringify({ status: "OK" }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
};



