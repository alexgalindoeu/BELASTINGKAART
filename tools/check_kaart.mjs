// npm run check:kaart — web/data/kaart_be.json is valid and up to date:
//   1. schema: source record, viewBox, three regions, every municipality with NIS code, NL/FR name,
//      region, province, valid path and an anchor inside the viewBox; counts equal the official ones;
//   2. staleness: built by the current tools/build_kaart.mjs and tools/lib/kaart.mjs (hash), and the
//      list alternative in web/nl/kaart/ and web/fr/carte/ matches the data;
//   3. if the downloaded source is cached (.cache/kaart/), rebuilding gives the same file byte for byte.
import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateKaart, generatorHash, applyList, KAART_PAGES } from './lib/kaart.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export async function checkKaart({ rebuild = true } = {}) {
  const errors = [];
  const text = await readFile(path.join(ROOT, 'web/data/kaart_be.json'), 'utf8');
  const kaart = JSON.parse(text);
  errors.push(...validateKaart(kaart));
  if (kaart.build?.generatorSha256 !== await generatorHash()) errors.push('generator changed since the last build: run npm run build:kaart');
  const names = await readFile(path.join(ROOT, 'web/data/gemeenten.json'), 'utf8');
  if (kaart.names?.sha256 !== createHash('sha256').update(names).digest('hex')) errors.push('web/data/gemeenten.json changed since the last build: run npm run build:kaart');
  const refnis = new Map(JSON.parse(names).municipalities.map(m => [m.nis, m]));
  for (const m of kaart.municipalities) {
    const r = refnis.get(m.nis);
    if (!r) errors.push(`${m.nis}: not in the REFNIS list`);
    else if (r.name_nl !== m.name.nl || r.name_fr !== m.name.fr) errors.push(`${m.nis}: names differ from REFNIS`);
  }
  // official count per covered region, from REFNIS
  const key = { VLG: 'flanders', BRU: 'brussels', WAL: 'wallonia' };
  for (const reg of kaart.coverage) {
    const official = [...refnis.values()].filter(r => r.region === key[reg]).length;
    const drawn = kaart.municipalities.filter(m => m.region === reg).length;
    if (official !== drawn) errors.push(`${reg}: ${drawn} municipalities drawn, REFNIS lists ${official}`);
  }
  for (const [lang, route] of Object.entries(KAART_PAGES)) {
    const html = await readFile(path.join(ROOT, 'web', route, 'index.html'), 'utf8');
    if (applyList(html, kaart, lang) !== html) errors.push(`${route}: municipality list is stale: run npm run build:kaart`);
  }
  const cached = await access(path.join(ROOT, '.cache/kaart/vrbg2025_refgemg10_3812.geojson')).then(() => true, () => false);
  if (rebuild && cached && !errors.length) {
    process.env.KAART_RETRIEVED = kaart.source.retrieved;
    const { buildKaart, serialize } = await import('./build_kaart.mjs');
    if (serialize(await buildKaart()) !== text) errors.push('kaart_be.json differs from a rebuild of the cached source: run npm run build:kaart');
  }
  return { errors, kaart, rebuilt: rebuild && cached };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, kaart, rebuilt } = await checkKaart();
  if (errors.length) { console.error('check:kaart failed:\n  ' + errors.join('\n  ')); process.exit(1); }
  console.log(`check:kaart ok: ${kaart.count} municipalities, coverage ${kaart.coverage.join(', ')}${rebuilt ? ', rebuilt from cache identically' : ' (no cached source: schema and hash only)'}`);
}
