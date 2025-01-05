import { test, expect } from '@playwright/test';

test.describe('API Health Endpoint Tests', () => {
  // Basic HTTP Method Tests
  test('GET /api/health.json returns 200 with correct response', async ({ page }) => {
    // Make request through the page API
    const response = await page.request.get('/api/health.json');
    
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/json');
    
    const body = await response.json();
    expect(body).toEqual({ status: "OK" });
  });

  test('GET /api/health.json with simulate_error returns 500', async ({ page }) => {
    const response = await page.request.get('/api/health.json?simulate_error=true');
    
    expect(response.ok()).toBe(false);
    expect(response.status()).toBe(500);
    expect(response.headers()['content-type']).toBe('application/json');
    
    const body = await response.json();
    expect(body).toEqual({ error: 'Internal Server Error' });
  });

  test('HEAD request with network monitoring', async ({ page, request }) => {
    // Track all network requests
    const requests: string[] = [];
    page.on('request', request => requests.push(request.method()));
    
    const response = await request.head('/api/health.json');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('application/json');
    expect(response.headers()['content-length']).toBeDefined();
  });



  // Network Interception Tests
  // test('mock network error response', async ({ page }) => {
  //   // Intercept the request and mock a network error
  //   await page.route('**/api/health.json', route => {
  //     route.abort('internetdisconnected');
  //   });

  //   const response = await page.request.get('/api/health.json').catch(e => e);
  //   expect(response.message).toContain('net::ERR_INTERNET_DISCONNECTED');
  // });

  // test('modify response headers', async ({ page }) => {
  //   // Intercept and modify response headers
  //   await page.route('**/api/health.json', async route => {
  //     const response = await route.fetch();
  //     const headers = {
  //       ...response.headers(),
  //       'x-custom-header': 'test-value'
  //     };
  //     route.fulfill({
  //       response,
  //       headers
  //     });
  //   });

  //   const response = await page.request.get('/api/health.json');
  //   expect(response.headers()['x-custom-header']).toBe('test-value');
  // });

  // Response Time Tests
  // test('measure response time', async ({ page }) => {
  //   const startTime = Date.now();
  //   const responsePromise = page.waitForResponse('**/api/health.json');

  //   await page.request.get('/api/health.json');
    
  //   const response = await responsePromise;
  //   const endTime = Date.now();
  //   const responseTime = endTime - startTime;

  //   expect(response.status()).toBe(200);
  //   expect(responseTime).toBeLessThan(2000); // Response should be under 2 seconds
  // });

  // // Simulate Slow Network
  // test('handle slow network', async ({ page }) => {
  //   // Simulate a slow 3G network
  //   await page.route('**/api/health.json', async route => {
  //     const response = await route.fetch();
  //     // Add 1 second delay
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //     route.fulfill({
  //       response
  //     });
  //   });

  //   const startTime = Date.now();
  //   const response = await page.request.get('/api/health.json');
  //   const responseTime = Date.now() - startTime;

  //   expect(response.status()).toBe(200);
  //   expect(responseTime).toBeGreaterThanOrEqual(1000);
  // });

  // // Request Retry Test
  // test('retry failed requests', async ({ page }) => {
  //   let attempts = 0;
  //   await page.route('**/api/health.json', async route => {
  //     attempts++;
  //     if (attempts === 1) {
  //       route.abort('failed');
  //     } else {
  //       route.fulfill({
  //         status: 200,
  //         body: JSON.stringify({ status: 'OK' })
  //       });
  //     }
  //   });

  //   const response = await page.request.get('/api/health.json', {
  //     maxRedirects: 0,
  //     timeout: 5000
  //   });

  //   expect(attempts).toBe(2);
  //   expect(response.status()).toBe(200);
  // });

  // // Network Resource Size Test
  // test('check response size', async ({ page }) => {
  //   const responsePromise = page.waitForResponse('**/api/health.json');
    
  //   await page.request.get('/api/health.json');
  //   const response = await responsePromise;
    
  //   const body = await response.body();
  //   expect(body.length).toBeLessThan(1024); // Response should be less than 1KB
  // });
});
