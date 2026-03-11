import { test, expect, type Page } from '@playwright/test';

type ThemeAudit = {
  theme: 'light' | 'dark';
  body: { background: string; brightness: number | null };
  footer: { background: string; brightness: number | null };
  search: { background: string; brightness: number | null };
  calendar: { background: string; brightness: number | null };
  logoFontFamily: string;
};

async function applyTheme(page: Page, theme: 'light' | 'dark') {
  await page.evaluate((nextTheme) => {
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }, theme);
  await page.reload();
}

async function collectThemeAudit(page: Page): Promise<ThemeAudit> {
  return page.evaluate(() => {
    const brightness = (color: string) => {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!match) return null;

      const [r, g, b] = match.slice(1).map(Number);
      return Math.round((r * 299 + g * 587 + b * 114) / 1000);
    };

    const bodyStyles = getComputedStyle(document.body);
    const footerStyles = getComputedStyle(document.querySelector('footer') as HTMLElement);
    const searchStyles = getComputedStyle(document.querySelector('button[aria-label="Search articles"]') as HTMLElement);
    const calendarStyles = getComputedStyle(document.querySelector('[data-calendar-shell]') as HTMLElement);
    const logoStyles = getComputedStyle(document.querySelector('[data-logo-wordmark] > span') as HTMLElement);

    return {
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      body: {
        background: bodyStyles.backgroundColor,
        brightness: brightness(bodyStyles.backgroundColor),
      },
      footer: {
        background: footerStyles.backgroundColor,
        brightness: brightness(footerStyles.backgroundColor),
      },
      search: {
        background: searchStyles.backgroundColor,
        brightness: brightness(searchStyles.backgroundColor),
      },
      calendar: {
        background: calendarStyles.backgroundColor,
        brightness: brightness(calendarStyles.backgroundColor),
      },
      logoFontFamily: logoStyles.fontFamily,
    };
  });
}

test('shared chrome stays theme-consistent in light and dark modes', async ({ page }) => {
  await page.goto('/about');

  await applyTheme(page, 'light');
  const lightAudit = await collectThemeAudit(page);

  await applyTheme(page, 'dark');
  const darkAudit = await collectThemeAudit(page);

  expect(lightAudit.theme).toBe('light');
  expect(darkAudit.theme).toBe('dark');

  expect(lightAudit.footer.background).not.toBe(darkAudit.footer.background);
  expect(lightAudit.search.background).not.toBe(darkAudit.search.background);
  expect(lightAudit.calendar.background).not.toBe(darkAudit.calendar.background);

  expect(lightAudit.footer.brightness).not.toBeNull();
  expect(lightAudit.search.brightness).not.toBeNull();
  expect(lightAudit.calendar.brightness).not.toBeNull();
  expect(darkAudit.footer.brightness).not.toBeNull();
  expect(darkAudit.search.brightness).not.toBeNull();
  expect(darkAudit.calendar.brightness).not.toBeNull();

  expect(lightAudit.footer.brightness!).toBeGreaterThan(120);
  expect(lightAudit.search.brightness!).toBeGreaterThan(120);
  expect(lightAudit.calendar.brightness!).toBeGreaterThan(120);

  expect(darkAudit.footer.brightness!).toBeLessThan(60);
  expect(darkAudit.search.brightness!).toBeLessThan(60);
  expect(darkAudit.calendar.brightness!).toBeLessThan(60);

  expect(lightAudit.logoFontFamily.toLowerCase()).toContain('caveat brush');
  expect(darkAudit.logoFontFamily.toLowerCase()).toContain('caveat brush');
});
