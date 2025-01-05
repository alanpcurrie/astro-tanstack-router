import type { APIRoute } from "astro";

const ALLOWED_METHODS = ['GET', 'HEAD', 'OPTIONS'];

export const ALL: APIRoute = async ({ request }) => {
	const method = request.method;
	const url = new URL(request.url);
	const acceptHeader = request.headers.get('accept');

	// Handle simulated error
	if (url.searchParams.has('simulate_error')) {
		return new Response(
			JSON.stringify({ error: 'Internal Server Error' }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	// Handle OPTIONS request
	if (method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: {
				'Allow': ALLOWED_METHODS.join(', '),
				'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
				'Access-Control-Allow-Headers': 'Content-Type, Accept'
			}
		});
	}

	// Check for valid method
	if (!ALLOWED_METHODS.includes(method)) {
		return new Response(
			JSON.stringify({ error: 'Method Not Allowed' }),
			{
				status: 405,
				headers: {
					'Content-Type': 'application/json',
					'Allow': ALLOWED_METHODS.join(', ')
				}
			}
		);
	}

	// Check Accept header
	if (acceptHeader && !acceptHeader.includes('*/*') && !acceptHeader.includes('application/json')) {
		return new Response(
			JSON.stringify({ error: 'Not Acceptable - Only application/json is supported' }),
			{
				status: 406,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	// Handle GET and HEAD
	const responseBody = JSON.stringify({ status: "OK" });
	return new Response(method === 'HEAD' ? null : responseBody, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': responseBody.length.toString()
		}
	});
};
