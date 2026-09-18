import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const viewports = [320, 390, 768, 1440];

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const details = testInfo.errors
      .map((error) => error.message)
      .join(' | ')
      .replace(/\r?\n/g, ' ')
      .replace(/%/g, '%25')
      .replace(/\r/g, '%0D')
      .replace(/\n/g, '%0A');
    console.log(`::error title=Playwright failure::${testInfo.title}: ${details}`);
  }
});

test.describe('calidad HTML, accesibilidad y responsive', () => {
  test('tiene estructura semántica y jerarquía de encabezados', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Navegación principal"]')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h2')).toHaveCount(4);
    await expect(page.locator('h3')).toHaveCount(5);
  });

  test('cumple las reglas automatizables WCAG 2.2 AA', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  for (const width of viewports) {
    test(`se adapta sin overflow a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(layout.overflow, JSON.stringify(layout)).toBe(false);
    });
  }

  test('permite navegar el menú móvil con teclado y Escape', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const menuToggle = page.locator('.menu-toggle');
    await menuToggle.click();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#main-nav')).toBeVisible();
    await expect(page.locator('#main-nav a').first()).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menuToggle).toBeFocused();
  });

  test('usa nombres accesibles para imágenes y controles', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('[role="img"]');
    for (let index = 0; index < await images.count(); index += 1) {
      await expect(images.nth(index)).toHaveAttribute('aria-label', /.+/);
    }

    await expect(page.locator('button[type="submit"]')).toHaveAccessibleName(/Solicitar reserva/);
    await expect(page.locator('.menu-toggle')).toHaveAccessibleName('Menú');
  });

  test('solo utiliza URLs externas seguras', async ({ page }) => {
    await page.goto('/');

    const externalLinks = await page.locator('a[href]').evaluateAll((links) => links
      .map((link) => ({
        href: link.href,
        target: link.target,
        rel: link.rel,
      }))
      .filter(({ href }) => /^https?:\/\//i.test(href)));

    for (const link of externalLinks) {
      expect(link.href).toMatch(/^https:\/\//i);
      if (link.target === '_blank') {
        expect(link.rel).toMatch(/noopener/i);
        expect(link.rel).toMatch(/noreferrer/i);
      }
    }
  });
});
