// Browser smoke test for the tool pages (not part of `npm test`; needs Playwright and Chromium).
//   npm run test:smoke                      (screenshots to SHOTS_DIR, default ./shots)
//   PLAYWRIGHT_MODULE=/path/to/playwright   if Playwright is not resolvable from the repo
// Serves web/ on 127.0.0.1:8713, fills and submits every tool in NL and FR at desktop and
// 390 px width, and checks: no console errors, no horizontal page scroll, gross panels labelled
// bruto/brut, and pending fiscal panels without any digit.
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const WEB = fileURLToPath(new URL('../../web/', import.meta.url));
const SHOTS = path.resolve(process.env.SHOTS_DIR || 'shots');
const PORT = 8713;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };

async function loadPlaywright() {
  try { return await import('playwright'); } catch (_) { /* fall through */ }
  const mod = process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright';
  return import(pathToFileURL(path.join(mod, 'index.mjs')).href);
}

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(WEB, path.normalize(p));
  if (!file.startsWith(WEB)) { res.writeHead(403); return res.end(); }
  try { const body = await readFile(file); res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' }); res.end(body); }
  catch (_) { res.writeHead(404); res.end('not found'); }
});

const amount = { nl: '3.500', fr: '3 500,00' };
const TOOLS = [
  { name: 'maandloon', nl: 'nl/maandloon/', fr: 'fr/salaire-mensuel/', form: '#ml-form', gross: '#ml-gross', net: '#ml-net',
    fill: async (page, l) => { await page.fill('[name=amount]', l === 'nl' ? '42.000' : '42 000'); await page.check('[name=payments][value="14"]'); await page.fill('[name=parttime]', '80'); } },
  { name: 'marginaal', nl: 'nl/marginaal-tarief/', fr: 'fr/taux-marginal/', form: '#mt-form', gross: '#mt-gross', net: '#mt-net',
    fill: async (page, l) => { await page.fill('[name=grossMonthly]', amount[l]); await page.fill('[name=municipality]', 'Leuven'); } },
  { name: 'aanbiedingen', nl: 'nl/jobaanbiedingen-vergelijken/', fr: 'fr/comparer-offres-emploi/', form: '#of-form', gross: '#of-gross', net: '#of-net',
    fill: async (page, l) => { await page.fill('[name=aMonthly]', amount[l]); await page.selectOption('[name=aPayments]', '13'); await page.fill('[name=bMonthly]', '3700');
      await page.fill('[name=aBonus]', '1000'); await page.check('[name=aCar]'); await page.fill('[name=municipality]', 'Gent'); } },
  { name: 'gemeenschappelijk', nl: 'nl/gemeenschappelijke-aanslag/', fr: 'fr/imposition-commune/', form: '#ga-form', gross: '#ga-gross', net: '#ga-net',
    fill: async page => { await page.fill('[name=grossA]', '42000'); await page.fill('[name=grossB]', '0'); await page.fill('[name=municipality]', 'Brugge'); } },
  { name: 'werkgevers', nl: 'nl/twee-werkgevers/', fr: 'fr/deux-employeurs/', form: '#tw-form', gross: '#tw-gross', net: '#tw-net',
    fill: async page => { await page.fill('[name=gross1]', '18000'); await page.fill('[name=gross2]', '9000'); await page.fill('[name=withholding1]', '2400');
      await page.fill('[name=municipality]', 'Antwerpen'); } },
  { name: 'scenarios', nl: 'nl/scenarios/', fr: 'fr/scenarios/', form: '#sc-form', gross: '#sc-gross', net: '#sc-net',
    fill: async (page, l) => { await page.fill('[name=grossMonthly]', amount[l]); await page.fill('[name=municipality]', 'Leuven'); await page.fill('[name=changeAmount]', '200'); },
    after: async page => { await page.selectOption('[name=change]', 'move'); await page.selectOption('[name=changeRegion]', 'brussels');
      await page.fill('[name=changeMunicipality]', 'Elsene'); await page.click('#sc-form button[type=submit]'); } },
  { name: 'widget', nl: 'nl/widget/', fr: 'fr/widget/', form: '#wg-form', net: null,
    fill: async page => { await page.check('[name=widgetTheme][value="dark"]'); } },
  { name: 'widget-frame', nl: 'nl/widget/kader.html', fr: 'fr/widget/cadre.html', form: '#wf-form', net: '#wf-net',
    fill: async (page, l) => { await page.fill('[name=grossMonthly]', amount[l]); } }
];

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

await new Promise(r => server.listen(PORT, '127.0.0.1', r));
await mkdir(SHOTS, { recursive: true });
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
try {
  for (const viewport of [{ width: 1280, height: 900, tag: 'desktop' }, { width: 390, height: 844, tag: 'mobile' }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    for (const tool of TOOLS) for (const lang of ['nl', 'fr']) {
      const label = `${tool.name}/${lang}/${viewport.tag}`;
      const page = await context.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`http://127.0.0.1:${PORT}/${tool[lang]}`, { waitUntil: 'load' });
      await tool.fill(page, lang);
      const submit = page.locator(`${tool.form} button[type=submit]`);
      if (await submit.count()) await submit.first().click();
      if (tool.after) await tool.after(page);
      await page.waitForTimeout(350);
      check(!errors.length, `${label}: console errors: ${errors.join(' | ')}`);
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      check(width <= viewport.width, `${label}: horizontal scroll (${width}px)`);
      if (tool.gross) {
        const g = await page.locator(tool.gross).innerText();
        check(/€/.test(g) && (lang === 'nl' ? /bruto/i : /brut/i).test(g), `${label}: gross panel not filled or not labelled: ${g.slice(0, 120)}`);
        const invalid = await page.locator(`${tool.form} [aria-invalid="true"]`).count();
        check(invalid === 0, `${label}: ${invalid} fields marked invalid`);
      }
      if (tool.net) {
        const n = await page.locator(tool.net).evaluate(el => el.textContent);
        check(!/\d/.test(n), `${label}: pending panel contains a digit`);
        check(await page.locator(`${tool.net} details.tool-pending`).count() === 1, `${label}: missing rules not in <details>`);
      }
      const body = await page.evaluate(() => document.body.innerText);
      check(!/(netto|nets?|belasting|impôt|bijdrage|cotisation)\w*[ \t]*:?[ \t]*€?[ \t]*\d/i.test(body) && !/\d[\d.,   ]*€[ \t]*(netto|nets?\b)/i.test(body), `${label}: page text pairs a figure with a net/tax word`);
      check(!/In ontwikkeling|En développement|Berekening geblokkeerd|Calcul bloqué/.test(body.replace(/\(in ontwikkeling\)|\(en développement\)/g, '')), `${label}: development label visible`);
      if (tool.name === 'scenarios') check(await page.locator('#sc-table tbody tr').count() === 3, `${label}: expected base + 2 scenarios`);
      if (tool.name === 'widget') check(/cadre\.html|kader\.html/.test(await page.inputValue('#wg-code')) && /theme=dark/.test(await page.inputValue('#wg-code')), `${label}: widget code not updated`);
      await page.screenshot({ path: path.join(SHOTS, `${tool.name}-${lang}-${viewport.tag}.png`), fullPage: true });
      await page.close();
    }
    // Invalid input shows field errors and still no fiscal figure.
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/nl/maandloon/`);
    await page.fill('[name=amount]', '3,500');
    await page.click('#ml-form button[type=submit]');
    check(await page.locator('#ml-errors').isVisible(), `maandloon invalid/${viewport.tag}: no error shown`);
    check(await page.locator('[name=amount][aria-invalid="true"]').count() === 1, `maandloon invalid/${viewport.tag}: field not marked`);
    await page.screenshot({ path: path.join(SHOTS, `maandloon-nl-${viewport.tag}-invalid.png`), fullPage: false });
    // Share link restores the state.
    await page.goto(`http://127.0.0.1:${PORT}/nl/jobaanbiedingen-vergelijken/#aMonthly=3000&bMonthly=3200&bPayments=14`);
    await page.waitForTimeout(300);
    check(/Aanbieding B/.test(await page.locator('#of-gross').innerText()), `offers share link/${viewport.tag}: state not restored`);
    await page.close();
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`tool smoke tests passed; screenshots in ${SHOTS}`);
