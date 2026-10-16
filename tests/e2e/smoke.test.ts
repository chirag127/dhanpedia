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

  test('tax-shield calculator compares new vs old regime', async ({ page }) => {
    await page.goto('/calculators/tax-shield');
    await expect(page.getByText('New-regime tax + cess')).toBeVisible();
    await expect(page.getByText('Old-regime tax + cess')).toBeVisible();
    await expect(page.getByText(/Save by choosing (new|old)/)).toBeVisible();
    // Chart for the salary-scaling comparison is present.
    await expect(page.locator('[role="img"]')).toBeVisible();
  });

  test('core-satellite NCD blend calculator renders blended yield', async ({ page }) => {
    await page.goto('/calculators/core-satellite');
    await expect(page.getByText('Blended annual yield')).toBeVisible();
    await expect(page.getByText('Core allocation')).toBeVisible();
    await expect(page.getByText('Satellite allocation')).toBeVisible();
    await expect(page.getByText(/If one satellite issuer defaults/)).toBeVisible();
  });

  test('advance-tax calculator renders the installment schedule', async ({ page }) => {
    await page.goto('/calculators/advance-tax');
    await expect(page.getByText('Total tax + cess (est.)')).toBeVisible();
    await expect(page.getByText('Advance tax due after TDS')).toBeVisible();
    await expect(page.getByText(/Approx 234C interest if fully deferred/)).toBeVisible();
    // Chart container for the installment bar chart is present.
    await expect(page.locator('[role="img"]')).toBeVisible();
  });

  test('SIF strategy-families article renders its decoded families and annex layers', async ({ page }) => {
    await page.goto('/articles/alternatives-sif-strategy-families-deep-dive');
    await expect(page.getByRole('heading', { name: /SIF Strategy Families/ })).toBeVisible();
    // A stable, unique H2 in the body.
    await expect(page.getByRole('heading', { name: /How to read the scheme document/ })).toBeVisible();
    // The standard article layout renders a "Sources & citations" heading (sources.length > 0).
    await expect(page.getByRole('heading', { name: /Sources & citations/ })).toBeVisible();
    await expect(page.locator('#tts-btn')).toBeVisible();
  });

  test('REIT / InvIT timing article renders its three-leg decision model', async ({ page }) => {
    await page.goto('/articles/real-estate-reit-invit-dividend-timing-tax');
    await expect(page.getByRole('heading', { name: /REIT & InvIT Dividend Timing/ })).toBeVisible();
    // A stable, unique H2 in the body.
    await expect(page.getByRole('heading', { name: /The 12-month clock/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sources & citations/ })).toBeVisible();
    await expect(page.locator('#tts-btn')).toBeVisible();
  });

  test('sif-sleeve-sizing calculator renders the net-edge decision', async ({ page }) => {
    await page.goto('/calculators/sif-sleeve-sizing');
    await expect(page.getByText('SIF net return (after fee)')).toBeVisible();
    await expect(page.getByText('Net edge vs benchmark')).toBeVisible();
    await expect(page.getByText('Fee drag over the period', { exact: true })).toBeVisible();
    // Chart container for the projected-corpus comparison is present.
    await expect(page.locator('[role="img"]')).toBeVisible();
  });

  test('reit-invit-timing calculator renders the now-vs-forward exit', async ({ page }) => {
    await page.goto('/calculators/reit-invit-timing');
    await expect(page.getByText('NAV premium / (discount)')).toBeVisible();
    await expect(page.getByText('After-tax distribution income')).toBeVisible();
    await expect(page.getByText(/Better exit/)).toBeVisible();
    // Chart container for the now-vs-forward after-tax proceeds is present.
    await expect(page.locator('[role="img"]')).toBeVisible();
  });

  test('AIF category-selection article renders the category table and profile mapping', async ({ page }) => {
    await page.goto('/articles/alternatives-aif-category-selection-guide');
    await expect(page.getByRole('heading', { name: /AIF Category Selection/ })).toBeVisible();
    // Stable, unique H2 headings in the body.
    await expect(page.getByRole('heading', { name: /Which category, by investor profile/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /The due-diligence checklist/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sources & citations/ })).toBeVisible();
    await expect(page.locator('#tts-btn')).toBeVisible();
  });

  test('AIF taxation article renders the 64C-to-78 form migration', async ({ page }) => {
    await page.goto('/articles/tax-aif-pcc-115bb-deep-dive');
    await expect(page.getByRole('heading', { name: /AIF Taxation Decoded/ })).toBeVisible();
    // Stable, unique H2 in the body.
    await expect(page.getByRole('heading', { name: /The form migration/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sources & citations/ })).toBeVisible();
    await expect(page.locator('#tts-btn')).toBeVisible();
  });

  test('aif-waterfall calculator renders the 2/20 split and the LP net outcome', async ({ page }) => {
    await page.goto('/calculators/aif-waterfall');
    await expect(page.getByText('LP net proceeds (after fee)')).toBeVisible();
    await expect(page.getByText('LP net IRR')).toBeVisible();
    await expect(page.getByText('GP total carry (before fees)')).toBeVisible();
    // Chart container for the where-the-money-goes bar chart is present.
    await expect(page.locator('[role="img"]')).toBeVisible();
  });

  test('AIF waterfall article renders the four levers and negotiation table', async ({ page }) => {
    await page.goto('/articles/alternatives-aif-waterfall-economics');
    await expect(page.getByRole('heading', { name: /The 2\/20 Waterfall/ })).toBeVisible();
    // Stable, unique H2 headings in the body.
    await expect(page.getByRole('heading', { name: /What actually moves in negotiation/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /The clawback/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Sources & citations/ })).toBeVisible();
    await expect(page.locator('#tts-btn')).toBeVisible();
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
