// Tool pages (maandloon, marginaal tarief, jobaanbiedingen, gemeenschappelijke aanslag, twee
// werkgevers, scenario's, widget): module logic, gross-only arithmetic, the pending fiscal result
// and NL/FR page parity.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const WEB = fileURLToPath(new URL('../web/', import.meta.url));
const ctx = { window: {} };
for (const f of ['importe.js', 'formulario.js', 'sueldo_mes.js', 'tax-engine.js', 'tool-kit.js', 'widget.js', 'maandloon.js',
  'marginaal.js', 'aanbiedingen.js', 'gemeenschappelijk.js', 'twee-werkgevers.js', 'scenario-tool.js', 'widget-tool.js'])
  vm.runInNewContext(await readFile(path.join(WEB, 'js', f), 'utf8'), ctx);
const W = ctx.window;
const K = W.BKToolKit;
const plain = x => JSON.parse(JSON.stringify(x));

const TOOLS = [
  ['nl/maandloon/', 'fr/salaire-mensuel/', 'ml'],
  ['nl/marginaal-tarief/', 'fr/taux-marginal/', 'mt'],
  ['nl/jobaanbiedingen-vergelijken/', 'fr/comparer-offres-emploi/', 'of'],
  ['nl/gemeenschappelijke-aanslag/', 'fr/imposition-commune/', 'ga'],
  ['nl/twee-werkgevers/', 'fr/deux-employeurs/', 'tw'],
  ['nl/scenarios/', 'fr/scenarios/', 'sc'],
  ['nl/widget/', 'fr/widget/', null]
];
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const all = (html, re) => Array.from(html.matchAll(re), m => m[1]);
const situation = { region: 'flanders', municipality: 'Leuven', familyStatus: 'single', children: '0', incomeYear: '2026', assessmentYear: '2027' };

// ---- amounts ---------------------------------------------------------------------------------
test('amounts typed the Belgian way are read without guessing ambiguous input', () => {
  for (const lang of ['nl', 'fr']) {
    assert.equal(K.parseAmount('42.000', lang), 42000);
    assert.equal(K.parseAmount('1.250.000', lang), 1250000);
    assert.equal(K.parseAmount('3.500,50', lang), 3500.5);
    assert.equal(K.parseAmount('3500,5', lang), 3500.5);
    assert.equal(K.parseAmount('3 500', lang), 3500);
    assert.equal(K.parseAmount('3 500,00 €', lang), 3500);
    assert.equal(K.parseAmount('', lang), null);
    assert.throws(() => K.parseAmount('3,500', lang), /Ambiguous/);
    assert.throws(() => K.parseAmount('42.00.0', lang), /Ambiguous/);
  }
  assert.deepEqual(plain(K.readAmount('abc', 'nl')), { ok: false, value: null, error: 'format' });
  assert.equal(K.readAmount('', 'nl').error, 'required');
  assert.equal(K.readAmount('0', 'nl').error, 'range');
  assert.equal(K.readAmount('0', 'nl', { allowZero: true }).ok, true);
  assert.equal(K.readAmount('', 'nl', { required: false }).value, 0);
  assert.equal(K.readAmount('200000', 'nl', { max: 100000 }).error, 'range');
});

test('the shared situation check reuses the BKForm schema', () => {
  assert.equal(K.validateSituation(situation).valid, true);
  assert.deepEqual(Array.from(K.validateSituation({ ...situation, municipality: ' ' }).errors), ['municipality']);
  assert.ok(K.validateSituation({ ...situation, assessmentYear: '2026' }).errors.includes('taxYears'));
  assert.ok(K.validateSituation({ ...situation, region: 'paris' }).errors.includes('region'));
  assert.ok(K.validateSituation({ ...situation, children: '-1' }).errors.includes('children'));
});

// ---- maandloon ---------------------------------------------------------------------------------
test('monthly pay splits gross annual pay into 12, 13 or 14 equal payments', () => {
  const M = W.BKMonthlyPay;
  const v = M.validate({ amount: '42.000', unit: 'year', payments: '14', hours: '38', parttime: '100' }, 'nl');
  assert.equal(v.valid, true);
  const s = M.schedule(v.value);
  assert.equal(s.kind, 'gross');
  assert.equal(s.annual, 42000);
  assert.equal(s.perPayment, 3000);
  assert.equal(s.extraPayments, 2);
  assert.equal(s.monthWithExtra, 6000);
  assert.equal(s.averageMonthly, 3500);
  assert.deepEqual(plain(s.comparison.map(c => c.perPayment)), [3500, 3230.77, 3000]);
  assert.equal(s.comparison[0].monthWithExtra, null);
  assert.equal(M.schedule(M.validate({ amount: '36000', unit: 'year', payments: '13', hours: '38', parttime: '100' }).value).perPayment, 2769.23);
});

test('monthly pay converts monthly and hourly gross and handles part-time work', () => {
  const M = W.BKMonthlyPay;
  const monthly = M.schedule(M.validate({ amount: '3000', unit: 'month', payments: '13', hours: '38', parttime: '100' }).value);
  assert.equal(monthly.annual, 39000);
  assert.equal(monthly.perPayment, 3000);
  const hourly = M.schedule(M.validate({ amount: '20', unit: 'hour', payments: '12', hours: '38', parttime: '100' }).value);
  assert.equal(hourly.annual, 39520);
  assert.equal(hourly.hourly, 20);
  const part = M.schedule(M.validate({ amount: '40000', unit: 'year', payments: '12', hours: '38', parttime: '80' }).value);
  assert.equal(part.fullTimeAnnual, 40000);
  assert.equal(part.annual, 32000);
  assert.equal(part.weeklyHours, 30.4);
  assert.equal(part.hourly, K.round2(32000 / (30.4 * 52)));
});

test('monthly pay rejects invalid input field by field', () => {
  const M = W.BKMonthlyPay, ok = { amount: '42000', unit: 'year', payments: '12', hours: '38', parttime: '100' };
  const errs = raw => Array.from(M.validate({ ...ok, ...raw }, 'fr').errors);
  assert.deepEqual(errs({}), []);
  assert.deepEqual(errs({ amount: '3,500' }), ['amount']);
  assert.deepEqual(errs({ amount: '' }), ['amount']);
  assert.deepEqual(errs({ payments: '15' }), ['payments']);
  assert.deepEqual(errs({ unit: 'week' }), ['unit']);
  assert.deepEqual(errs({ hours: '0' }), ['hours']);
  assert.deepEqual(errs({ parttime: '101' }), ['parttime']);
  assert.deepEqual(errs({ parttime: '50.5' }), ['parttime']);
  assert.deepEqual(errs({ amount: '9.000.000', unit: 'month', payments: '14' }), ['amount']);
});

test('monthly pay share links round-trip and ignore foreign keys', () => {
  const M = W.BKMonthlyPay;
  const hash = M.toHash({ amount: '42000', unit: 'month', payments: '13', hours: '38', parttime: '80' });
  assert.equal(hash, '#amount=42000&unit=month&payments=13&parttime=80');
  assert.deepEqual(plain(M.fromHash(hash)), { amount: '42000', unit: 'month', payments: '13', parttime: '80' });
  assert.deepEqual(plain(M.fromHash('#amount=<script>&unit=week&payments=99&x=1')), {});
});

// ---- offers ------------------------------------------------------------------------------------
test('two offers are compared in gross only, A minus B', () => {
  const O = W.BKOffers;
  const v = O.validate({ ...situation, aMonthly: '3.500', aPayments: '13', aBonus: '1000', bMonthly: '3700', bPayments: '12', bBonus: '', aCar: true }, 'nl');
  assert.equal(v.grossValid, true);
  assert.deepEqual(Array.from(v.errors), []);
  const c = O.compare(v.a, v.b);
  assert.equal(c.kind, 'gross');
  assert.equal(c.a.total, 46500);
  assert.equal(c.b.total, 44400);
  assert.equal(c.diff.total, 2100);
  assert.equal(c.diff.averageMonthly, 175);
  assert.equal(c.higher, 'a');
  assert.equal(v.a.benefits.Car, true);
  assert.equal(O.compare(v.b, v.a).higher, 'b');
  assert.equal(O.compare(v.a, v.a).higher, 'equal');
  for (const k of ['net', 'tax', 'contributions', 'withholding']) assert.ok(!(k in c.a), k);
});

test('the gross comparison does not wait for the situation, which is still validated', () => {
  const v = W.BKOffers.validate({ ...situation, municipality: '', aMonthly: '3000', aPayments: '12', bMonthly: 'x', bPayments: '14' }, 'fr');
  assert.equal(v.grossValid, false);
  assert.deepEqual(Array.from(v.errors), ['bMonthly', 'municipality']);
  const v2 = W.BKOffers.validate({ ...situation, municipality: '', aMonthly: '3000', aPayments: '12', bMonthly: '3100', bPayments: '14' }, 'fr');
  assert.equal(v2.grossValid, true);
  assert.deepEqual(Array.from(v2.errors), ['municipality']);
  const hash = W.BKOffers.toHash({ ...W.BKOffers.DEFAULTS, aMonthly: '3000', bMonthly: '3100', bPayments: '14', aMeal: true });
  assert.deepEqual(plain(W.BKOffers.fromHash(hash)), { aMonthly: '3000', bMonthly: '3100', bPayments: '14', aMeal: true });
});

// ---- marginal, joint, two employers -------------------------------------------------------------
test('marginal tool shows only the gross effect of a raise', () => {
  const T = W.BKMarginalTool;
  const v = T.validate({ ...situation, grossMonthly: '3500', paidMonths: '13', raise: '100' }, 'nl');
  assert.equal(v.grossValid, true);
  assert.deepEqual(plain(T.grossEffect(v.value)), { kind: 'gross', currentMonthly: 3500, nextMonthly: 3600, raiseMonthly: 100,
    currentAnnual: 45500, nextAnnual: 46800, raiseAnnual: 1300, paidMonths: 13 });
  assert.deepEqual(Array.from(T.validate({ ...situation, grossMonthly: '99950', paidMonths: '12', raise: '100' }).errors), ['raise']);
  assert.deepEqual(Array.from(T.validate({ ...situation, grossMonthly: '3500', paidMonths: '12', raise: '0' }).errors), ['raise']);
});

test('joint assessment adds up gross income of married or legally cohabiting partners', () => {
  const J = W.BKJointAssessment;
  const v = J.validate({ ...situation, familyStatus: 'married', grossA: '42.000', grossB: '0' }, 'nl');
  assert.deepEqual(Array.from(v.errors), []);
  assert.deepEqual(plain(J.household(v.value)), { kind: 'gross', grossA: 42000, grossB: 0, total: 42000 });
  assert.ok(J.validate({ ...situation, familyStatus: 'single', grossA: '1', grossB: '1' }).errors.includes('familyStatus'));
  assert.ok(J.validate({ ...situation, familyStatus: 'legal_cohabitant', grossA: '0', grossB: '0' }).errors.includes('grossA'));
});

test('two employers: gross is summed, typed withholding is never echoed', () => {
  const E = W.BKTwoEmployers;
  const v = E.validate({ ...situation, gross1: '18.000', months1: '8', withholding1: '2.400,00', gross2: '9000', months2: '4', withholding2: '' }, 'nl');
  assert.deepEqual(Array.from(v.errors), []);
  assert.equal(v.employers[0].withholdingProvided, true);
  assert.equal(v.employers[1].withholdingProvided, false);
  const g = E.grossTotal(v.employers);
  assert.equal(g.total, 27000);
  assert.equal(g.employers[0].perMonthInService, 2250);
  assert.ok(!JSON.stringify(g).includes('2400'), 'withholding is not part of the output');
  assert.deepEqual(Array.from(E.validate({ ...situation, gross1: '1000', months1: '13', gross2: '1000', months2: '1', withholding2: 'abc' }).errors), ['months1', 'withholding2']);
});

// ---- scenarios -----------------------------------------------------------------------------------
test('scenarios apply one change each and compare gross with the base', () => {
  const S = W.BKScenarioTool;
  const base = S.validateBase({ ...situation, grossMonthly: '3000', paidMonths: '12' }, 'nl');
  assert.equal(base.valid, true);
  const changes = [
    S.readChange({ change: 'raise', changeAmount: '200' }, 'nl'), S.readChange({ change: 'gross', changeAmount: '4.000' }, 'nl'),
    S.readChange({ change: 'payments', changePayments: '14' }), S.readChange({ change: 'move', changeRegion: 'brussels', changeMunicipality: 'Elsene' }),
    S.readChange({ change: 'family', changeFamily: 'married' }), S.readChange({ change: 'children', changeChildren: '2' })
  ];
  assert.ok(changes.every(c => c.valid));
  const cmp = S.compareGross(base.value, changes.map(c => c.change));
  assert.deepEqual(plain(cmp.rows.map(r => r.grossAnnual)), [36000, 38400, 48000, 42000, 36000, 36000, 36000]);
  assert.deepEqual(plain(cmp.rows.map(r => r.diffAnnual)), [0, 2400, 12000, 6000, 0, 0, 0]);
  assert.ok(cmp.rows.every(r => r.net === 'blocked'));
  assert.equal(cmp.rows[4].situation.region, 'brussels');
  assert.equal(cmp.rows[6].situation.children, 2);
  assert.equal(S.describe(changes[0].change, 'nl'), `Loonsverhoging van ${K.formatAmount(200, 'nl')} bruto per maand`);
  assert.match(S.describe(changes[3].change, 'fr'), /Région de Bruxelles-Capitale/);
  assert.deepEqual(Array.from(S.readChange({ change: 'move', changeRegion: 'x', changeMunicipality: '' }).errors), ['changeRegion', 'changeMunicipality']);
  assert.deepEqual(Array.from(S.readChange({ change: 'nope' }).errors), ['change']);
  assert.throws(() => S.apply(base.value, { type: 'raise', amount: 99000 }), /supported range/);
});

// ---- pending fiscal result ----------------------------------------------------------------------
test('the pending result panel lists the engine rules and never contains a digit', () => {
  for (const lang of ['nl', 'fr']) {
    const html = K.blockedHTML(lang, { extra: ['Extra'] });
    assert.doesNotMatch(html.replace(/<[^>]+>/g, ' '), /\d/, lang);
    assert.match(html, /<details class="tool-pending"><summary>/);
    assert.match(html, lang === 'nl' ? /Resultaat volgt zodra alle regels bevestigd zijn/ : /Le résultat s’affichera lorsque toutes les règles seront confirmées/);
    assert.doesNotMatch(html, /chip warn|geblokkeerd|bloqué|ontwikkeling|développement/i);
    assert.equal((html.match(/<li>/g) || []).length, W.BKTaxEngine.calculate().missing.length + 1);
  }
  assert.ok(K.missingLabels('nl').includes('Bedrijfsvoorheffing'));
  assert.ok(K.missingLabels('fr').includes('Additionnels communaux'));
});

test('tools stay pending even if the engine is missing, throws or claims a complete result', () => {
  assert.equal(K.engineStatus({ calculate: () => ({ status: 'complete', net: 1 }) }).blocked, true);
  assert.equal(K.engineStatus({ calculate: () => { throw new Error('x'); } }).engineStatus, 'unavailable');
  assert.equal(K.engineStatus(null).blocked, true);
  assert.equal(K.missingLabels('nl', []).length, Object.keys(K.MISSING).length);
  assert.deepEqual(Array.from(K.missingLabels('fr', ['something new'])), ['Autre règle encore à confirmer']);
});

test('the widget code points to the dedicated Belastingkaart frame', () => {
  assert.match(W.BKWidget.frameCode({ language: 'nl' }), /src="https:\/\/belastingkaart\.be\/nl\/widget\/kader\.html"/);
  assert.match(W.BKWidget.frameCode({ language: 'fr', theme: 'dark' }), /fr\/widget\/cadre\.html\?theme=dark/);
  assert.match(W.BKWidget.frameCode({ language: 'fr' }), /<a href="https:\/\/belastingkaart\.be\/fr\/">Belastingkaart<\/a>/);
  assert.throws(() => W.BKWidget.frameCode({ language: 'en' }), /Unsupported/);
  assert.equal(W.BKWidgetTool.previewSrc({ language: 'fr', theme: 'light' }), '../../fr/widget/cadre.html?theme=light');
  assert.equal(W.BKWidgetTool.themeFromSearch('?theme=dark'), 'dark');
  assert.equal(W.BKWidgetTool.themeFromSearch('?theme=evil'), 'auto');
});

// ---- pages ---------------------------------------------------------------------------------------
test('NL/FR tool pages are equivalent: fields, options, ids, scripts and structure', async () => {
  const shape = html => ({
    fields: all(html, /name="([^"]+)"/g).join(','), options: all(html, /<option value="([^"]+)"/g).join(','),
    ids: all(html, /\sid="([^"]+)"/g).join(','), scripts: all(html, /<script defer src="([^"]+)"/g).join(','),
    h2: (html.match(/<h2[\s>]/g) || []).length, sections: (html.match(/<section[\s>]/g) || []).length,
    details: (html.match(/<details/g) || []).length, links: (html.match(/<a /g) || []).length
  });
  for (const [nl, fr] of TOOLS) assert.deepEqual(shape(await read(fr)), shape(await read(nl)), `${nl} vs ${fr}`);
});

test('tool pages use the shared shell, canonical, hreflang pairs and a working language switch', async () => {
  for (const [nl, fr] of TOOLS) for (const [route, other, lang] of [[nl, fr, 'fr'], [fr, nl, 'nl']]) {
    const html = await read(route);
    assert.ok(html.includes(`rel="canonical" href="https://belastingkaart.be/${route}"`), route);
    assert.ok(html.includes(`hreflang="nl-BE" href="https://belastingkaart.be/${nl}"`), route);
    assert.ok(html.includes(`hreflang="fr-BE" href="https://belastingkaart.be/${fr}"`), route);
    assert.ok(html.includes('hreflang="x-default"'), route);
    const sw = html.match(/<a class="lang-switch" href="([^"]+)" hreflang="([^"]+)" lang="([^"]+)"/);
    assert.equal(path.resolve(WEB, route, sw[1]), path.resolve(WEB, other), route);
    assert.equal(sw[3], lang);
    for (const re of [/class="skip-link" href="#content"/, /id="theme-toggle"/, /<header class="appbar">/, /<footer class="footer">/,
      /css\/site\.css/, /css\/tools\.css/, /js\/tax-engine\.js/, /js\/tool-kit\.js/, /apple-touch-icon/, /manifest\.webmanifest/, /data-lang="(nl|fr)"/])
      assert.match(html, re, route + ' ' + re);
  }
});

test('local links, scripts and stylesheets of tool pages and widget frames resolve', async () => {
  const files = [...TOOLS.flatMap(([nl, fr]) => [nl + 'index.html', fr + 'index.html']), 'nl/widget/kader.html', 'fr/widget/cadre.html'];
  for (const file of files) {
    const html = await readFile(path.join(WEB, file), 'utf8');
    for (const ref of all(html, /(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      let target = path.resolve(path.dirname(path.join(WEB, file)), ref.split(/[#?]/)[0]);
      if (ref.split(/[#?]/)[0].endsWith('/')) target = path.join(target, 'index.html');
      await access(target).catch(() => assert.fail(`${file}: ${ref} does not resolve`));
    }
  }
});

test('the static pending panel of every tool shows no fiscal amount, and pages have no development labels', async () => {
  for (const [nl, fr, px] of TOOLS) for (const route of [nl, fr]) {
    const html = await read(route);
    assert.doesNotMatch(html, /In ontwikkeling|En développement|chip warn|Berekening geblokkeerd|Calcul bloqué/, route);
    if (!px) continue;
    const panel = html.match(new RegExp(`<div class="result" id="${px}-net"[\\s\\S]*?</details>\\s*</div>`))?.[0];
    assert.ok(panel, route + ' pending panel');
    assert.match(panel, /aria-live="polite"/);
    assert.doesNotMatch(panel.replace(/<[^>]+>/g, ' '), /\d/, route + ' pending panel contains a digit');
    const gross = html.match(new RegExp(`<div class="result is-gross" id="${px}-gross"[\\s\\S]*?</div>\\s*</div>`))?.[0] ?? '';
    assert.doesNotMatch(gross.replace(/<[^>]+>/g, ' '), /€|EUR/, route + ' gross panel starts empty');
  }
  for (const file of ['nl/widget/kader.html', 'fr/widget/cadre.html']) {
    const html = await readFile(path.join(WEB, file), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex">/);
    const panel = html.match(/<div class="result" id="wf-net"[\s\S]*?<\/details>\s*<\/div>/)[0];
    assert.doesNotMatch(panel.replace(/<[^>]+>/g, ' '), /\d/, file);
  }
});

test('tool pages never mention net, tax or contribution amounts in their static text', async () => {
  // Gross examples are allowed (and labelled bruto/brut); a figure next to netto/net/belasting is not.
  for (const [nl, fr] of TOOLS) for (const route of [nl, fr]) {
    const text = (await read(route)).replace(/<(script|textarea|pre)[\s\S]*?<\/(script|textarea|pre)>/g, ' ').replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' ');
    assert.doesNotMatch(text, /\d[\d.,]*\s?(€|EUR)\s*(netto|nets?\b|belasting|impôt|bijdrage|cotisation)/i, route);
    assert.doesNotMatch(text, /(netto|nets?|belasting|impôt|bijdrage|cotisation)\w*\s*:?\s*(€|EUR)?\s*\d/i, route);
    assert.doesNotMatch(text, /\d\s?%/, route + ' shows a percentage');
    assert.doesNotMatch(text, /IRPF|comunidad|Hacienda|España|Mapafiscal|pagas|sueldo/i, route);
  }
});

test('every table wrapper is a focusable, named scroll region', async () => {
  for (const [nl, fr] of TOOLS) for (const route of [nl, fr]) {
    const html = await read(route);
    for (const tag of html.match(/<div class="table-wrap"[^>]*>/g) || []) {
      assert.match(tag, /tabindex="0"/, route);
      assert.match(tag, /role="region"/, route);
      assert.match(tag, /aria-label="[^"]+"/, route);
    }
  }
});
