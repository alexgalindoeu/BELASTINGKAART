// Municipality list (Statbel REFNIS 2025) and the combobox in web/js/gemeente-kiezer.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { parsePage, parseRefnis } from '../tools/build_gemeenten.mjs';

const data = JSON.parse(await readFile(new URL('../web/data/gemeenten.json', import.meta.url), 'utf8'));
const source = await readFile(new URL('../web/js/gemeente-kiezer.js', import.meta.url), 'utf8');
const REGIONS = ['flanders', 'wallonia', 'brussels'];
const nonEmpty = v => typeof v === 'string' && v.trim() === v && v.length > 0;

// ---------------------------------------------------------------- data -------------
test('gemeenten.json matches its schema', () => {
  assert.equal(data.schema_version, 1);
  const s = data.source;
  for (const k of ['publisher', 'page_url', 'file_url', 'file_name', 'retrieved', 'statement', 'reference_date', 'generator'])
    assert.ok(nonEmpty(s[k]), 'source.' + k);
  assert.match(s.page_url, /^https:\/\/statbel\.fgov\.be\//);
  assert.match(s.file_url, /^https:\/\/statbel\.fgov\.be\/.+\/REFNIS_2025\.csv$/);
  assert.equal(s.file_name, 'REFNIS_2025.csv');
  assert.match(s.retrieved, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(s.file_sha256, /^[0-9a-f]{64}$/);
  assert.equal(s.reference_date, '2025-01-01');
  assert.deepEqual(Object.keys(data.regions).sort(), [...REGIONS].sort());
  for (const r of Object.values(data.regions)) { assert.match(r.nis, /^0[234]000$/); assert.ok(nonEmpty(r.name_nl) && nonEmpty(r.name_fr)); }
  for (const p of data.provinces) {
    assert.match(p.nis, /^\d{5}$/); assert.ok(REGIONS.includes(p.region)); assert.ok(nonEmpty(p.name_nl) && nonEmpty(p.name_fr));
  }
  const provinces = new Set(data.provinces.map(p => p.nis));
  const arrondissements = new Set(data.arrondissements.map(a => a.nis));
  const keys = ['nis', 'name_nl', 'name_fr', 'language', 'official_languages', 'bilingual', 'region',
    'province_nis', 'arrondissement_nis', 'merger'];
  const seen = new Set();
  for (const m of data.municipalities) {
    assert.deepEqual(Object.keys(m), keys, m.nis);
    assert.match(m.nis, /^\d{5}$/);
    assert.ok(!seen.has(m.nis), 'duplicate ' + m.nis); seen.add(m.nis);
    assert.ok(['N', 'F', 'D', 'FN'].includes(m.language), m.nis);
    assert.equal(m.bilingual, m.official_languages.length === 2, m.nis);
    assert.ok(arrondissements.has(m.arrondissement_nis), m.nis);
    if (m.region === 'brussels') assert.equal(m.province_nis, null, m.nis);
    else assert.ok(provinces.has(m.province_nis), m.nis);
    if (m.merger) {
      assert.match(m.merger.effective_from, /^\d{4}-\d{2}-\d{2}$/);
      for (const old of m.merger.merged_from) assert.match(old, /^\d{5}$/);
    }
  }
});

test('record count equals the official count stated by Statbel', () => {
  assert.equal(data.municipalities.length, data.source.record_count);
  assert.equal(data.source.record_count, data.source.official_count);
  assert.equal(data.source.statement, `Nomenclatuur geldig vanaf 1/01/2025 (${data.source.official_count} gemeenten)`);
  // REFNIS: 3 regions; the Flemish and Walloon regions have 5 provinces each, Brussels none.
  assert.equal(Object.keys(data.regions).length, 3);
  assert.equal(data.provinces.length, 10);
});

test('every municipality has a region and NL and FR names (or the single official name in both)', () => {
  for (const m of data.municipalities) {
    assert.ok(REGIONS.includes(m.region), m.nis);
    assert.ok(nonEmpty(m.name_nl), m.nis + ' name_nl');
    assert.ok(nonEmpty(m.name_fr), m.nis + ' name_fr');
  }
  const brussels = data.municipalities.filter(m => m.region === 'brussels');
  assert.ok(brussels.length > 0 && brussels.every(m => m.bilingual), 'Brussels municipalities are bilingual');
  assert.ok(data.municipalities.filter(m => m.region !== 'brussels').every(m => !m.bilingual));
  // the region follows the first digit of the NIS code of the province / Brussels-Capital arrondissement
  for (const m of data.municipalities) if (m.region === 'brussels') assert.match(m.nis, /^21/);
});

test('the 2025 mergers from the Statbel page are recorded on the new municipalities', () => {
  const byNis = new Map(data.municipalities.map(m => [m.nis, m]));
  assert.ok(data.mergers.length > 0);
  for (const merger of data.mergers) {
    const m = byNis.get(merger.new.nis);
    assert.ok(m, merger.text);
    assert.deepEqual(m.merger.merged_from, merger.merged.map(x => x.nis));
    for (const old of merger.merged) if (old.nis !== merger.new.nis) assert.ok(!byNis.has(old.nis), old.nis);
  }
  const flemish2025 = data.mergers.filter(x => x.effective_from === '2025-01-01');
  assert.ok(flemish2025.every(x => byNis.get(x.new.nis).region === 'flanders'));
});

test('the build parser rejects inconsistent official files', () => {
  const header = 'Code INS|Entités administratives|Langue|Code NIS|Administratieve eenheden|Taal';
  assert.throws(() => parseRefnis('wrong|header\n'), /unexpected column/);
  assert.throws(() => parseRefnis(header + '\n02000|R||02000|R|\n11001|A|N|11002|A|N\n'), /inconsistent codes/);
  assert.throws(() => parseRefnis(header + '\n02000|R||02000|R|\n11001|A|X|11001|A|X\n'), /municipality outside|unknown language/);
  assert.throws(() => parsePage('<p>no count</p>'), /official municipality count/);
});

// ------------------------------------------------------------- search --------------
const ctx = { window: {}, Intl };
vm.runInNewContext(source, ctx);
const K = ctx.window.BKGemeenteKiezer;
const nl = K.entries(data.municipalities, 'nl', data.provinces);
const fr = K.entries(data.municipalities, 'fr', data.provinces);
const byNis = nis => data.municipalities.find(m => m.nis === nis);
// Test targets are taken from the data itself, never typed in.
const accented = data.municipalities.find(m => m.region === 'wallonia' && /[éèêëàâîïôûüç]/i.test(m.name_fr) && m.name_fr !== m.name_nl);
const differentNames = data.municipalities.find(m => m.region === 'flanders' && K.normalize(m.name_nl) !== K.normalize(m.name_fr));
const bxl = data.municipalities.find(m => m.region === 'brussels' && m.name_nl !== m.name_fr);

test('normalize ignores case, accents, apostrophes and hyphens', () => {
  assert.equal(K.normalize('  Évère-ÀÇÉ’s  '), 'evere aces');
  assert.equal(K.normalize("Fontaine-l'Evêque"), K.normalize('fontaine levEque'));
  assert.equal(K.normalize('Cœur'), 'coeur');
});

test('search works in both languages, with and without accents', () => {
  for (const [list, lang, m] of [[nl, 'nl', differentNames], [fr, 'fr', differentNames], [fr, 'fr', accented]]) {
    const name = m['name_' + lang];
    for (const q of [name, name.toLowerCase(), name.toUpperCase(), name.normalize('NFD').replace(/[̀-ͯ]/g, ''), name.slice(0, 4)]) {
      const hits = K.search(list, q);
      assert.ok(hits.some(e => e.m.nis === m.nis), `${lang} "${q}" finds ${name}`);
    }
    assert.equal(K.search(list, name)[0].name, name, 'exact name ranks first');
  }
  // page language only: the FR name of a Flemish municipality is not offered on /nl/ and vice versa
  assert.ok(!K.search(nl, differentNames.name_fr).some(e => e.m.nis === differentNames.nis && e.name === differentNames.name_fr));
  assert.ok(K.search(nl, '').every(e => e.name === e.m.name_nl));
  assert.ok(K.search(fr, '').every(e => e.name === e.m.name_fr));
  assert.equal(K.search(nl, '').length, data.municipalities.length);
  assert.equal(K.search(nl, 'zzzzqqq').length, 0);
});

test('officially bilingual municipalities show and match both official names', () => {
  const e = nl.find(x => x.m.nis === bxl.nis);
  assert.equal(e.name, bxl.name_nl); assert.equal(e.alt, bxl.name_fr); assert.equal(e.altLang, 'fr');
  assert.ok(K.search(nl, bxl.name_fr).some(x => x.m.nis === bxl.nis));
  assert.ok(K.search(fr, bxl.name_nl).some(x => x.m.nis === bxl.nis));
  const plain = nl.find(x => x.m.nis === differentNames.nis);
  assert.equal(plain.alt, null);
});

test('duplicate names in one language are told apart by their province', () => {
  for (const list of [nl, fr]) {
    const counts = {};
    for (const e of list) counts[e.name] = (counts[e.name] || 0) + 1;
    for (const e of list) if (counts[e.name] > 1) assert.ok(nonEmpty(e.hint), e.name);
    const labels = list.map(e => e.name + '|' + (e.hint || ''));
    assert.equal(new Set(labels).size, labels.length);
  }
});

// ------------------------------------------------------------- DOM shim -------------
class Ev { constructor(type, init = {}) { Object.assign(this, init); this.type = type; this.defaultPrevented = false; }
  preventDefault() { this.defaultPrevented = true; } }
class El {
  constructor(doc, tag, attrs = {}) {
    this.ownerDocument = doc; this.tagName = tag.toUpperCase(); this.attributes = {}; this.children = [];
    this.parentNode = null; this.listeners = {}; this.dataset = {}; this.hidden = false; this.value = ''; this._text = '';
    for (const [k, v] of Object.entries(attrs)) this.setAttribute(k, v);
  }
  get id() { return this.attributes.id || ''; } set id(v) { this.setAttribute('id', v); }
  get className() { return this.attributes.class || ''; } set className(v) { this.setAttribute('class', v); }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
    if (k.startsWith('data-')) this.dataset[k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = String(v);
    if (k === 'hidden') this.hidden = true;
  }
  getAttribute(k) { return k in this.attributes ? this.attributes[k] : null; }
  hasAttribute(k) { return k in this.attributes; }
  removeAttribute(k) { delete this.attributes[k]; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  replaceChildren(...nodes) { this.children = []; nodes.forEach(n => this.appendChild(n)); }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(' '); }
  set textContent(v) { this._text = String(v); this.children = []; }
  addEventListener(t, f) { (this.listeners[t] ||= []).push(f); }
  dispatchEvent(e) { e.target ||= this; for (const f of this.listeners[e.type] || []) f(e);
    if (e.bubbles && this.parentNode) this.parentNode.dispatchEvent(e); return !e.defaultPrevented; }
  focus() { this.ownerDocument.activeElement = this; }
  matches(sel) {
    const m = sel.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
    if (m) return m[2] === undefined ? this.hasAttribute(m[1]) : this.getAttribute(m[1]) === m[2];
    if (sel.startsWith('.')) return this.className.split(/\s+/).includes(sel.slice(1));
    return this.tagName === sel.toUpperCase();
  }
  querySelectorAll(sel) { const out = []; const walk = n => { for (const c of n.children) { if (c.matches(sel)) out.push(c); walk(c); } }; walk(this); return out; }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}
function pageDoc() {
  const listeners = {};
  return { activeElement: null, listeners, createElement(tag) { return new El(this, tag); },
    addEventListener(t, f) { (listeners[t] ||= []).push(f); },
    dispatchEvent(e) { for (const f of listeners[e.type] || []) f(e); return true; } };
}
function mount(lang, withRegionSelect = false, { doc = { activeElement: null, createElement: tag => new El(doc, tag) }, sync = false } = {}) {
  const root = new El(doc, 'div', { class: 'field gk', 'data-gemeente-kiezer': '' });
  root.appendChild(new El(doc, 'label', { for: 'f-gemeente', id: 'f-gemeente-label' }));
  const box = root.appendChild(new El(doc, 'div', { class: 'gk-box' }));
  const input = box.appendChild(new El(doc, 'input', { id: 'f-gemeente', type: 'text', role: 'combobox' }));
  const listbox = box.appendChild(new El(doc, 'ul', { id: 'f-gemeente-list', role: 'listbox', hidden: '' }));
  const nis = root.appendChild(new El(doc, 'input', { type: 'hidden', name: 'municipalityNis', 'data-gk-nis': '' }));
  const region = root.appendChild(new El(doc, 'input', { type: 'hidden', name: 'municipalityRegion', 'data-gk-region': '' }));
  const status = root.appendChild(new El(doc, 'p', { class: 'gk-status', role: 'status', 'data-gk-status': '' }));
  const regionSelect = withRegionSelect ? new El(doc, 'select', { name: 'region' }) : null;
  if (regionSelect) regionSelect.value = 'flanders';
  const events = [];
  root.addEventListener('gemeente-change', e => events.push(e.detail));
  const api = K.create(root, { municipalities: data.municipalities, provinces: data.provinces, lang, regionSelect, sync,
    Event: Ev, CustomEvent: class extends Ev {} });
  const type = text => { input.value = text; input.dispatchEvent(new Ev('input')); };
  const key = (k, extra = {}) => { const e = new Ev('keydown', { key: k, ...extra }); input.dispatchEvent(e); return e; };
  const activeOption = () => listbox.children.find(o => o.id === input.getAttribute('aria-activedescendant'));
  return { root, input, listbox, nis, region, status, regionSelect, events, api, type, key, activeOption };
}

test('combobox exposes the ARIA 1.2 attributes', () => {
  const c = mount('nl');
  assert.equal(c.input.getAttribute('role'), 'combobox');
  assert.equal(c.input.getAttribute('aria-autocomplete'), 'list');
  assert.equal(c.input.getAttribute('aria-controls'), 'f-gemeente-list');
  assert.equal(c.input.getAttribute('aria-expanded'), 'false');
  assert.equal(c.input.getAttribute('autocomplete'), 'off');
  c.type(differentNames.name_nl.slice(0, 3));
  assert.equal(c.input.getAttribute('aria-expanded'), 'true');
  assert.equal(c.listbox.hidden, false);
  assert.ok(c.listbox.children.every(o => o.getAttribute('role') === 'option' && o.getAttribute('aria-selected') === 'false'));
  assert.equal(c.input.hasAttribute('aria-activedescendant'), false, 'typing does not move the active option');
  assert.match(c.status.textContent, /gemeente(n)? gevonden/);
});

test('arrow keys, Enter and Escape follow the combobox keyboard pattern', () => {
  const c = mount('nl');
  const name = differentNames.name_nl;
  c.type(name);
  c.key('ArrowDown');
  assert.equal(c.activeOption().dataset.nis, differentNames.nis);
  assert.equal(c.activeOption().getAttribute('aria-selected'), 'true');
  const n = c.listbox.children.length;
  c.key('ArrowUp'); // wraps to the last option
  assert.equal(c.input.getAttribute('aria-activedescendant'), c.listbox.children[n - 1].id);
  c.key('ArrowDown'); // wraps back to the first
  assert.equal(c.activeOption().dataset.nis, differentNames.nis);
  const enter = c.key('Enter');
  assert.equal(enter.defaultPrevented, true, 'Enter on an option does not submit the form');
  assert.equal(c.input.value, name);
  assert.equal(c.nis.value, differentNames.nis);
  assert.equal(c.region.value, 'flanders');
  assert.equal(c.input.getAttribute('aria-expanded'), 'false');
  assert.deepEqual({ ...c.events.at(-1) }, { nis: differentNames.nis, region: 'flanders', name });
  // Escape closes an open list, a second Escape clears the field
  c.key('ArrowDown');
  assert.equal(c.input.getAttribute('aria-expanded'), 'true');
  c.key('Escape');
  assert.equal(c.input.getAttribute('aria-expanded'), 'false');
  assert.equal(c.nis.value, differentNames.nis);
  c.key('Escape');
  assert.equal(c.input.value, ''); assert.equal(c.nis.value, ''); assert.equal(c.region.value, '');
  // Enter with a closed list lets the form submit
  assert.equal(c.key('Enter').defaultPrevented, false);
});

test('Alt+ArrowDown opens without moving; PageDown jumps; Tab accepts the active option', () => {
  const c = mount('fr');
  c.key('ArrowDown', { altKey: true });
  assert.equal(c.input.getAttribute('aria-expanded'), 'true');
  assert.equal(c.listbox.children.length, data.municipalities.length, 'empty field lists every municipality, like a select');
  assert.equal(c.input.hasAttribute('aria-activedescendant'), false);
  c.key('ArrowDown'); c.key('PageDown');
  const target = c.activeOption();
  assert.equal(c.listbox.children.indexOf(target), 10);
  c.key('Tab');
  assert.equal(c.nis.value, target.dataset.nis);
  assert.equal(c.input.value, byNis(target.dataset.nis).name_fr);
});

test('editing after a choice clears the NIS code; blur accepts an exact accent-free name', () => {
  const c = mount('fr', true);
  c.api.select(accented.nis);
  assert.equal(c.nis.value, accented.nis);
  assert.equal(c.regionSelect.value, 'wallonia', 'region select follows the municipality');
  c.type(accented.name_fr + 'x');
  assert.equal(c.nis.value, '');
  c.input.dispatchEvent(new Ev('blur'));
  assert.equal(c.input.getAttribute('aria-invalid'), 'true');
  c.input.value = accented.name_fr.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  c.input.dispatchEvent(new Ev('input'));
  c.input.dispatchEvent(new Ev('blur'));
  assert.equal(c.nis.value, accented.nis);
  assert.equal(c.input.value, accented.name_fr, 'the official spelling replaces what was typed');
  assert.equal(c.input.hasAttribute('aria-invalid'), false);
});

test('pointer and touch: tapping an option chooses it and keeps the focus in the field', () => {
  const c = mount('nl');
  c.input.dispatchEvent(new Ev('click'));
  assert.equal(c.input.getAttribute('aria-expanded'), 'true');
  const down = new Ev('mousedown');
  c.listbox.dispatchEvent(down);
  assert.equal(down.defaultPrevented, true);
  const option = c.listbox.children.find(o => o.dataset.nis === bxl.nis);
  option.children[0].dispatchEvent(new Ev('click', { bubbles: true }));
  assert.equal(c.nis.value, bxl.nis);
  assert.equal(c.region.value, 'brussels');
  assert.equal(c.input.value, bxl.name_nl);
  assert.equal(option.children[1].getAttribute('lang'), 'fr');
  assert.equal(c.root.ownerDocument.activeElement, c.input);
});

test('the component never reads tax rates or parameters', () => {
  assert.doesNotMatch(source, /BK_TAX_PARAMETERS|BKParameters|parameters\.json|opcentiem|centimes|tarief|\btaux\b|\brates?\b/i);
});

test('synced pickers and the map follow each other through the bk:gemeente event', () => {
  const doc = pageDoc();
  const seen = [];
  doc.addEventListener('bk:gemeente', e => seen.push(e.detail));
  const a = mount('nl', true, { doc, sync: true }), b = mount('nl', false, { doc, sync: true });
  const lone = mount('nl', false, { doc });  // e.g. the scenario tool's "new municipality"
  a.api.select(differentNames.nis);
  assert.equal(seen.length, 1, 'one event per choice, no echo');
  assert.equal(seen[0].nis, differentNames.nis);
  assert.equal(seen[0].source, 'gemeente-kiezer');
  assert.equal(b.nis.value, differentNames.nis);
  assert.equal(b.input.value, differentNames.name_nl);
  assert.equal(lone.nis.value, '', 'an unsynced picker keeps its own value');
  // the map (kaart.js) dispatches { nis, name, region } when a municipality is clicked
  doc.dispatchEvent(new Ev('bk:gemeente', { detail: { nis: bxl.nis, name: { nl: bxl.name_nl }, region: 'BRU' } }));
  assert.equal(a.nis.value, bxl.nis); assert.equal(b.nis.value, bxl.nis);
  assert.equal(a.regionSelect.value, 'brussels');
  assert.equal(seen.length, 2, 'a choice that came from the page is not dispatched again');
  doc.dispatchEvent(new Ev('bk:gemeente', { detail: { nis: '00000' } }));
  assert.equal(a.nis.value, bxl.nis, 'unknown codes are ignored');
});

test('changing the region by hand clears a municipality of another region', () => {
  const c = mount('nl', true);
  c.api.select(differentNames.nis);
  c.regionSelect.value = 'wallonia';
  c.regionSelect.dispatchEvent(new Ev('change'));
  assert.equal(c.nis.value, ''); assert.equal(c.region.value, ''); assert.equal(c.input.value, '');
});
