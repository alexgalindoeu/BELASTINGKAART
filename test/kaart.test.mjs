// The map: data file (web/data/kaart_be.json), the component (web/js/kaart.js) and its pages.
// The tax-coloured state is tested only with SYNTHETIC rates built here; nothing synthetic ships in web/.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import { WEB, walk } from '../tools/lib/pages.mjs';
import { validateKaart, PATH_RE, EXPECTED, REGIONS, KAART_PAGES } from '../tools/lib/kaart.mjs';
import { checkKaart } from '../tools/check_kaart.mjs';

const kaart = JSON.parse(await readFile(path.join(WEB, 'data/kaart_be.json'), 'utf8'));
const params = JSON.parse(await readFile(path.join(WEB, 'data/parameters.json'), 'utf8'));
const ctx = { console };
vm.runInNewContext(await readFile(path.join(WEB, 'js/kaart.js'), 'utf8'), ctx);
const K = ctx.BKKaart;
const page = async lang => readFile(path.join(WEB, KAART_PAGES[lang], 'index.html'), 'utf8');
const DIGIT = /[0-9]|%/;

// Small synthetic map (three squares) and synthetic rates. Test-only.
const synthetic = {
  viewBox: [0, 0, 30, 10], coverage: ['VLG'], regions: REGIONS,
  provinces: [{ nis: '10000', region: 'VLG', name: { nl: 'P', fr: 'P' } }],
  municipalities: ['11001', '11002', '11003'].map((nis, i) => ({ nis, name: { nl: 'Gem' + 'ABC'[i], fr: 'Com' + 'ABC'[i] }, region: 'VLG',
    province: '10000', anchor: [5 + 10 * i, 5], d: `M${10 * i} 0l10 0 0 10-10 0z` })),
  borders: { municipal: 'M10 0l0 10', provinces: 'M0 0l0 1', region: 'M0 0l30 0 0 10-30 0z', national: '' }
};
const confirmed = (km, f = (m, i) => 0.06 + i / 1000) => Object.fromEntries(km.municipalities.map((m, i) => [m.nis, { status: 'confirmed', rate: f(m, i) }]));

test('kaart_be.json passes the schema and the staleness check', async () => {
  assert.deepEqual(validateKaart(kaart), []);
  const { errors } = await checkKaart({ rebuild: false });
  assert.deepEqual(errors, []);
});

test('record count equals the official count stated by the source', () => {
  assert.equal(kaart.count, kaart.municipalities.length);
  assert.equal(kaart.count, kaart.source.expectedCount);
  for (const r of kaart.coverage) assert.equal(kaart.municipalities.filter(m => m.region === r).length, EXPECTED[r], r);
  assert.equal(new Set(kaart.municipalities.map(m => m.nis)).size, kaart.count);
});

test('source record: official host, attribution in both languages, CRS, retrieval date and checksum', () => {
  const s = kaart.source;
  assert.match(s.url, /^https:\/\/geo\.api\.vlaanderen\.be\//);
  assert.ok(s.attribution.nl && s.attribution.fr);
  assert.equal(s.crs, 'EPSG:3812');
  assert.match(s.retrieved, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(s.sha256, /^[0-9a-f]{64}$/);
});

test('every municipality has a NIS code, NL and FR names, a region and a province', () => {
  const provs = new Set(kaart.provinces.map(p => p.nis));
  for (const m of kaart.municipalities) {
    assert.match(m.nis, /^\d{5}$/);
    assert.ok(m.name.nl.trim() && m.name.fr.trim(), m.nis);
    assert.ok(REGIONS[m.region] && kaart.coverage.includes(m.region), m.nis);
    assert.ok(provs.has(m.province), m.nis);
  }
  for (const r of Object.values(kaart.regions)) assert.ok(r.name.nl && r.name.fr);
});

test('paths are valid SVG path data inside the viewBox', () => {
  const [, , W, H] = kaart.viewBox;
  for (const m of kaart.municipalities) {
    assert.match(m.d, PATH_RE, m.nis);
    for (const sub of m.d.match(/M[^M]+/g)) {
      const [x, y] = sub.slice(1).match(/-?\d+(\.\d+)?/g).slice(0, 2).map(Number);
      assert.ok(x >= 0 && x <= W && y >= 0 && y <= H, `${m.nis} starts outside the viewBox`);
      assert.ok(sub.endsWith('z'), `${m.nis} ring is closed`);
    }
  }
  for (const k of ['municipal', 'provinces', 'region']) assert.match(kaart.borders[k], PATH_RE, k);
});

test('the real parameters keep the map neutral: no rate is confirmed today', () => {
  const state = K.choropleth(kaart, K.rateTable(params));
  assert.equal(state.active, false);
});

test('neutral state: legend, tooltips, labels and announcements show no digits or percentages', () => {
  const neutral = K.choropleth(kaart, null);
  for (const lang of ['nl', 'fr']) {
    const legend = K.legendMarkup(kaart, neutral, lang);
    assert.doesNotMatch(legend.replace(/<[^>]+>/g, ''), DIGIT, lang + ' legend');
    assert.match(legend, /--m-vlg/);
    assert.ok(legend.includes(kaart.regions.VLG.name[lang]));
    const yours = kaart.municipalities[10].nis;
    const svg = K.svgMarkup(kaart, neutral, lang, yours);
    for (const label of svg.match(/aria-label="[^"]*"/g)) assert.doesNotMatch(label, DIGIT, label);
    for (const text of svg.match(/<text[^>]*>[^<]*<\/text>/g)) assert.doesNotMatch(text.replace(/<[^>]+>/g, ''), DIGIT);
    assert.doesNotMatch(svg, /var\(--m-[gr]\d\)|var\(--m-0\)/, 'no rate ramp');
    for (const m of kaart.municipalities.slice(0, 40)) assert.doesNotMatch(K.tipMarkup(kaart, m, neutral, lang, yours).replace(/<[^>]+>/g, ''), DIGIT);
    assert.doesNotMatch(K.T[lang].chosen('X', 'Y'), DIGIT);
  }
});

test('neutral state on the pages: the map block shows no digits or percentages', async () => {
  for (const lang of ['nl', 'fr']) {
    const block = (await page(lang)).match(/<div class="cover-map"[\s\S]*?data-kaart-live><\/p>\s*<\/div>/)[0];
    assert.doesNotMatch(block.replace(/<[^>]+>/g, ' ').replace(/data-[a-z-]+="[^"]*"/g, ''), DIGIT, lang);
  }
});

test('tax colouring turns on only when every value is confirmed (synthetic fixture)', () => {
  for (const km of [synthetic, kaart]) {
    const all = confirmed(km);
    const on = K.choropleth(km, all);
    assert.equal(on.active, true);
    const legend = K.legendMarkup(km, on, 'nl');
    assert.match(legend, /Lager tarief/);
    assert.match(K.svgMarkup(km, on, 'nl', null), /var\(--m-(g|r)\d\)|var\(--m-0\)/);
    // a single pending, provisional, missing or non-numeric value keeps the whole map neutral
    const nis = km.municipalities[1].nis;
    for (const bad of [{ status: 'pending' }, { status: 'provisional', rate: 0.07 }, undefined, { status: 'confirmed', rate: 'x' }]) {
      const table = { ...all, [nis]: bad };
      if (bad === undefined) delete table[nis];
      const off = K.choropleth(km, table);
      assert.equal(off.active, false, JSON.stringify(bad));
      assert.doesNotMatch(K.svgMarkup(km, off, 'nl', null), /var\(--m-(g|r)\d\)/);
    }
  }
  assert.equal(K.choropleth(synthetic, null).active, false);
});

test('tax colouring compares with your municipality, like the sister map', () => {
  const rates = confirmed(synthetic, (m, i) => [0.05, 0.07, 0.09][i]);
  const on = K.choropleth(synthetic, rates);
  const svg = K.svgMarkup(synthetic, on, 'nl', '11002');
  assert.match(svg, /data-nis="11001"[^>]*fill="var\(--m-g3\)"/);
  assert.match(svg, /data-nis="11003"[^>]*fill="var\(--m-r3\)"/);
  assert.match(svg, /data-nis="11002"[^>]*fill="var\(--m-tu\)"/);
  assert.ok(svg.lastIndexOf('data-nis="11002"') > svg.lastIndexOf('class="b-reg"'), 'yours is drawn last');
  assert.match(K.tipMarkup(synthetic, synthetic.municipalities[0], on, 'nl', '11002'), /5,0%.*2 procentpunt lager dan in GemB/s);
  assert.match(K.tipMarkup(synthetic, synthetic.municipalities[2], on, 'fr', '11002'), /9,0 %.*2 point de pourcentage de plus qu’à ComB/s);
});

test('the rate path read by the map matches the municipal rule (status + rate per NIS code)', () => {
  assert.deepEqual(Array.from(K.RATE_PATH), ['municipal_surcharge', 'municipalities']);
  const fake = { municipal_surcharge: { municipalities: confirmed(synthetic) } };
  assert.equal(K.choropleth(synthetic, K.rateTable(fake)).active, true);
});

test('keyboard navigation and search find municipalities', () => {
  const gent = K.search(kaart, 'gent', 'nl');
  assert.equal(gent.name.nl, 'Gent');
  assert.equal(K.search(kaart, 'GAND ', 'fr').nis, gent.nis);
  assert.equal(K.search(kaart, 'gent', 'fr').nis, gent.nis);
  assert.equal(gent.name.fr, 'Gand');
  assert.equal(K.search(kaart, 'zzzz', 'nl'), null);
  for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) {
    const n = K.neighbour(kaart, gent, key);
    assert.ok(n && n.nis !== gent.nis, key);
  }
  const s = synthetic.municipalities;
  assert.equal(K.neighbour(synthetic, s[0], 'ArrowRight').nis, '11002');
  assert.equal(K.neighbour(synthetic, s[0], 'ArrowLeft'), null);
});

test('NL/FR map pages: same municipalities, names in the page language only, same blocks', async () => {
  const nl = await page('nl'), fr = await page('fr');
  const nis = html => Array.from(html.matchAll(/<button type="button" data-nis="(\d{5})"/g), m => m[1]).sort();
  assert.deepEqual(nis(nl), nis(fr));
  assert.equal(nis(nl).length, kaart.count);
  for (const [html, lang] of [[nl, 'nl'], [fr, 'fr']]) {
    for (const p of kaart.provinces) assert.ok(html.includes(`>${p.name[lang]} <span`), `${lang} ${p.name[lang]}`);
    for (const cls of ['cover-map', 'card-title', 'map-wrap', 'kaart-svg', 'kaart-tip', 'legend', 'note', 'kaart-lijst'])
      assert.ok(html.includes(`class="${cls}`), `${lang} ${cls}`);
    assert.match(html, /<script defer src="\.\.\/\.\.\/js\/kaart\.js"><\/script>/);
    assert.match(html, /<link rel="stylesheet" href="\.\.\/\.\.\/css\/kaart\.css">/);
  }
  assert.match(nl, /Kaart gemeentebelasting/);
  assert.match(fr, /Carte taxe communale/);
  assert.doesNotMatch(nl, /Province|Carte|Votre commune/);
  assert.doesNotMatch(fr, /Provincie|Jouw gemeente|Zoek je/);
});

test('no synthetic fixture or test data ships in web/', async () => {
  for (const file of await walk(WEB)) {
    if (!/\.(html|js|json)$/.test(file)) continue;
    assert.doesNotMatch(await readFile(file, 'utf8'), /synthetic|"GemA"|"ComA"/i, file);
  }
});
