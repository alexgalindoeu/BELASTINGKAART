// Result panel renderer (web/js/resultaat.js): the pending state never shows a figure and
// matches the static no-JavaScript panel; a confirmed result (synthetic, test-only fixture)
// renders the result card, breakdown, explanation and scenarios.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const js = name => readFile(new URL('../web/js/' + name, import.meta.url), 'utf8');
const context = { window: {}, document: { querySelector: () => null }, Intl };
vm.runInNewContext(await js('tax-engine.js'), context);
vm.runInNewContext(await js('resultaat.js'), context);
const { BKResult, BKTaxEngine } = context.window;
const confirmed = JSON.parse(await readFile(new URL('./fixtures/result-confirmed.synthetic.json', import.meta.url), 'utf8'));
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const norm = html => html.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();

test('the engine result is blocked and renders the pending state without any digit', () => {
  const blocked = BKTaxEngine.calculate();
  assert.equal(blocked.status, 'blocked');
  for (const lang of ['nl', 'fr']) {
    const html = BKResult.html(blocked, lang);
    assert.doesNotMatch(text(html), /\d/, lang + ': a digit was rendered');
    assert.doesNotMatch(html, /€|%|chip warn/);
    assert.match(html, /<details class="result-rules"><summary>[^<]+<\/summary><ul class="result-list">/);
    assert.equal((html.match(/<li>/g) || []).length, blocked.missing.length);
    for (const key of blocked.missing) assert.ok(html.includes(BKResult.ruleLabel(key, lang)), `${lang}: ${key}`);
  }
});

test('every rule the engine reports as missing has an NL and an FR label', () => {
  for (const key of BKTaxEngine.calculate().missing) {
    assert.ok(BKResult.RULES[key], key);
    assert.ok(BKResult.RULES[key].nl && BKResult.RULES[key].fr, key);
  }
});

test('the static home panels equal what the renderer draws for the engine result', async () => {
  for (const lang of ['nl', 'fr']) {
    const page = await readFile(new URL(`../web/${lang}/index.html`, import.meta.url), 'utf8');
    const inner = page.match(/<div class="result" id="result" aria-live="polite">([\s\S]*?<\/details>)\s*<\/div>/)[1];
    assert.equal(norm(inner), norm(BKResult.html(BKTaxEngine.calculate(), lang)), lang);
  }
});

test('unknown rule keys collapse into one neutral label and the raw key is never shown', () => {
  const html = BKResult.html({ status: 'blocked', missing: ['some <new> rule', 'another rule'] }, 'nl');
  assert.doesNotMatch(html, /some|another|&lt;new/);
  assert.equal((html.match(/<li>/g) || []).length, 1);
});

test('anything that is not a complete AND confirmed result stays pending', () => {
  const variants = [
    null, undefined, {}, { status: 'partial' },
    { ...confirmed, confirmed: false },
    { ...confirmed, confirmed: 'true' },
    { ...confirmed, status: 'blocked' },
    { ...confirmed, headline: { label: 'x', amount: NaN } },
    { ...confirmed, breakdown: [{ label: 'x', amount: '12' }] }
  ];
  for (const v of variants) {
    assert.equal(BKResult.isConfirmed(v), false, JSON.stringify(v));
    assert.doesNotMatch(text(BKResult.html(v, 'fr')), /\d/, JSON.stringify(v));
  }
});

test('a confirmed (synthetic) result renders card, KPIs, bars, breakdown, explanation and scenarios', () => {
  assert.equal(BKResult.isConfirmed(confirmed), true);
  const nl = BKResult.html(confirmed, 'nl');
  assert.match(nl, /<p class="result-figure ok">€\s1\.234,50<\/p>/);
  assert.match(nl, /<dl class="kpis">/);
  assert.match(nl, /25,0\s?%/);
  assert.match(nl, /<div class="split-bar" role="img"/);
  assert.match(nl, /<i class="net" style="flex-grow:0\.6000">/);
  assert.match(nl, /<i class="net"><\/i>Deel &lt;C&gt;/, 'unknown tone falls back and labels are escaped');
  assert.equal((nl.match(/<tr/g) || []).length, confirmed.breakdown.length + confirmed.explanation.steps[0].rows.length);
  assert.match(nl, /<tr class="minus"><td>Voorbeeldregel 2<\/td><td class="code-cell"><\/td><td class="amount">−€\s765,50<\/td><\/tr>/);
  assert.match(nl, /<tr class="total">/);
  assert.match(nl, /<span class="code">ABC<\/span>/);
  assert.match(nl, /<details class="explain"><summary>Hoe is dit bedrag berekend\?<\/summary>/);
  assert.match(nl, /Bron: Voorbeeldbron/);
  assert.match(nl, /<div class="scenario-bar yours">/);
  assert.match(nl, /<details class="warnings">/);
  const fr = BKResult.html(confirmed, 'fr');
  assert.match(fr, /1\s234,50\s€/);
  assert.match(fr, /Comment ce montant a-t-il été calculé/);
});

test('render() sets the status and the ribbon colour on the panel', () => {
  const classes = new Set();
  const node = { dataset: {}, innerHTML: '', classList: { toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)) } };
  assert.equal(BKResult.render(node, confirmed, 'nl'), 'complete');
  assert.ok(classes.has('ok'));
  assert.equal(BKResult.render(node, BKTaxEngine.calculate(), 'nl'), 'pending');
  assert.equal(classes.size, 0);
  assert.doesNotMatch(text(node.innerHTML), /\d/);
});

test('the synthetic fixture is never shipped in web/', async () => {
  const { readdir } = await import('node:fs/promises');
  const files = await readdir(new URL('../web/', import.meta.url), { recursive: true });
  assert.ok(!files.some(f => /synthetic|result-confirmed/.test(f)));
});
