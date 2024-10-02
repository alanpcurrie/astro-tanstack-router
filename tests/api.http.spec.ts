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


test.describe('API Route Test for Network Errors:', () => {
  
  // E2E Test for Handling Network Errors
  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept the network request to the specific API endpoint
    await page.route('**/api/health.json', async (route) => {
      // Mock a 500 Internal Server Error response
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // Navigate to the page that makes the API request
    await page.goto('/');

    // Depending on your frontend implementation, adjust the selector accordingly.
    // For example, if your UI displays "Error loading data" on API failure:
    await expect(page.locator('text="Error loading data"')).toBeVisible();

    // Alternatively, if you're displaying error messages in a specific element:
    // await expect(page.locator('.error-message')).toContainText('Internal Server Error');
  });
});
