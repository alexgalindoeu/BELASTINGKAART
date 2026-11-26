// Builds web/data/kaart_be.json: the municipalities of Belgium as SVG paths that are already
// projected, with region and province borders, label anchors and the source record.
// The browser needs no map library (web/js/kaart.js only draws these paths).
//
//   npm run build:kaart              download the official file (or reuse the cache) and write the JSON
//   npm run build:kaart -- --refresh download again even if the cache exists
//   npm run check:kaart              schema + staleness check (see tools/lib/kaart.mjs)
//
// Source (see docs/sources/kaart_geometrie.md): Digitaal Vlaanderen, "Voorlopig referentiebestand
// gemeentegrenzen 2025" (VRBG 2025), layer RefgemG10 (generalised to 10 m), WFS 2.0 GetFeature
// as GeoJSON in EPSG:3812 (ETRS89 / Belgian Lambert 2008). The coordinates are already in Belgian
// Lambert 2008, so the projection step is only a scale to the viewBox with the y axis flipped.
//
// Coverage today: the Flemish Region (285 municipalities). Brussels and Wallonia need a
// Belgium-wide official file (NGI "Territorial Divisions / AdminVector", served from ac.ngi.be);
// the data model already carries the three regions, and `coverage` says which are drawn.
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { REGIONS, PROVINCES, KAART_PAGES, validateKaart, generatorHash, applyList } from './lib/kaart.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUT = path.join(ROOT, 'web/data/kaart_be.json');
const CACHE = path.join(ROOT, '.cache/kaart/vrbg2025_refgemg10_3812.geojson');
const NAMES = path.join(ROOT, 'web/data/gemeenten.json');

export const SOURCE = {
  id: 'vrbg2025-refgemg10',
  publisher: { nl: 'Digitaal Vlaanderen (Vlaamse overheid)', fr: 'Digitaal Vlaanderen (Gouvernement flamand)' },
  title: 'Voorlopig referentiebestand gemeentegrenzen 2025 (VRBG 2025), RefgemG10',
  url: 'https://geo.api.vlaanderen.be/VRBG2025/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=VRBG2025:RefgemG10&outputFormat=application/json&srsName=EPSG:3812',
  service: 'https://geo.api.vlaanderen.be/VRBG2025/wfs?service=WFS&request=GetCapabilities',
  terms: 'https://www.vlaanderen.be/digitaal-vlaanderen/onze-diensten-en-platformen/geografische-webdiensten/gebruiksrecht-en-privacyverklaring-geografische-webdiensten',
  metadata: 'https://metadata.vlaanderen.be/srv/dut/catalog.search#/metadata/72dca52e-b57d-4933-922c-d57ada0e0986',
  attribution: { nl: 'Bron: Digitaal Vlaanderen, Voorlopig referentiebestand gemeentegrenzen 2025', fr: 'Source : Digitaal Vlaanderen, Voorlopig referentiebestand gemeentegrenzen 2025' },
  crs: 'EPSG:3812',
  validFrom: '2025-01-01',
  expectedCount: 285
};

// Simplification and drawing settings. They are part of the generator hash, so changing
// them makes check:kaart report the JSON as stale until it is rebuilt.
export const SETTINGS = { width: 1000, pad: 8, simplify: '14%', decimals: 0 };

const sha256 = s => createHash('sha256').update(s).digest('hex');

async function loadSource(refresh) {
  const cached = await access(CACHE).then(() => true, () => false);
  if (cached && !refresh) return readFile(CACHE, 'utf8');
  const res = await fetch(SOURCE.url);
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status} for ${SOURCE.url}`);
  const text = await res.text();
  if (!text.startsWith('{')) throw new Error('download is not GeoJSON (bot check or error page?)');
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, text);
  return text;
}

// ---- geometry helpers ---------------------------------------------------------------
function makeScaler(bbox) {
  const [x0, y0, x1, y1] = bbox;
  const k = (SETTINGS.width - 2 * SETTINGS.pad) / (x1 - x0);
  const height = Math.ceil((y1 - y0) * k + 2 * SETTINGS.pad);
  const f = 10 ** SETTINGS.decimals;
  const r = v => Math.round(v * f) / f;
  return { height, k, pt: ([x, y]) => [r((x - x0) * k + SETTINGS.pad), r((y1 - y) * k + SETTINGS.pad)] };
}

// Relative path with integer steps, as compact as possible: "M12 34l1 -2 3 0z".
function ringPath(ring, pt, close) {
  const pts = [];
  for (const c of ring) {
    const p = pt(c);
    const last = pts[pts.length - 1];
    if (!last || last[0] !== p[0] || last[1] !== p[1]) pts.push(p);
  }
  if (close && pts.length > 1 && pts[0][0] === pts.at(-1)[0] && pts[0][1] === pts.at(-1)[1]) pts.pop();
  if (pts.length < (close ? 3 : 2)) return '';
  let d = `M${pts[0][0]} ${pts[0][1]}l`;
  const steps = [];
  for (let i = 1; i < pts.length; i++) steps.push(`${+(pts[i][0] - pts[i - 1][0]).toFixed(SETTINGS.decimals)} ${+(pts[i][1] - pts[i - 1][1]).toFixed(SETTINGS.decimals)}`);
  d += steps.join(' ').replace(/ -/g, '-');
  return d + (close ? 'z' : '');
}
const polyPath = (geom, pt) => {
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
  return polys.flatMap(p => p.map(r => ringPath(r, pt, true))).join('');
};
const linePath = (geom, pt) => {
  const lines = geom.type === 'LineString' ? [geom.coordinates] : geom.type === 'MultiLineString' ? geom.coordinates : [];
  return lines.map(l => ringPath(l, pt, false)).join('');
};

export async function buildKaart({ refresh = false } = {}) {
  const raw = await loadSource(refresh);
  const src = JSON.parse(raw);
  const crs = src.crs?.properties?.name || '';
  if (!/3812$/.test(crs)) throw new Error(`unexpected CRS ${crs}`);
  // Join key: the NIS code. Names (NL and FR), region and province come from the official Statbel
  // REFNIS 2025 list in web/data/gemeenten.json; the geometry only contributes the shape.
  const namesText = await readFile(NAMES, 'utf8');
  const refnis = new Map(JSON.parse(namesText).municipalities.map(m => [m.nis, m]));
  const REGION_KEY = { flanders: 'VLG', brussels: 'BRU', wallonia: 'WAL' };
  for (const f of src.features) {
    const nis = String(f.properties.NISCODE);
    const r = refnis.get(nis);
    if (!r) throw new Error(`NIS ${nis} (${f.properties.NAAM}) is not in the REFNIS 2025 list`);
    if (r.name_nl !== f.properties.NAAM) throw new Error(`NIS ${nis}: geometry name ${f.properties.NAAM} differs from REFNIS ${r.name_nl}`);
    f.properties = { nis, nl: r.name_nl, fr: r.name_fr, prov: r.province_nis, region: REGION_KEY[r.region] };
  }
  const mapshaper = (await import('mapshaper')).default;
  const cmd = [
    '-i gem.json name=gem',
    `-simplify ${SETTINGS.simplify} weighted keep-shapes`,
    '-clean',
    '-innerlines target=gem + name=municipal',
    '-dissolve prov target=gem + name=prov',
    '-innerlines target=prov + name=provinces',
    '-dissolve region target=gem + name=reg',
    '-lines target=reg + name=region',
    '-points inner target=gem + name=anchors',
    '-o target=gem,municipal,provinces,region,anchors format=geojson'
  ].join(' ');
  const out = await mapshaper.applyCommands(cmd, { 'gem.json': JSON.stringify(src) });
  const layer = n => { const j = JSON.parse(out[`${n}.json`]); return j.features || j.geometries.map(geometry => ({ geometry })); };
  const gem = layer('gem');

  // bbox of the simplified municipalities, in Lambert 2008 metres
  let bbox = [Infinity, Infinity, -Infinity, -Infinity];
  const grow = c => { bbox = [Math.min(bbox[0], c[0]), Math.min(bbox[1], c[1]), Math.max(bbox[2], c[0]), Math.max(bbox[3], c[1])]; };
  for (const f of gem) JSON.stringify(f.geometry.coordinates, (k, v) => (Array.isArray(v) && typeof v[0] === 'number' ? (grow(v), undefined) : v));
  const { height, pt } = makeScaler(bbox);

  const anchors = new Map(layer('anchors').map(f => [f.properties.nis, pt(f.geometry.coordinates)]));
  const municipalities = gem.map(f => {
    const nis = f.properties.nis;
    return { nis, name: { nl: f.properties.nl, fr: f.properties.fr }, region: f.properties.region,
      province: f.properties.prov, anchor: anchors.get(nis), d: polyPath(f.geometry, pt) };
  }).sort((a, b) => a.nis.localeCompare(b.nis));

  const kaart = {
    schema: 1,
    source: {
      ...SOURCE,
      licence: { status: 'pending', nl: 'Gebruiksvoorwaarden volgens de metadata van de dataset (metadata.vlaanderen.be); de licentie is nog niet geverifieerd.',
        fr: 'Conditions d’utilisation selon les métadonnées du jeu de données (metadata.vlaanderen.be) ; la licence n’a pas encore été vérifiée.' },
      retrieved: process.env.KAART_RETRIEVED || new Date().toISOString().slice(0, 10),
      sha256: sha256(raw)
    },
    projection: { crs: 'EPSG:3812', name: 'ETRS89 / Belgian Lambert 2008', note: 'Coordinates scaled to the viewBox, y axis flipped (SVG).' },
    names: { file: 'web/data/gemeenten.json', source: 'Statbel, REFNIS 2025', sha256: sha256(namesText) },
    build: { generator: 'tools/build_kaart.mjs', generatorSha256: await generatorHash(), settings: SETTINGS, bboxLambert2008: bbox.map(v => Math.round(v)) },
    viewBox: [0, 0, SETTINGS.width, height],
    coverage: ['VLG'],
    regions: REGIONS,
    provinces: PROVINCES.map(({ nis, name, region }) => ({ nis, name, region })),
    count: municipalities.length,
    municipalities,
    borders: {
      municipal: layer('municipal').map(f => linePath(f.geometry, pt)).join(''),
      provinces: layer('provinces').map(f => linePath(f.geometry, pt)).join(''),
      region: layer('region').map(f => linePath(f.geometry, pt)).join(''),
      national: ''
    }
  };
  const errors = validateKaart(kaart);
  if (errors.length) throw new Error('kaart_be.json would be invalid:\n  ' + errors.join('\n  '));
  return kaart;
}

export const serialize = kaart => JSON.stringify(kaart) + '\n';

if (import.meta.url === `file://${process.argv[1]}`) {
  // keep the retrieval date of the cached file when rebuilding offline
  if (!process.env.KAART_RETRIEVED && !process.argv.includes('--refresh')) {
    try { process.env.KAART_RETRIEVED = JSON.parse(await readFile(OUT, 'utf8')).source.retrieved; } catch {}
  }
  const kaart = await buildKaart({ refresh: process.argv.includes('--refresh') });
  const text = serialize(kaart);
  await writeFile(OUT, text);
  for (const [lang, route] of Object.entries(KAART_PAGES)) {
    const file = path.join(ROOT, 'web', route, 'index.html');
    await writeFile(file, applyList(await readFile(file, 'utf8'), kaart, lang));
  }
  const { gzipSync } = await import('node:zlib');
  console.log(`kaart_be.json: ${kaart.count} municipalities, viewBox ${kaart.viewBox.join(' ')}, ${text.length} bytes (${gzipSync(text).length} gzip)`);
}
