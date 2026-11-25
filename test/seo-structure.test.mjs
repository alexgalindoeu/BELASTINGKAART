// Site structure and SEO: auto-discovered NL/FR pairs, generated <head> metadata (Open Graph,
// Twitter, JSON-LD), titles and descriptions per language, social images, the generated
// validation page, the cookie statement versus the code, and the one-language-per-visitor
// logic in web/js/taal.js, the root page and the 404 page.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { WEB, SITE, walk, discoverPages, pairPages, parsePage } from '../tools/lib/pages.mjs';
import { applyHead, readMeta, BRAND_SUFFIX } from '../tools/lib/head.mjs';
import { INFO_PAGES } from '../tools/lib/shell.mjs';
import { validationPages, collectParameters } from '../tools/generate_validation_page.mjs';

const PAGES = (await discoverPages()).filter(p => !p.noindex);
const PAIRS = pairPages(PAGES);
const byRoute = new Map(PAGES.map(p => [p.route, p]));
const text = html => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
const AMOUNT = /\d[\d.,\s]*\s?(€|EUR\b|%)|€\s?\d/;

// ---- auto-discovery -------------------------------------------------------------------
const fake = (route, nl, fr, extra = '') => parsePage(`<html lang="${route.slice(0, 2)}"><head>${extra}
<link rel="canonical" href="${SITE}/${route}">
${nl ? `<link rel="alternate" hreflang="nl-BE" href="${SITE}/${nl}">` : ''}
${fr ? `<link rel="alternate" hreflang="fr-BE" href="${SITE}/${fr}">` : ''}
<link rel="alternate" hreflang="x-default" href="${SITE}/nl/"></head></html>`, route);

test('pairing works from the pages own hreflang tags and fails loudly on missing or disagreeing pairs', () => {
  assert.deepEqual(pairPages([fake('nl/a/', 'nl/a/', 'fr/b/'), fake('fr/b/', 'nl/a/', 'fr/b/'), fake('nl/', 'nl/', 'fr/'), fake('fr/', 'nl/', 'fr/')]),
    [['nl/', 'fr/'], ['nl/a/', 'fr/b/']]);
  assert.throws(() => pairPages([fake('nl/a/', 'nl/a/', null)]), /missing hreflang="fr-BE"/);
  assert.throws(() => pairPages([fake('nl/a/', 'nl/a/', 'fr/b/')]), /fr\/b\/ does not exist/);
  assert.throws(() => pairPages([fake('nl/a/', 'nl/a/', 'fr/b/'), fake('fr/b/', 'nl/c/', 'fr/b/')]), /pair disagrees/);
  assert.throws(() => pairPages([fake('nl/a/', 'nl/x/', 'fr/b/'), fake('fr/b/', 'nl/a/', 'fr/b/')]), /must point to itself/);
  // noindex pages are skipped entirely
  assert.deepEqual(pairPages([fake('nl/draft/', null, null, '<meta name="robots" content="noindex">')]), []);
});

test('every indexable NL/FR page under web/ is in a pair', () => {
  assert.equal(PAIRS.length * 2, PAGES.length);
  for (const [key, [nl, fr]] of Object.entries(INFO_PAGES))
    assert.ok(PAIRS.some(p => p[0] === nl && p[1] === fr), key);
});

// ---- generated head: taal.js, Open Graph, Twitter, JSON-LD --------------------------------
test('every page carries an up-to-date generated head block (npm run build:head)', () => {
  for (const page of PAGES) assert.equal(applyHead(page.html, page.route), page.html, `${page.route}: run npm run build:head`);
});

test('Open Graph and Twitter metadata are complete and in the page language', () => {
  for (const page of PAGES) {
    const { html, route, lang } = page;
    const meta = readMeta(html);
    const prop = p => html.match(new RegExp(`<meta property="${p}" content="([^"]*)">`))?.[1];
    const name = p => html.match(new RegExp(`<meta name="${p}" content="([^"]*)">`))?.[1];
    assert.equal(prop('og:url'), `${SITE}/${route}`, route);
    assert.equal(prop('og:locale'), lang === 'nl' ? 'nl_BE' : 'fr_BE', route);
    assert.equal(prop('og:locale:alternate'), lang === 'nl' ? 'fr_BE' : 'nl_BE', route);
    assert.equal(prop('og:image'), `${SITE}/og-${lang}.png`, route);
    assert.equal(prop('og:image:width'), '1200');
    assert.equal(prop('og:image:height'), '630');
    for (const p of ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:image:alt']) assert.ok(prop(p), `${route} ${p}`);
    for (const p of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) assert.ok(name(p), `${route} ${p}`);
    assert.ok(html.includes(`content="${meta.title.replace(/&/g, '&amp;')}"`), route + ' og:title = <title>');
    assert.match(html, /<script src="(\.\.\/)+js\/taal\.js"><\/script>/, route);
    assert.ok(html.indexOf('js/taal.js') > html.lastIndexOf('<link rel="alternate" hreflang='), route + ' taal.js after the hreflang links');
  }
});

test('JSON-LD parses and describes WebSite, Organization, WebPage and breadcrumbs without invented details', () => {
  for (const { html, route, lang } of PAGES) {
    const blocks = Array.from(html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g), m => JSON.parse(m[1]));
    assert.equal(blocks.length, 1, route);
    const graph = blocks[0]['@graph'];
    const of = type => graph.filter(n => n['@type'] === type);
    assert.equal(of('Organization').length, 1, route);
    assert.equal(of('WebSite').length, 1, route);
    const org = of('Organization')[0];
    for (const k of ['email', 'address', 'telephone', 'vatID', 'founder', 'legalName', 'contactPoint', 'sameAs']) assert.ok(!(k in org), `${route}: Organization.${k} must not be invented`);
    const page = graph.find(n => /Page$/.test(n['@type']));
    assert.ok(page, route);
    assert.equal(page.url, `${SITE}/${route}`);
    assert.equal(page.inLanguage, lang === 'nl' ? 'nl-BE' : 'fr-BE');
    assert.ok(page.name && page.description, route);
    const crumbs = of('BreadcrumbList');
    if (route.split('/').length > 2) {
      assert.equal(crumbs.length, 1, route + ' BreadcrumbList');
      const items = crumbs[0].itemListElement;
      assert.equal(items[0].item, `${SITE}/${lang}/`);
      assert.equal(items.at(-1).item, `${SITE}/${route}`);
      items.forEach((it, i) => assert.equal(it.position, i + 1));
    }
  }
});

test('titles and descriptions: unique, different per language and within length limits', () => {
  const titles = new Map(), descriptions = new Map();
  for (const { html, route } of PAGES) {
    const { title, description } = readMeta(html);
    assert.ok(title.length >= 15 && title.length <= 60, `${route}: title length ${title.length} (${title})`);
    assert.ok(description.length >= 70 && description.length <= 160, `${route}: description length ${description.length}`);
    assert.ok(title.endsWith(BRAND_SUFFIX), `${route}: title ends with "${BRAND_SUFFIX}"`);
    assert.ok(!titles.has(title), `${route}: same title as ${titles.get(title)}`);
    assert.ok(!descriptions.has(description), `${route}: same description as ${descriptions.get(description)}`);
    titles.set(title, route); descriptions.set(description, route);
  }
  for (const [nl, fr] of PAIRS) {
    const a = readMeta(byRoute.get(nl).html), b = readMeta(byRoute.get(fr).html);
    assert.notEqual(a.title, b.title, nl);
    assert.notEqual(a.description, b.description, nl);
  }
});

test('metadata reads as a finished product: no under-construction wording', () => {
  const wip = /ontwikkeling|en développement|in development|under construction|binnenkort|bientôt/i;
  for (const { html, route } of PAGES) {
    const head = html.slice(0, html.indexOf('</head>'));
    const meta = Array.from(head.matchAll(/<(?:title>([^<]*)|meta (?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)" content="([^"]*)")/g), m => m[1] ?? m[2]).join(' | ');
    const ld = head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
    assert.doesNotMatch(meta, wip, route);
    assert.doesNotMatch(ld, wip, route);
  }
  for (const [nl, fr] of Object.values(INFO_PAGES)) for (const route of [nl, fr])
    assert.doesNotMatch(text(byRoute.get(route).html), wip, route);
});

test('the social images exist per language and are 1200×630 PNGs', async () => {
  for (const lang of ['nl', 'fr']) {
    const buf = await readFile(path.join(WEB, `og-${lang}.png`));
    assert.equal(buf.subarray(1, 4).toString(), 'PNG');
    assert.equal(`${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`, '1200x630', lang);
  }
});

test('robots.txt points to the sitemap and llms.txt describes the site honestly', async () => {
  const robots = await readFile(path.join(WEB, 'robots.txt'), 'utf8');
  assert.match(robots, /^Sitemap: https:\/\/belastingkaart\.be\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /Disallow: \/\s*$/m);
  const llms = await readFile(path.join(WEB, 'llms.txt'), 'utf8');
  assert.match(llms, /^# Belastingkaart/);
  for (const s of ['not an official government website', 'does not give tax advice', 'confirmed in an official Belgian government source', 'https://belastingkaart.be/nl/', 'https://belastingkaart.be/fr/']) assert.ok(llms.includes(s), s);
  assert.doesNotMatch(llms, /ontwikkeling|développement|in development/i);
  assert.doesNotMatch(llms, AMOUNT);
  for (const url of llms.match(/https:\/\/belastingkaart\.be\/[^)\s]*/g)) {
    const route = url.slice(SITE.length + 1);
    if (route === 'sitemap.xml') continue;
    assert.ok(byRoute.has(route), url);
  }
});

// ---- information and validation pages ----------------------------------------------------
test('information pages exist in both languages and show no amounts', async () => {
  for (const [nl, fr] of Object.values(INFO_PAGES)) for (const route of [nl, fr]) {
    const html = byRoute.get(route)?.html;
    assert.ok(html, route);
    assert.match(html, /<link rel="stylesheet" href="(\.\.\/)+css\/legal\.css">/, route);
    assert.doesNotMatch(text(html), AMOUNT, route);
  }
});

test('legal pages do not invent an owner identity, address, VAT number or e-mail', () => {
  for (const [nl, fr] of [INFO_PAGES.about, INFO_PAGES.legal]) for (const route of [nl, fr]) {
    const html = byRoute.get(route).html;
    assert.doesNotMatch(html, /mailto:|@[a-z0-9-]+\.[a-z]{2,}|\bBE ?0\d{3}[ .]?\d{3}[ .]?\d{3}\b|\b(BTW|TVA|KBO|BCE)\b/i, route);
    assert.match(text(html), route.startsWith('nl') ? /worden hier .*toegevoegd zodra ze beschikbaar zijn/ : /seront ajoutées ici .*dès qu’elles seront disponibles/, route);
  }
});

test('the validation pages are up to date with web/data/parameters.json (npm run build:validation)', async () => {
  const data = JSON.parse(await readFile(path.join(WEB, 'data/parameters.json'), 'utf8'));
  for (const [route, html] of Object.entries(validationPages(data)))
    assert.equal(await readFile(path.join(WEB, route, 'index.html'), 'utf8'), html, `${route}: run npm run build:validation`);
});

test('the validation pages list every parameter with status and source, and never a value', async () => {
  const data = JSON.parse(await readFile(path.join(WEB, 'data/parameters.json'), 'utf8'));
  const params = collectParameters(data);
  const numbers = [];
  (function grab(v) {
    if (typeof v === 'number') numbers.push(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(grab);
  })(params.map(p => p.p.value));
  const significant = [...new Set(numbers)].filter(n => n >= 100 && !(Number.isInteger(n) && n >= 2000 && n <= 2100));
  assert.ok(significant.length > 0, 'the fixture has amounts to look for');
  for (const route of INFO_PAGES.validation) {
    const html = byRoute.get(route).html;
    const body = text(html);
    assert.doesNotMatch(body, AMOUNT, route);
    for (const n of significant)
      for (const form of [String(n), n.toLocaleString('nl-BE'), n.toLocaleString('fr-BE'), n.toLocaleString('en-US')])
        assert.ok(!body.includes(form), `${route} shows the amount ${form}`);
    for (const { id, p } of params) {
      assert.ok(html.includes(`<code>${id}</code>`), `${route} lists ${id}`);
      assert.ok(html.includes(`href="${p.source_url}"`), `${route} links the source of ${id}`);
    }
    assert.doesNotMatch(html, /"notes"|EUR_/, route);
  }
});

// ---- cookies and storage versus the code -------------------------------------------------
test('the cookie statement matches the code: no cookies, only bk-theme and bk-lang in localStorage', async () => {
  const files = (await walk(WEB)).filter(f => /\.(js|html)$/.test(f));
  const keys = new Set();
  for (const file of files) {
    const src = await readFile(file, 'utf8');
    assert.doesNotMatch(src, /document\.cookie|sessionStorage|indexedDB|serviceWorker|caches\.open/, file);
    for (const m of src.matchAll(/\.setItem\(\s*([^,]+),/g)) keys.add(m[1].trim());
    if (!file.endsWith('analitica.js')) assert.doesNotMatch(src, /setConsent\s*\(/, `${file}: analytics consent must stay unused`);
  }
  // THEME_KEY (ui.js) = "bk-theme", KEY (taal.js) = "bk-lang", the unused analytics consent key.
  assert.deepEqual([...keys].sort(), ['"bk-analytics-consent"', 'KEY', 'THEME_KEY'].sort());
  assert.match(await readFile(path.join(WEB, 'js/ui.js'), 'utf8'), /const THEME_KEY = "bk-theme";/);
  assert.match(await readFile(path.join(WEB, 'js/taal.js'), 'utf8'), /var KEY = "bk-lang";/);
  for (const route of INFO_PAGES.cookies) {
    const html = byRoute.get(route).html;
    for (const s of ['<code>bk-theme</code>', '<code>bk-lang</code>', '<code>light</code>', '<code>dark</code>', '<code>nl</code>', '<code>fr</code>']) assert.ok(html.includes(s), `${route}: ${s}`);
  }
});

// ---- one language per visitor: web/js/taal.js ----------------------------------------------
const TAAL = await readFile(path.join(WEB, 'js/taal.js'), 'utf8');
function storage(initial = {}, broken = false) {
  const data = { ...initial };
  return {
    data,
    getItem: k => { if (broken) throw new Error('blocked'); return k in data ? data[k] : null; },
    setItem: (k, v) => { if (broken) throw new Error('blocked'); data[k] = String(v); },
    removeItem: k => { delete data[k]; }
  };
}
function fakeDoc(lang, links = {}) {
  const listeners = [];
  return {
    listeners,
    documentElement: { getAttribute: n => (n === 'lang' ? lang : null), setAttribute() {} },
    querySelector: sel => {
      const m = sel.match(/hreflang="([^"]+)"/);
      return m && links[m[1]] ? { getAttribute: () => links[m[1]] } : null;
    },
    addEventListener: (type, fn) => listeners.push([type, fn])
  };
}
function loadTaal({ store = storage(), languages = ['nl-BE'], doc, pathname = '/' } = {}) {
  const replaced = [];
  const window = { localStorage: store, navigator: { languages, language: languages[0] } };
  if (doc) { window.document = doc; window.location = { pathname, search: '', hash: '', replace: u => replaced.push(u) }; }
  vm.runInNewContext(TAAL, { window });
  return { BK: window.BKTaal, replaced, store };
}

test('taal.js: saved choice first, then the browser languages, then Dutch', () => {
  const { BK } = loadTaal();
  assert.equal(BK.pick('fr', ['nl-BE']), 'fr');
  assert.equal(BK.pick('nl', ['fr-BE']), 'nl');
  assert.equal(BK.pick(null, ['fr-BE', 'nl-BE']), 'fr');
  assert.equal(BK.pick(null, ['FR']), 'fr');
  assert.equal(BK.pick(null, ['en-GB', 'fr']), 'fr');
  assert.equal(BK.pick(null, ['de-DE', 'en']), 'nl');
  assert.equal(BK.pick(null, []), 'nl');
  assert.equal(BK.pick('es', ['es-ES']), 'nl');
  assert.equal(BK.pick('<script>', undefined), 'nl');
  assert.equal(loadTaal({ languages: ['fr-BE'] }).BK.detect(), 'fr');
  assert.equal(loadTaal({ store: storage({ 'bk-lang': 'fr' }), languages: ['nl-BE'] }).BK.detect(), 'fr');
  assert.equal(loadTaal({ store: storage({}, true), languages: ['fr-CA'] }).BK.detect(), 'fr', 'blocked storage');
});

test('taal.js: a click on the language switch or a footer language link stores the choice', () => {
  const store = storage();
  const doc = fakeDoc('nl');
  const { BK } = loadTaal({ store, doc, pathname: '/nl/' });
  const click = doc.listeners.find(([t]) => t === 'click')[1];
  const link = (cls, attrs) => ({ nodeType: 1, tagName: 'A', className: cls, hasAttribute: a => a in attrs, getAttribute: a => attrs[a] ?? null, parentNode: null });
  click({ target: link('lang-switch', { lang: 'fr', hreflang: 'fr-BE' }) });
  assert.equal(store.data['bk-lang'], 'fr');
  click({ target: link('', { lang: 'nl', hreflang: 'nl-BE' }) });
  assert.equal(store.data['bk-lang'], 'nl');
  click({ target: link('btn', { href: 'x' }) });
  assert.equal(store.data['bk-lang'], 'nl', 'ordinary links do not change the choice');
  const span = { nodeType: 1, tagName: 'SPAN', parentNode: link('lang-switch', { lang: 'fr' }) };
  click({ target: span });
  assert.equal(store.data['bk-lang'], 'fr', 'click inside the link');
  assert.equal(BK.save('es'), false);
  assert.equal(loadTaal({ store: storage({}, true) }).BK.save('fr'), false, 'blocked storage does not throw');
});

test('taal.js: a visitor who chose the other language is sent to the translation, also under a project path', () => {
  const links = { 'nl-BE': `${SITE}/nl/bronnen/`, 'fr-BE': `${SITE}/fr/sources/` };
  let r = loadTaal({ store: storage({ 'bk-lang': 'fr' }), doc: fakeDoc('nl', links), pathname: '/nl/bronnen/' });
  assert.deepEqual(r.replaced, ['/fr/sources/']);
  r = loadTaal({ store: storage({ 'bk-lang': 'fr' }), doc: fakeDoc('nl', links), pathname: '/BELASTINGKAART/nl/bronnen/index.html' });
  assert.deepEqual(r.replaced, ['/BELASTINGKAART/fr/sources/']);
  r = loadTaal({ store: storage({ 'bk-lang': 'nl' }), doc: fakeDoc('nl', links), pathname: '/nl/bronnen/' });
  assert.deepEqual(r.replaced, [], 'already in the chosen language');
  r = loadTaal({ store: storage(), languages: ['fr-BE'], doc: fakeDoc('nl', links), pathname: '/nl/bronnen/' });
  assert.deepEqual(r.replaced, [], 'without an explicit choice (crawlers, shared links) the page stays as requested');
  r = loadTaal({ store: storage({ 'bk-lang': 'fr' }), doc: fakeDoc('nl', {}), pathname: '/nl/bronnen/' });
  assert.deepEqual(r.replaced, [], 'no translation known');
  r = loadTaal({ store: storage({ 'bk-lang': 'fr' }), doc: fakeDoc('nl', links), pathname: '/elders/' });
  assert.deepEqual(r.replaced, [], 'URL does not match the page');
});

test('the root page and the 404 page use the same detection', async () => {
  const root = await readFile(path.join(WEB, 'index.html'), 'utf8');
  const inline = root.match(/<script>\n([\s\S]*?)<\/script>/)[1];
  for (const [lang, expected] of [['fr', 'fr/'], ['nl', 'nl/']]) {
    const replaced = [];
    vm.runInNewContext(inline, { window: { BKTaal: { detect: () => lang } }, location: { search: '', hash: '', replace: u => replaced.push(u) } });
    assert.deepEqual(replaced, [expected]);
  }
  const replaced = [];
  vm.runInNewContext(inline, { window: {}, location: { search: '', hash: '', replace: u => replaced.push(u) } });
  assert.deepEqual(replaced, ['nl/'], 'falls back to Dutch');

  const notFound = await readFile(path.join(WEB, '404.html'), 'utf8');
  assert.match(notFound, /<meta name="robots" content="noindex">/);
  assert.match(notFound, /<base href="\/">/);
  assert.match(notFound, /<script src="js\/taal\.js"><\/script>/);
  const scripts = Array.from(notFound.matchAll(/<script>([\s\S]*?)<\/script>/g), m => m[1]);
  const baseScript = scripts.find(s => s.includes('querySelector("base")'));
  const langScript = scripts.find(s => s.includes('BKTaal.detect'));
  const runBase = (hostname, pathname) => {
    let href = '/';
    vm.runInNewContext(baseScript, { location: { hostname, pathname }, document: { querySelector: () => ({ setAttribute: (_, v) => { href = v; } }) } });
    return href;
  };
  assert.equal(runBase('belastingkaart.be', '/belastingkaart/x'), '/');
  assert.equal(runBase('www.belastingkaart.be', '/nl/oud/'), '/');
  assert.equal(runBase('alexgalindoeu.github.io', '/BELASTINGKAART/nl/oud/'), '/BELASTINGKAART/');
  assert.equal(runBase('127.0.0.1', '/BELASTINGKAART/x'), '/BELASTINGKAART/');
  assert.equal(runBase('127.0.0.1', '/x/y'), '/');
  for (const [lang, expectedLang, expectedTitle] of [['fr', 'fr', 'Page introuvable | Belastingkaart'], ['nl', null, null]]) {
    const attrs = {}; const document = { documentElement: { setAttribute: (k, v) => { attrs[k] = v; } }, title: null };
    vm.runInNewContext(langScript, { window: { BKTaal: { detect: () => lang } }, document });
    assert.equal(attrs.lang ?? null, expectedLang);
    assert.equal(document.title, expectedTitle);
  }
  // Each language block is hidden unless it is the page language; no JS shows Dutch and one link to French.
  assert.match(notFound, /html:not\(\[lang="fr"\]\) \.l-fr,html\[lang="fr"\] \.l-nl\{display:none!important\}/);
  const noscript = notFound.match(/<noscript>([\s\S]*?)<\/noscript>/g);
  assert.equal(noscript.length, 1);
  assert.match(noscript[0], /href="fr\/"/);
  for (const href of Array.from(notFound.matchAll(/(?:href|src)="([^"#]+)"/g), m => m[1])) {
    assert.ok(!href.startsWith('/') || href === '/', `404 link must be relative to <base>: ${href}`);
    if (href === '/') continue;
    const file = href.endsWith('/') ? path.join(WEB, href, 'index.html') : path.join(WEB, href);
    await access(file).catch(() => assert.fail(`404: ${href} does not resolve`));
  }
});

test('the manifests stay one per language and every page links its own', async () => {
  for (const { html, route, lang } of PAGES) assert.ok(html.includes(`${lang}/manifest.webmanifest"`), route);
});
