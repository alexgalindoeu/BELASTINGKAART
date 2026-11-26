// Shared by tools/build_kaart.mjs, tools/check_kaart.mjs and the tests: the regions and
// provinces of Belgium (official names, Belgian Constitution art. 3 and 5) and the schema
// of web/data/kaart_be.json.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

// Regions: Constitution art. 3 (NL "het Vlaamse Gewest, het Waalse Gewest en het Brusselse Gewest";
// FR "la Région wallonne, la Région flamande et la Région bruxelloise"); the official names used
// by the federal administration are below. NIS codes as in the REFNIS code list.
export const REGIONS = {
  VLG: { nis: '02000', name: { nl: 'Vlaanderen', fr: 'Flandre' }, official: { nl: 'Vlaams Gewest', fr: 'Région flamande' } },
  BRU: { nis: '04000', name: { nl: 'Brussel', fr: 'Bruxelles' }, official: { nl: 'Brussels Hoofdstedelijk Gewest', fr: 'Région de Bruxelles-Capitale' } },
  WAL: { nis: '03000', name: { nl: 'Wallonië', fr: 'Wallonie' }, official: { nl: 'Waals Gewest', fr: 'Région wallonne' } }
};

// Provinces of the Flemish Region (Constitution art. 5). The municipality's NIS code starts with
// the province digit (Vlaams-Brabant: 23 and 24).
export const PROVINCES = [
  { nis: '10000', region: 'VLG', name: { nl: 'Antwerpen', fr: 'Anvers' }, match: n => n[0] === '1' },
  { nis: '20001', region: 'VLG', name: { nl: 'Vlaams-Brabant', fr: 'Brabant flamand' }, match: n => n.startsWith('23') || n.startsWith('24') },
  { nis: '30000', region: 'VLG', name: { nl: 'West-Vlaanderen', fr: 'Flandre occidentale' }, match: n => n[0] === '3' },
  { nis: '40000', region: 'VLG', name: { nl: 'Oost-Vlaanderen', fr: 'Flandre orientale' }, match: n => n[0] === '4' },
  { nis: '70000', region: 'VLG', name: { nl: 'Limburg', fr: 'Limbourg' }, match: n => n[0] === '7' }
];

// Official municipality counts per region on 1 January 2025 (after the mergers), as in Statbel REFNIS 2025
// (web/data/gemeenten.json: 285 + 19 + 261 = 565). check:kaart also recounts them from that file.
export const EXPECTED = { VLG: 285, BRU: 19, WAL: 261 };

export async function generatorHash() {
  const files = ['../build_kaart.mjs', './kaart.mjs'];
  const h = createHash('sha256');
  for (const f of files) h.update(await readFile(new URL(f, import.meta.url)));
  return h.digest('hex');
}

// Path data: absolute moveto, relative lineto, optional closepath, integers or decimals.
export const PATH_RE = /^(M-?\d+(\.\d+)? -?\d+(\.\d+)?l(-?\d+(\.\d+)?[ -]?)+z?)+$/;
const isPath = d => typeof d === 'string' && d.length > 0 && PATH_RE.test(d.replace(/ -/g, '-').replace(/l-/g, 'l-'));

export function validateKaart(k) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(msg); };
  req(k && k.schema === 1, 'schema must be 1');
  if (!k) return e;
  const s = k.source || {};
  for (const f of ['id', 'title', 'url', 'crs', 'retrieved', 'sha256', 'validFrom']) req(s[f], `source.${f} missing`);
  req(s.publisher?.nl && s.publisher?.fr, 'source.publisher nl/fr');
  req(s.attribution?.nl && s.attribution?.fr, 'source.attribution nl/fr');
  req(s.licence && s.licence.status, 'source.licence.status');
  req(/^https:\/\/([a-z0-9-]+\.)*(vlaanderen\.be|ngi\.be|geo\.be|statbel\.fgov\.be|data\.gov\.be)\//.test(s.url || ''), 'source.url must be an official host');
  req(Array.isArray(k.viewBox) && k.viewBox.length === 4 && k.viewBox.every(Number.isFinite), 'viewBox');
  req(Array.isArray(k.coverage) && k.coverage.length > 0 && k.coverage.every(r => REGIONS[r]), 'coverage');
  req(k.names && /^[0-9a-f]{64}$/.test(k.names.sha256 || ''), 'names.sha256');
  req(k.regions && Object.keys(REGIONS).every(r => k.regions[r]?.name?.nl && k.regions[r]?.name?.fr), 'regions');
  const ms = k.municipalities || [];
  req(k.count === ms.length, 'count must equal municipalities.length');
  for (const r of k.coverage || []) if (EXPECTED[r] != null)
    req(ms.filter(m => m.region === r).length === EXPECTED[r], `region ${r} must have ${EXPECTED[r]} municipalities`);
  if (s.expectedCount != null) req(ms.length === s.expectedCount, `count ${ms.length} differs from the source's ${s.expectedCount}`);
  const seen = new Set();
  const provs = new Set((k.provinces || []).map(p => p.nis));
  const [, , W, H] = k.viewBox || [];
  for (const m of ms) {
    const id = m.nis || '?';
    req(/^\d{5}$/.test(m.nis || ''), `${id}: NIS code`);
    req(!seen.has(m.nis), `${id}: duplicate`); seen.add(m.nis);
    req(m.name?.nl && m.name?.fr, `${id}: NL and FR name`);
    req(k.coverage?.includes(m.region), `${id}: region`);
    req(provs.has(m.province), `${id}: province`);
    req(isPath(m.d), `${id}: path`);
    req(Array.isArray(m.anchor) && m.anchor[0] >= 0 && m.anchor[0] <= W && m.anchor[1] >= 0 && m.anchor[1] <= H, `${id}: anchor inside viewBox`);
  }
  const b = k.borders || {};
  for (const key of ['municipal', 'provinces', 'region']) req(isPath(b[key]), `borders.${key}`);
  req(typeof b.national === 'string', 'borders.national');
  return e;
}

// ---- the list alternative on the full-page map (generated into the page) --------------
export const KAART_PAGES = { nl: 'nl/kaart/', fr: 'fr/carte/' };
export const LIST_START = '<!-- bk-kaart-list:start (generated by npm run build:kaart; do not edit by hand) -->';
export const LIST_END = '<!-- bk-kaart-list:end -->';
const escHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function listBlock(kaart, lang) {
  const locale = lang === 'fr' ? 'fr-BE' : 'nl-BE';
  const groups = kaart.provinces
    .map(p => ({ p, ms: kaart.municipalities.filter(m => m.province === p.nis) }))
    .filter(g => g.ms.length)
    .sort((a, b) => a.p.nis.localeCompare(b.p.nis));
  return groups.map(({ p, ms }) => {
    const items = ms.slice().sort((a, b) => a.name[lang].localeCompare(b.name[lang], locale))
      .map(m => `<li><button type="button" data-nis="${m.nis}" aria-pressed="false">${escHtml(m.name[lang])}</button></li>`).join('');
    const region = kaart.regions[p.region].name[lang];
    return `<h3 id="prov-${p.nis}">${escHtml(p.name[lang])} <span class="footer-small">(${escHtml(region)})</span></h3>\n<ul aria-labelledby="prov-${p.nis}">${items}</ul>`;
  }).join('\n');
}

export function applyList(html, kaart, lang) {
  const s = html.indexOf(LIST_START), e = html.indexOf(LIST_END);
  if (s < 0 || e < s) throw new Error(`${KAART_PAGES[lang]}: list markers missing`);
  return html.slice(0, s) + LIST_START + '\n' + listBlock(kaart, lang) + '\n' + html.slice(e);
}
