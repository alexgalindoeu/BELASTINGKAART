// Browser checks with Playwright (not part of `npm test`, which must run without a browser):
//   npm run test:browser            (SHOTS=<dir> to save screenshots)
// Serves web/ on 127.0.0.1:8714 both at "/" (custom domain layout) and under "/BELASTINGKAART/"
// (GitHub Pages project path), answering unknown URLs with web/404.html and status 404, then checks:
//   - every page loads without console errors and without horizontal scroll at 390 px;
//   - a French browser lands on /fr/ from the root and sees a French-only 404, also under the project path;
//   - a Dutch browser lands on /nl/ and sees a Dutch-only 404;
//   - a click on the language switch is remembered for later pages and for the root;
//   - without JavaScript the root offers both languages and the 404 shows Dutch with one link to French.
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
import { WEB, discoverPages } from '../../tools/lib/pages.mjs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright')); }
const PORT = Number(process.env.PORT || 8714);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const SHOTS = process.env.SHOTS;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, ORIGIN).pathname);
  if (/^\/BELASTINGKAART(\/|$)/.test(p)) p = p.replace(/^\/BELASTINGKAART/, '') || '/';
  let file = path.join(WEB, p);
  if (!file.startsWith(WEB.replace(/\/$/, ''))) { res.writeHead(400); return res.end(); }
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); await stat(file); }
  catch {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return res.end(await readFile(path.join(WEB, '404.html')));
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
});
await new Promise(r => server.listen(PORT, '127.0.0.1', r));

const browser = await playwright.chromium.launch();
const failures = [];
async function check(name, fn) {
  try { await fn(); console.log('ok  ' + name); }
  catch (e) { failures.push(name); console.log('FAIL ' + name + '\n     ' + String(e.message).split('\n').join('\n     ')); }
}
const visible = page => page.evaluate(() => document.body.innerText);

try {
  if (SHOTS) await mkdir(SHOTS, { recursive: true });
  const routes = (await discoverPages()).map(p => p.route);

  await check('all pages: no console errors, no horizontal scroll at 390 px', async () => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'nl-BE' });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(`${page.url()}: ${m.text()}`); });
    page.on('pageerror', e => errors.push(`${page.url()}: ${e.message}`));
    for (const route of routes) {
      await page.goto(`${ORIGIN}/${route}`, { waitUntil: 'networkidle' });
      assert.equal(new URL(page.url()).pathname, '/' + route, 'no redirect without a saved choice');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 0, `${route}: horizontal scroll of ${overflow}px`);
      if (SHOTS && /over-belastingkaart|a-propos|juridische|mentions|cookies|disclaimer|avertissement|validatie|validation/.test(route))
        await page.screenshot({ path: path.join(SHOTS, route.replace(/\//g, '_') + '390.png'), fullPage: true });
    }
    assert.deepEqual(errors, []);
    await ctx.close();
  });

  for (const base of ['', '/BELASTINGKAART']) {
    await check(`French browser${base ? ' under ' + base : ''}: root goes to /fr/, 404 is French only`, async () => {
      const ctx = await browser.newContext({ locale: 'fr-BE', viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${ORIGIN}${base}/`, { waitUntil: 'networkidle' });
      assert.equal(new URL(page.url()).pathname, `${base}/fr/`);
      const res = await page.goto(`${ORIGIN}${base}/deze/pagina/bestaat/niet`, { waitUntil: 'networkidle' });
      assert.equal(res.status(), 404);
      const t = await visible(page);
      assert.match(t, /Page introuvable/);
      assert.doesNotMatch(t, /Pagina niet gevonden|Naar de startpagina|onafhankelijk/);
      assert.equal(await page.evaluate(() => document.documentElement.lang), 'fr');
      assert.equal(await page.title(), 'Page introuvable | Belastingkaart');
      const styled = await page.evaluate(() => getComputedStyle(document.querySelector('.appbar')).position);
      assert.notEqual(styled, 'static', 'site.css loaded');
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `404-fr${base ? '-subpath' : ''}.png`), fullPage: true });
      await page.click('main .btn-primary >> visible=true');
      await page.waitForLoadState('networkidle');
      assert.equal(new URL(page.url()).pathname, `${base}/fr/`);
      assert.deepEqual(errors, []);
      await ctx.close();
    });

    await check(`Dutch browser${base ? ' under ' + base : ''}: root goes to /nl/, 404 is Dutch only`, async () => {
      const ctx = await browser.newContext({ locale: 'nl-BE' });
      const page = await ctx.newPage();
      await page.goto(`${ORIGIN}${base}/`, { waitUntil: 'networkidle' });
      assert.equal(new URL(page.url()).pathname, `${base}/nl/`);
      await page.goto(`${ORIGIN}${base}/a/b/c`, { waitUntil: 'networkidle' });
      const t = await visible(page);
      assert.match(t, /Pagina niet gevonden/);
      assert.doesNotMatch(t, /Page introuvable|Vers la page|Version française/);
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `404-nl${base ? '-subpath' : ''}.png`), fullPage: true });
      await ctx.close();
    });
  }

  await check('a German browser defaults to Dutch', async () => {
    const ctx = await browser.newContext({ locale: 'de-DE' });
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}/BELASTINGKAART/`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/BELASTINGKAART/nl/');
    await ctx.close();
  });

  await check('the language switch is remembered on later pages and at the root', async () => {
    const ctx = await browser.newContext({ locale: 'nl-BE' });
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}/BELASTINGKAART/nl/bronnen/`, { waitUntil: 'networkidle' });
    await page.click('.lang-switch');
    await page.waitForURL('**/fr/sources/');
    assert.equal(await page.evaluate(() => localStorage.getItem('bk-lang')), 'fr');
    await page.goto(`${ORIGIN}/BELASTINGKAART/nl/methodologie/`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/BELASTINGKAART/fr/methodologie/');
    await page.goto(`${ORIGIN}/BELASTINGKAART/`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/BELASTINGKAART/fr/');
    await page.click('.footer a[lang="nl"]');
    await page.waitForURL('**/nl/');
    assert.equal(await page.evaluate(() => localStorage.getItem('bk-lang')), 'nl');
    await page.goto(`${ORIGIN}/fr/sources/`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/nl/bronnen/');
    await ctx.close();
  });

  await check('without JavaScript: root offers both languages, 404 shows Dutch and one link to French', async () => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, locale: 'fr-BE' });
    const page = await ctx.newPage();
    await page.goto(`${ORIGIN}/`);
    assert.equal(new URL(page.url()).pathname, '/');
    assert.equal(await page.locator('a[href="nl/"]').count(), 1);
    assert.equal(await page.locator('a[href="fr/"]').count(), 1);
    await page.goto(`${ORIGIN}/nope/`);
    const t = await visible(page);
    assert.match(t, /Pagina niet gevonden/);
    assert.doesNotMatch(t, /Page introuvable/);
    assert.match(t, /Version française/);
    await page.click('main .l-nl a[lang="fr"]');
    assert.equal(new URL(page.url()).pathname, '/fr/');
    await ctx.close();
  });
} finally {
  await browser.close();
  server.close();
}
if (failures.length) { console.error(`${failures.length} browser check(s) failed`); process.exit(1); }
console.log('All browser checks passed.');
