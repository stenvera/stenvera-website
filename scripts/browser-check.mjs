import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

if (!process.env.SITE_URL) throw new Error('Set SITE_URL to the site to check');
const base = new URL(process.env.SITE_URL);
await mkdir('artifacts/browser', { recursive: true });
const browser = await chromium.launch();
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const locale of ['nl-NL', 'en-US']) {
      const context = await browser.newContext({ viewport, locale, colorScheme: 'dark' });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(new URL('/?source=browser-check#about', base).href);
      const language = locale.slice(0, 2);
      await page.waitForFunction(lang => document.documentElement.lang === lang, language);
      assert.equal(new URL(page.url()).searchParams.get('source'), 'browser-check');
      assert.equal(new URL(page.url()).hash, '#about');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      await page.locator('[data-set-theme="light"]').click();
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      assert.equal(await page.locator('[data-set-theme="light"]').getAttribute('aria-pressed'), 'true');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'horizontal overflow');
      await page.screenshot({ path: `artifacts/browser/${language}-${viewport.width}-light.png`, fullPage: true });
      await page.locator('[data-set-theme="dark"]').click();
      await page.screenshot({ path: `artifacts/browser/${language}-${viewport.width}-dark.png`, fullPage: true });
      const other = language === 'nl' ? 'en' : 'nl';
      await page.locator('.lang-link', { hasText: other.toUpperCase() }).click();
      await page.waitForFunction(lang => document.documentElement.lang === lang, other);
      await page.goto(base.href);
      await page.waitForFunction(lang => document.documentElement.lang === lang, other);
      assert.deepEqual(errors, [], 'browser JavaScript errors');
      await context.close();
    }
  }
  console.log(`PASS: ${base.origin}: Chromium NL/EN, language persistence, OS theme, theme persistence and desktop/mobile layout`);
} finally {
  await browser.close();
}
