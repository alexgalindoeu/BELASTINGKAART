// Renders the social sharing images web/og-nl.png and web/og-fr.png (1200×630) from
// tools/brand/og.html with Playwright (Chromium). Not run in CI: the PNGs are versioned.
// Re-run after changing the logo, the colours or the template:
//   node tools/generate_og_image.mjs
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
function loadPlaywright() {
  try { return require('playwright'); } catch { /* fall back to a global install */ }
  const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim();
  return require(path.join(globalRoot, 'playwright'));
}
const { chromium } = loadPlaywright();
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const template = pathToFileURL(path.join(ROOT, 'tools/brand/og.html')).href;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const lang of ['nl', 'fr']) {
  await page.goto(`${template}?lang=${lang}`);
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(ROOT, 'web', `og-${lang}.png`);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`web/og-${lang}.png`);
}
await browser.close();
