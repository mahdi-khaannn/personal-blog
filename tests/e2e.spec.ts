import { test, expect, type Page } from '@playwright/test';

async function waitForHydration(page: Page) {
  await page.waitForFunction(() =>
    Array.from(document.querySelectorAll('astro-island')).every((island) => !island.hasAttribute('ssr'))
  );
}

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((nextTheme) => {
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }, theme);
  await page.reload();
  await waitForHydration(page);
}

test.describe('Mahdi Khan blog flows', () => {
  test('newsletter validates invalid email and completes the success state', async ({ page }) => {
    await page.goto('/newsletter');
    await waitForHydration(page);

    await expect(page.getByRole('heading', { name: 'The Weekly Synthesis' })).toBeVisible();

    const emailInput = page.getByRole('textbox', { name: 'Email address' });
    const submitButton = page.getByRole('button', { name: 'Subscribe' });

    await emailInput.fill('not-an-email');
    await submitButton.click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();

    await emailInput.fill('engineering@mahdikhan.com');
    await submitButton.click();
    await expect(emailInput).toBeDisabled();

    await expect(page.getByRole('heading', { name: /you're in!/i })).toBeVisible({ timeout: 10000 });
  });

  test('search opens from keyboard and returns indexed article results', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);
    await expect(page.getByRole('button', { name: 'Search articles' }).getByText(/⌘K|Ctrl K/)).toBeVisible();

    await page.keyboard.press('/');

    const searchInput = page.getByPlaceholder('Search articles, patterns, frameworks...');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('crewai');
    await expect(page.getByRole('link', { name: /CrewAI Deep Dive/i }).first()).toBeVisible({ timeout: 10000 });

    await page.keyboard.press('Escape');
    await expect(searchInput).not.toBeVisible();
  });

  test('theme choice persists through client-side navigation', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);
    await setTheme(page, 'light');

    const toggleButton = page.getByRole('button', { name: /toggle dark mode/i });
    await toggleButton.click();

    await expect.poll(() =>
      page.evaluate(() => ({
        classDark: document.documentElement.classList.contains('dark'),
        theme: document.documentElement.dataset.theme,
        storage: localStorage.getItem('theme'),
      }))
    ).toEqual({ classDark: true, theme: 'dark', storage: 'dark' });
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    await page.locator('header nav').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect.poll(() =>
      page.evaluate(() => ({
        classDark: document.documentElement.classList.contains('dark'),
        theme: document.documentElement.dataset.theme,
        storage: localStorage.getItem('theme'),
      }))
    ).toEqual({ classDark: true, theme: 'dark', storage: 'dark' });
  });
});
