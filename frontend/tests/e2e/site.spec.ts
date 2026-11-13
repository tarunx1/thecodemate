import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const SIZES: [number, number][] = [[375, 812], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error' && !m.text().startsWith('Applying inline style violates the following Content Security Policy directive')) errors.push(m.text());
  });
  return errors;
}
test.describe('liquid hero', () => {
  for (const [width, height] of SIZES) {
    test(`composition at ${width}×${height}`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.setViewportSize({ width, height });
      await page.goto('/');
      const hero = page.locator('.liquid-hero');
      await expect(hero).toHaveAttribute('data-liquid-state', 'running');
      await expect(page.locator('.liquid-hero .silk-waves canvas')).toHaveCount(1);
      const m = await page.evaluate(() => {
        const hero = document.querySelector('.liquid-hero')!.getBoundingClientRect();
        const card = document.querySelector('.hero-card')!.getBoundingClientRect();
        const editorial = document.querySelector('.editorial')!;
        return {
          heroFill: hero.height / window.innerHeight,
          cardFraction: (card.width * card.height) / (hero.width * hero.height),
          overflowX: document.documentElement.scrollWidth - window.innerWidth,
          silk: document.querySelectorAll('.liquid-hero .silk-waves canvas').length,
          heroBg: getComputedStyle(document.querySelector('.liquid-hero')!).backgroundColor,
          editorialBg: getComputedStyle(editorial).backgroundColor,
          editorialTop: editorial.getBoundingClientRect().top + window.scrollY,
        };
      });
      expect(m.heroFill).toBeGreaterThanOrEqual(0.99);           // first screen is the hero
      expect(m.cardFraction).toBeLessThan(width < 700 ? 0.5 : 0.3); // card never dominates the stage
      expect(m.overflowX).toBeLessThanOrEqual(0);
      expect(m.silk).toBe(1);                                    // SilkWaves background
      expect(m.heroBg).toBe('rgb(11, 11, 11)');
      expect(m.editorialBg).toBe('rgb(11, 11, 11)');
      expect(m.editorialTop).toBeGreaterThanOrEqual(height - 1);
      // The shader must draw something substantial: share of clearly lit (non-background) pixels.
      await page.waitForTimeout(600);
      const png = await page.screenshot();
      const lit = await page.evaluate(async (b64) => {
        const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d')!; ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data; let hit = 0, n = 0;
        for (let i = 0; i < d.length; i += 4 * 16) { n++; if (d[i] > 40 && d[i] > d[i + 2] + 20) hit++; }
        return hit / n;
      }, png.toString('base64'));
      // SilkWaves is a 42%-opacity layer: measure warm-lit pixels (about 0.34–0.49 rendered; a black hero is about 0.01).
      expect(lit, 'share of hero pixels lit by SilkWaves').toBeGreaterThan(0.2);
      expect(errors).toEqual([]);
    });
  }

  test('buttons in the card stay clickable over the liquid', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-card').getByRole('link', { name: 'Explore topics' }).click();
    await expect(page).toHaveURL(/\/topics$/);
  });

  test('reduced motion shows a static composition', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const hero = page.locator('.liquid-hero');
    await expect(hero).toHaveAttribute('data-liquid-state', 'static');
    await expect(page.locator('.hero-card h1')).toBeVisible();
  });

  test('animation pauses offscreen and resumes', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('.liquid-hero');
    await expect(hero).toHaveAttribute('data-liquid-state', 'running');
    // Scroll instantly and re-apply it while polling: on slow runners a single smooth scroll
    // on this long page did not always move the hero offscreen within the default timeout.
    const scrollTo = (top: number) => page.evaluate(y => window.scrollTo({ top: y < 0 ? document.documentElement.scrollHeight : y, behavior: 'instant' }), top);
    await expect(async () => { await scrollTo(-1); await expect(hero).toHaveAttribute('data-liquid-state', 'paused', { timeout: 2000 }); }).toPass({ timeout: 20_000 });
    await expect(async () => { await scrollTo(0); await expect(hero).toHaveAttribute('data-liquid-state', 'running', { timeout: 2000 }); }).toPass({ timeout: 20_000 });
  });

  test('decorative liquid is hidden from assistive technology', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.silk-waves')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.liquid-hero canvas')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });
});

test.describe('public pages', () => {
  test('cards show photos with readable text and no visible borders', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/topics');
    const cards = page.locator('.content-card');
    await expect(cards.first()).toBeVisible();
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThan(0);
    for (let index = 0; index < cardCount; index++) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator('.content-art img')).toBeVisible();
      await expect.poll(() => card.locator('.content-art img').evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      await expect(card).toHaveCSS('border-top-width', '0px');
      await expect(card.locator('.card-copy')).toHaveCSS('border-top-width', '0px');
      // Frosted-glass card: translucent gradient with blur and light text (project skill §8).
      await expect(card).toHaveCSS('backdrop-filter', /blur\(20px\)/);
      await expect(card.locator('.card-copy h3')).toHaveCSS('color', 'rgb(248, 248, 248)');
      await expect(card.locator('.card-copy h3')).toBeVisible();
    }
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.public-theme')!).backgroundColor)).toBe('rgb(11, 11, 11)');
  });
  test('Aceternity navbar opens by hover and keyboard and keeps real routes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const headerStyle = await page.locator('.site-header').evaluate(element => {
      const style = getComputedStyle(element);
      return { radius: style.borderTopLeftRadius, border: style.borderTopWidth, blur: style.backdropFilter };
    });
    expect(headerStyle.radius).toBe('999px');
    expect(headerStyle.border).toBe('0px');
    expect(headerStyle.blur).toContain('blur(20px)');
    await expect(page.locator('.site-header .site-cta')).toHaveCSS('border-radius', '999px');
    await expect(page.locator('.hero-actions .button').first()).toHaveCSS('border-radius', '999px');
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    const topics = nav.getByRole('link', { name: 'Topics', exact: true });
    await topics.hover();
    await expect(nav.getByRole('link', { name: 'Explore all topics' })).toBeVisible();
    await topics.focus();
    await page.keyboard.press('Escape');
    await expect(nav.getByRole('link', { name: 'Explore all topics' })).toBeHidden();
    await topics.click();
    await expect(page).toHaveURL(/\/topics$/);
    await expect(nav.getByRole('link', { name: 'Topics', exact: true })).toHaveAttribute('aria-current', 'page');
  });
  test('mobile navigation drawer traps focus and restores it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open navigation' });
    await expect(trigger).toHaveCSS('border-radius', '999px');
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('typography never collapses lines', async ({ page }) => {
    for (const path of ['/', '/topics', '/topics/how-dns-works', '/projects']) {
      await page.goto(path);
      const tight = await page.evaluate(() => [...document.querySelectorAll('h1,h2,h3,p,li')]
        .map(el => { const s = getComputedStyle(el); return { t: el.textContent?.slice(0, 30), r: parseFloat(s.lineHeight) / parseFloat(s.fontSize), ls: parseFloat(s.letterSpacing) / parseFloat(s.fontSize) }; })
        .filter(x => x.r < 1.04 || x.ls < -0.04));
      expect(tight, `tight text on ${path}`).toEqual([]);
    }
  });

  for (const width of [375, 1440]) {
    test(`directory, detail and 404 render on the public theme at ${width}px`, async ({ page }) => {
      const errors = trackErrors(page);
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/topics?q=dns');
      await expect(page.locator('.content-card')).toHaveCount(1);
      expect(await page.evaluate(() => getComputedStyle(document.querySelector('.public-theme')!).backgroundColor)).toBe('rgb(11, 11, 11)');
      await page.locator('.content-card').first().click();
      await expect(page).toHaveURL(/\/topics\/how-dns-works$/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.goto('/projects');
      await expect(page.locator('.content-card').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
      const missing = await page.goto('/topics/does-not-exist');
      expect(missing?.status()).toBe(404);
    });
  }
});

const email = process.env.E2E_ADMIN_EMAIL, password = process.env.E2E_ADMIN_PASSWORD;
test.describe('admin workspace', () => {
  test.skip(!email || !password, 'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD not set (disposable owner only)');

  test('white sidebar workspace, publish dialog, mobile drawer and logout', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Password').fill(password!);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/admin$/);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.admin-theme')!).backgroundColor)).toBe('rgb(248, 248, 248)');
    await expect(page.locator('.liquid-hero')).toHaveCount(0);
    const sidebar = page.getByRole('complementary', { name: 'Admin navigation' });
    for (const label of ['Dashboard', 'Topics', 'Projects', 'Media', 'Settings']) await expect(sidebar.getByRole('link', { name: label })).toBeVisible();
    await sidebar.getByRole('link', { name: 'Topics' }).click();
    await expect(sidebar.getByRole('link', { name: 'Topics' })).toHaveAttribute('aria-current', 'page');

    // Publish confirmation is a Headless UI dialog, and cancelling changes nothing.
    await page.locator('table a, .table-wrap a').first().click();
    await expect(page.getByRole('heading', { name: 'Edit topic' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^(Unpublish|Publish draft)$/ }).first()).toBeVisible();
    const unpublish = page.getByRole('button', { name: 'Unpublish' });
    const publish = page.getByRole('button', { name: 'Publish draft' });
    const action = await unpublish.isVisible() ? unpublish : publish;
    await action.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('status')).toHaveCount(0);

    // Mobile drawer
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(sidebar).toBeHidden();
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const drawer = page.getByRole('dialog', { name: 'thecodemate admin' });
    await expect(drawer.getByRole('link', { name: 'Settings' })).toBeVisible();
    await drawer.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/\/admin\/settings$/);
    await expect(drawer).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    expect(errors).toEqual([]);
  });

  test('draft stays private until publish and disappears after unpublish', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email!);
    await page.getByLabel('Password').fill(password!);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await page.goto('/admin/topics/new');
    await page.getByLabel('Title').fill('Disposable browser topic');
    await page.getByLabel('Category').fill('Testing');
    await page.getByLabel('Permanent URL slug').fill('disposable-browser-topic');
    await page.getByLabel('Summary').fill('A disposable topic for the isolated browser publication test.');
    await page.getByLabel('Explanation (Markdown)').fill('## Tested content\n\nThis draft is private until published.');
    await page.getByRole('button', { name: 'Create draft' }).click();
    await expect(page).toHaveURL(/\/admin\/topics\/\d+$/);
    await expect(page.getByRole('button', { name: 'Publish draft' })).toBeVisible();
    const draftResponse = await page.request.get('/topics/disposable-browser-topic');
    expect(draftResponse.status()).toBe(404);
    await page.getByRole('button', { name: 'Publish draft' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Publish now' }).click();
    await expect(page.getByText('Published successfully.')).toBeVisible();
    const publishedResponse = await page.request.get('/topics/disposable-browser-topic');
    expect(publishedResponse.status()).toBe(200);
    await page.getByRole('button', { name: 'Unpublish' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Unpublish', exact: true }).click();
    await expect(page.getByText('Unpublished successfully.')).toBeVisible();
    const hiddenResponse = await page.request.get('/topics/disposable-browser-topic');
    expect(hiddenResponse.status()).toBe(404);
  });

  test('owner changes the password from settings and signs in with it', async ({ page }) => {
    const temporary = 'Temporary-E2E-owner-2027!';
    const signIn = async (secret: string) => {
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill(email!);
      await page.getByLabel('Password').fill(secret);
      await page.getByRole('button', { name: 'Sign in' }).click();
    };
    const change = async (current: string, next: string, confirm = next) => {
      await page.goto('/admin/settings');
      await page.getByLabel('Current password').fill(current);
      await page.locator('input[name="new_password"]').fill(next);
      await page.getByLabel('Confirm new password').fill(confirm);
      await page.getByRole('button', { name: 'Change password' }).click();
    };
    await signIn(password!);
    await expect(page).toHaveURL(/\/admin$/);
    await change(password!, temporary, temporary + 'x');
    await expect(page.getByText('The new passwords do not match.')).toBeVisible();
    await change('Wrong-current-password-1!', temporary);
    await expect(page.getByText('Current password is incorrect')).toBeVisible();
    await change(password!, temporary);
    await expect(page.getByText('Password changed.')).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await signIn(password!);
    await expect(page.getByRole('alert')).toBeVisible();
    await signIn(temporary);
    await expect(page).toHaveURL(/\/admin$/);
    // Restore the disposable owner's password for any later run against this stack.
    await change(temporary, password!);
    await expect(page.getByText('Password changed.')).toBeVisible();
  });
});


test('featured cards stay in one row and learning accordion works', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const rail = page.locator('.card-track').first();
  await rail.scrollIntoViewIfNeeded();
  const positions = await rail.locator('.content-card').evaluateAll(cards => cards.map(card => ({ top: card.getBoundingClientRect().top, height: card.getBoundingClientRect().height })));
  expect(positions.length).toBeGreaterThan(1);
  positions.forEach(position => { expect(position.top).toBeCloseTo(positions[0].top, 0); expect(position.height).toBeCloseTo(positions[0].height, 0); });
  await page.locator('.rail-controls').first().locator('button').last().click();
  await expect.poll(() => rail.evaluate(node => node.scrollLeft)).toBeGreaterThan(0);
  const items = page.locator('.learning-accordion .learning-item');
  await items.nth(1).getByRole('button').click();
  await expect(items.nth(1)).toHaveAttribute('data-open', 'true');
  await expect(items.first()).toHaveAttribute('data-open', 'false');
  await items.nth(1).getByRole('button').click();
  await expect(items.nth(1)).toHaveAttribute('data-open', 'false');
  expect(await rail.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
});

for (const width of [390, 1440]) {
  test(`Spotlight search expands and filters at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/topics');
    const search = page.getByRole('search');
    const input = search.getByRole('searchbox');
    const apply = search.getByRole('button', { name: 'Apply filters' });
    await expect(apply).toBeHidden();
    await input.click();
    await expect(apply).toBeVisible();
    await search.getByRole('combobox').selectOption('Networking');
    await input.fill('DNS');
    await apply.click();
    await expect(page).toHaveURL(url => url.searchParams.get('q') === 'DNS' && url.searchParams.get('category') === 'Networking');
    await expect(page.locator('.content-card')).toHaveCount(1);
    await expect(page.locator('.content-card')).toContainText('DNS');
    await page.getByRole('searchbox').click();
    await expect(page.getByRole('combobox')).toHaveValue('Networking');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('searchbox')).toBeFocused();
    await expect(page.getByRole('button', { name: 'Apply filters' })).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
