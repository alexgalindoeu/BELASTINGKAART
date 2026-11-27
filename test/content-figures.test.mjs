// Audit P2-16: every official figure on the self-employed, pension-savings and housing pages
// must come from a confirmed parameter in params/2026/*.yaml (via web/data/parameters.json),
// never from a literal in the generators. The pages are rendered with BK_MARK_FIGURES=1, so
// each figure produced from a parameter is wrapped in ⟦…⟧; any figure left outside the marks
// was hard-coded and fails the test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

process.env.BK_MARK_FIGURES = '1';
const F = await import('../tools/lib/figures.mjs');
const { allSectionPages } = await import('../tools/build_zelfstandigen.mjs');
const { pages: pensionPages } = await import('../tools/build_pensioensparen.mjs');
const { pages: housingPages } = await import('../tools/build_wonen.mjs');
const fx = JSON.parse(await readFile(new URL('./fixtures/content_figures.json', import.meta.url), 'utf8'));
const data = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));

const SECTIONS = {
  zelfstandigen: Object.fromEntries(allSectionPages().map(p => [p.route, p.html])),
  pensioensparen: pensionPages,
  wonen: housingPages
};

function unbacked(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/⟦[^⟧]*⟧/g, '#');
  return [...text.matchAll(F.FIGURE_RE)].map(m => m[0]);
}

for (const [section, pages] of Object.entries(SECTIONS)) {
  test(`${section}: every figure on the pages comes from a parameter`, () => {
    assert.ok(Object.keys(pages).length >= 2, 'pages rendered');
    for (const [route, html] of Object.entries(pages)) {
      assert.deepEqual(unbacked(html), [], `${route}: figures not backed by a parameter`);
      assert.doesNotMatch(html, /\{\{/, `${route}: unresolved token`);
    }
    assert.ok(Object.values(pages).some(h => h.includes('\u27e6')), `${section}: expected figures from params`);
  });
}

test('every figure used on the pages is confirmed (announcements only via announced:)', () => {
  assert.ok(F.usedFigures.size > 20);
  for (const [path, status] of F.usedFigures) {
    const { param } = F.resolveFigure(path, data);
    if (status === 'confirmed') continue;
    assert.equal(param.announced, true, `${path} is ${status} and not an announcement`);
    assert.equal(param.status, 'provisional', path);
  }
  for (const path of F.usedFigures.keys())
    assert.ok(['zelfstandigen', 'pensioensparen', 'wonen'].includes(path.split('.')[0]), path);
});

test('figures: formatting and refusals match the shared R/JS fixture', () => {
  for (const c of fx.cases) assert.equal(F.figure(c.path, c.fmt), c.expected, c.path);
  for (const c of fx.announced) assert.equal(F.figure(c.path, c.fmt, { announced: true }), c.expected, c.path);
  for (const c of fx.refused) assert.throws(() => F.figure(c.path, c.fmt), undefined, c.path);
  assert.throws(() => F.figure('zelfstandigen.spouse_income_limit', 'eur', { announced: true }), /announced/);
  assert.throws(() => F.fillFigures('{{wonen.supplementary_duties_surcharge|pct}} %'), /only confirmed/);
});

test('Belgian number formatting', () => {
  assert.equal(F.formatBE(1234567.891, 2), '1.234.567,89');
  assert.equal(F.formatFigure(3000, 'eur'), '3.000');
  assert.equal(F.formatFigure(890.42, 'eur'), '890,42');
  assert.equal(F.formatFigure(0.1416, 'pct'), '14,16');
  assert.equal(F.formatFigure(0.07, 'pct'), '7');
  assert.throws(() => F.formatFigure(1, 'xyz'), /Unknown/);
});

test('the content parameters carry official provenance and the expected statuses', () => {
  const status = id => F.resolveFigure(id, data).param.status;
  assert.equal(status('zelfstandigen.contributions_2026'), 'confirmed');
  assert.equal(data.zelfstandigen.contributions_2026.source_url, 'https://www.rsvz.be/sites/rsvz/files/2024-01/folder_sociale_bijdragen.pdf');
  for (const id of ['zelfstandigen.spouse_income_limit', 'zelfstandigen.affiliation_fine', 'zelfstandigen.side_occupation_reduced_band',
    'wonen.supplementary_duties_surcharge', 'wonen.announced_reduced_rate_2027']) assert.equal(status(id), 'provisional', id);
  for (const id of ['pensioensparen.ceilings', 'pensioensparen.reduction_rates', 'pensioensparen.long_term_savings_ceiling',
    'pensioensparen.long_term_savings_tax', 'pensioensparen.separate_taxation_rates', 'pensioensparen.indexation_base_amounts',
    'wonen.reduced_rate_only_own_home', 'wonen.general_rate', 'wonen.cadastral_income_indexation']) assert.equal(status(id), 'confirmed', id);
  assert.equal(data.zelfstandigen.contributions_2026.value.revaluation_coefficient, 1.07236269, 'JSON export keeps full precision');
});
