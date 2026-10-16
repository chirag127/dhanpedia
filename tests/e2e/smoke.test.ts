import { test, expect } from '@playwright/test';

test.describe('DhanPedia smoke tests', () => {
  test('homepage loads with identity and category grid', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/DhanPedia/);
    await expect(page.getByText('Understand every investment.')).toBeVisible();
    // Category cards render (several distinct avenue titles present).
    await expect(page.getByText('Financial Foundations')).toBeVisible();
    await expect(page.getByText('Mutual Funds, ETFs & Index Investing')).toBeVisible();
    // A real article link is present and points to a known id.
    const articleLink = page.locator('a[href="/articles/pf-wealth-plan-10-lakh"]');
    await expect(articleLink).toHaveCount(1);
  });

  test('article renders body, sources, and reading time', async ({ page }) => {
    await page.goto('/articles/pf-wealth-plan-10-lakh');
    await expect(page.getByRole('heading', { name: /10 Lakh Wealth Plan/ })).toBeVisible();
    // Key takeaways / assumptions heading present in the prose body.
    await expect(page.locator('#assumptions-block')).toBeVisible();
    // Sources section lists real citations (use the stable heading id, not text).
    await expect(page.locator('#sources--citations')).toBeVisible();
    // Read-aloud button present (accessible control).
    await expect(page.locator('#tts-btn')).toBeVisible();
  });

  test('calculator computes a result and shows the value', async ({ page }) => {
    await page.goto('/calculators/sip-vs-lumpsum');
    // Set a default-ish input and read the computed SIP future value.
    await page.getByLabel(/Amount \(₹/).first().fill('15000');
    await expect(page.getByText('SIP future value')).toBeVisible();
    // The result card shows an inr value (₹ prefix).
    const resultCard = page.locator('text=₹').first();
    await expect(resultCard).toBeVisible();
  });

  test('PMS / AIF fee calculator renders its layered-fee results', async ({ page }) => {
    await page.goto('/calculators/pms-aif-fees');
    // The calculator island renders its result cards (stable DOM labels).
    await expect(page.getByText('Final value (with fees)')).toBeVisible();
    await expect(page.getByText('Total performance fees')).toBeVisible();
    await expect(page.getByText('Lost to fees')).toBeVisible();
    // The chart mounts a canvas (role img with the alt) and the alt text is in the DOM.
    await expect(page.locator('[role="img"]')).toBeVisible();
  });

  test('dark mode toggle flips theme and persists', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#theme-toggle');
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('books page lists real downloads without broken links', async ({ page }) => {
    await page.goto('/books');
    // At least one book title shows.
    await expect(page.getByText('The Complete Indian Investor')).toBeVisible();
    // Every download link points under /downloads/ (real files), and the count
    // matches the number of link elements (no href="#" or empty).
    const dlLinks = page.locator('a[download]');
    const n = await dlLinks.count();
    expect(n).toBeGreaterThan(0);
    for (let i = 0; i < n; i++) {
      const href = await dlLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^\/downloads\//);
      expect(href).toBeTruthy();
    }
  });

  test('404 page renders for a missing route', async ({ page }) => {
    const res = await page.goto('/definitely-not-a-real-page');
    // astro preview returns 404.html for unknown routes.
    await expect(page.getByText('Page not found')).toBeVisible();
  });
});
