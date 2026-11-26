// Browser checks of the map (Playwright; not part of `npm test`):
//   npm run test:browser:kaart          (SHOTS=<dir> to save screenshots)
// Serves web/ on 127.0.0.1:8741 and checks web/nl/kaart/ and web/fr/carte/ at 390 and 1280 px, in light
// and dark: the map renders, hover shows the tooltip in the page language, a click selects, a first tap
// shows the tooltip and a second tap selects, the keyboard moves and selects, the search and the list
// select, the province zoom works, no console errors and no horizontal scroll.
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import { WEB } from '../../tools/lib/pages.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright')); }
const PORT = Number(process.env.PORT || 8741);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.SHOTS;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = http.createServer(async (req, res) => {
  let file = path.join(WEB, decodeURIComponent(new URL(req.url, ORIGIN).pathname));
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const browser = await playwright.chromium.launch();
const failures = [];
const check = async (name, fn) => {
  try { await fn(); console.log('ok   ' + name); } catch (e) { failures.push(name); console.log('FAIL ' + name + '\n     ' + String(e.message).split('\n').join('\n     ')); }
};
const PAGES = { nl: { url: '/nl/kaart/', gent: 'Gent', region: 'Vlaanderen', yours: 'Jouw gemeente', other: /Votre commune|Région/ },
  fr: { url: '/fr/carte/', gent: 'Gand', region: 'Flandre', yours: 'Votre commune', other: /Jouw gemeente|Vlaanderen\b(?! )/ } };
if (SHOTS) await mkdir(SHOTS, { recursive: true });

try {
  for (const [lang, P] of Object.entries(PAGES)) for (const width of [390, 1280]) for (const scheme of ['light', 'dark']) {
    const touch = width === 390;
    await check(`${lang} ${width}px ${scheme}`, async () => {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, hasTouch: touch, isMobile: touch, locale: lang + '-BE' });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(ORIGIN + P.url, { waitUntil: 'networkidle' });
      await page.waitForSelector('.kaart-svg .gem');
      assert.equal(await page.locator('.kaart-svg .gem').count(), 285);
      assert.equal(await page.getAttribute('[data-kaart]', 'data-kaart-state'), 'regions');
      const legend = await page.textContent('.legend');
      assert.ok(legend.includes(P.region) && legend.includes(P.yours), legend);
      assert.doesNotMatch(legend, /\d|%/);
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(scrollW <= 0, `horizontal scroll of ${scrollW}px`);
      const gem = page.locator('.gem[data-nis="44021"]');   // Gent
      const box = await gem.boundingBox();
      const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      if (touch) {
        await page.touchscreen.tap(cx, cy);
        await page.waitForSelector('.kaart-tip:not([hidden])');
        assert.match(await page.textContent('.kaart-tip'), new RegExp(P.gent));
        assert.equal(await page.locator('.gem.yours').count(), 0, 'first tap only shows the tooltip');
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/kaart-${lang}-${width}-${scheme}-tap.png` });
        await page.touchscreen.tap(cx, cy);
      } else {
        await page.mouse.move(cx, cy);
        await page.waitForSelector('.kaart-tip:not([hidden])');
        const tip = await page.textContent('.kaart-tip');
        assert.ok(tip.includes(P.gent) && tip.includes(P.region), tip);
        assert.doesNotMatch(tip, P.other);
        assert.doesNotMatch(tip, /\d|%/);
        if (SHOTS) await page.screenshot({ path: `${SHOTS}/kaart-${lang}-${width}-${scheme}-hover.png` });
        await page.mouse.click(cx, cy);
      }
      await page.waitForSelector('.gem.yours[data-nis="44021"]');
      assert.match(await page.textContent('[data-kaart-live]'), new RegExp(P.gent));
      assert.equal(await page.locator('.kaart-label').count(), 1);
      assert.equal(await page.getAttribute('button[data-nis="44021"]', 'aria-pressed'), 'true');
      // keyboard: the selected municipality is the single tab stop; arrows move, Enter selects
      await page.focus('.gem[tabindex="0"]');
      assert.equal(await page.evaluate(() => document.activeElement.dataset.nis), '44021');
      await page.keyboard.press('ArrowRight');
      const moved = await page.evaluate(() => document.activeElement.dataset.nis);
      assert.ok(moved && moved !== '44021', 'arrow moved focus');
      await page.keyboard.press('Enter');
      await page.waitForSelector(`.gem.yours[data-nis="${moved}"]`);
      assert.equal(await page.locator('.gem[tabindex="0"]').count(), 1);
      // search field
      await page.fill('[data-kaart-search]', 'brugge');
      await page.press('[data-kaart-search]', 'Enter');
      await page.waitForSelector('.gem.yours[data-nis="31005"]');
      // list alternative
      await page.click('button[data-nis="71016"]');   // Genk
      await page.waitForSelector('.gem.yours[data-nis="71016"]');
      // province zoom
      await page.selectOption('[data-kaart-zoom]', '70000');
      const vb = await page.getAttribute('.kaart-svg', 'viewBox');
      assert.notEqual(vb, '0 0 1000 394');
      if (SHOTS) await page.locator('.cover-map').screenshot({ path: `${SHOTS}/kaart-${lang}-${width}-${scheme}-zoom.png` });
      await page.selectOption('[data-kaart-zoom]', '');
      if (SHOTS) await page.locator('.cover-map').screenshot({ path: `${SHOTS}/kaart-${lang}-${width}-${scheme}.png` });
      const scrollW2 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(scrollW2 <= 0, `horizontal scroll of ${scrollW2}px after interaction`);
      assert.deepEqual(errors, []);
      await ctx.close();
    });
  }
  await check('reduced motion: no transitions on the map', async () => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(ORIGIN + '/nl/kaart/', { waitUntil: 'networkidle' });
    await page.waitForSelector('.kaart-svg .gem');
    const t = await page.$eval('.kaart-svg .gem', el => getComputedStyle(el).transitionDuration);
    assert.match(t, /^0s(, 0s)*$/, t);
    await ctx.close();
  });
} finally {
  await browser.close();
  server.close();
}
if (failures.length) { console.log(`\n${failures.length} failing`); process.exit(1); }
console.log('\nall map browser checks passed');
