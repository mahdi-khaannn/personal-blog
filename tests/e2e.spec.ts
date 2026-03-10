import { test, expect } from '@playwright/test';

test.describe('Mahdi Khan V2 Enterprise E2E Test Suite', () => {

    test('Newsletter Subscription Validation & UI Snapshot', async ({ page }) => {
        await page.goto('/newsletter');

        // Initial UI Regression check
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('newsletter-initial.png', { maxDiffPixels: 100 });

        // Verify specific V2 components exist
        await expect(page.getByText('Get the next issue this Monday')).toBeVisible();

        // Test Invalid State (now relies on custom React logic via noValidate)
        await page.fill('input[type="email"]', 'not-an-email');
        await page.click('button[type="submit"]:has-text("Subscribe")');
        await expect(page.getByText('Please enter a valid email address.')).toBeVisible();

        // Test Valid State & Async loading
        await page.fill('input[type="email"]', 'engineering@mahdikhan.com');
        await page.click('button[type="submit"]:has-text("Subscribe")');

        // Assert Success State Transition (1.2s synthetic delay)
        await expect(page.getByText('You\'re in!')).toBeVisible({ timeout: 3000 });
    });

    test('Theme Toggle Engine & Homepage Visual Regression', async ({ page }) => {
        await page.goto('/');

        // Take Light Mode UI Baseline Snapshot
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('homepage-light.png', { maxDiffPixels: 200 });

        // Locate the toggle button explicitly via accessibility tags
        const toggleButton = page.getByRole('button', { name: /toggle theme/i }).or(page.locator('button[aria-label*="theme" i], button[aria-label*="dark mode" i]')).first();

        // Test HTML Dark class application
        const html = page.locator('html');
        const isInitiallyDark = await html.evaluate(node => node.classList.contains('dark'));

        await toggleButton.click();

        // Assert transition
        const isNowDark = await html.evaluate(node => node.classList.contains('dark'));
        expect(isNowDark).toBe(!isInitiallyDark);

        // Wait for CSS transitions to settle before snapping Dark Mode
        await page.waitForTimeout(500);
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot('homepage-dark.png', { maxDiffPixels: 200 });

        // Assert JS LocalStorage Persistence
        const storageTheme = await page.evaluate(() => localStorage.getItem('theme'));
        expect(storageTheme).toBe(isNowDark ? 'dark' : 'light');

        // Navigate via router and ensure it holds
        await page.goto('/blog');
        const isStillDark = await html.evaluate(node => node.classList.contains('dark'));
        expect(isStillDark).toBe(isNowDark);
    });

    test('Pagefind Local Search Operations', async ({ page }) => {
        await page.goto('/');

        // Open Search Modal 
        const searchButton = page.getByRole('button', { name: /search/i }).first();
        await searchButton.click();

        // Wait for Pagefind input to mount
        const searchInput = page.locator('.pagefind-ui__search-input');
        await expect(searchInput).toBeVisible();

        // Perform search
        await searchInput.fill('agent');

        // Await index query and assert results
        const results = page.locator('.pagefind-ui__result');
        await expect(results.first()).toBeVisible({ timeout: 8000 });
    });
});
