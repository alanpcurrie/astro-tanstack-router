import { test, expect } from '@playwright/test';

test.describe('API Route Test', () => {
  test('GET /api/health.json returns OK status', async ({ request }) => {
    // Send a GET request to the API endpoint
    const response = await request.get('/api/health.json');

    // Check if the status code is 200
    expect(response.status()).toBe(200);

    // Check if the Content-Type header is set correctly
    expect(response.headers()['content-type']).toBe('application/json');

    // Parse the response body
    const body = await response.json();

    // Check if the response body contains the expected data
    expect(body).toEqual({ status: "OK" });
  });
});