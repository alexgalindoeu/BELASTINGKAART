#!/usr/bin/env node
// Builds web/data/gemeenten.json from the official Statbel REFNIS nomenclature.
//
// Sources (Statbel, Algemene Directie Statistiek - Statistics Belgium):
//   - page: https://statbel.fgov.be/nl/over-statbel/methodologie/classificaties/geografie
//     (states the number of municipalities and lists the 2024/2025 mergers)
//   - file: REFNIS_2025.csv linked from that page ("Nomenclatuur geldig vanaf 1/01/2025")
//
// Usage:
//   node tools/build_gemeenten.mjs            download and write web/data/gemeenten.json
//   node tools/build_gemeenten.mjs --check    download and fail if the committed JSON differs
//                                             (ignores the retrieval date)
//   node tools/build_gemeenten.mjs --offline <dir>
//                                             use <dir>/geografie.html and <dir>/REFNIS_2025.csv
//                                             instead of downloading (same parsing and checks)
// Behind an HTTPS proxy, Node's fetch needs NODE_USE_ENV_PROXY=1 (Node >= 22.21).
//
// No name is typed in by hand: every name and code comes from the downloaded files.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = path.join(ROOT, 'web/data/gemeenten.json');
const PAGE_URL = 'https://statbel.fgov.be/nl/over-statbel/methodologie/classificaties/geografie';
const FILE_NAME = 'REFNIS_2025.csv';
const FILE_URL = 'https://statbel.fgov.be/sites/default/files/Over_Statbel_FR/Nomenclaturen/' + FILE_NAME;
const PUBLISHER = 'Statbel (Algemene Directie Statistiek - Statistics Belgium)';

// NIS structure (Statbel): regions 0x000, provinces x0000 (Brabant: 20001/20002),
// arrondissements xy000, municipalities have a language code in the file.
const REGIONS = { '02000': 'flanders', '03000': 'wallonia', '04000': 'brussels' };
const isProvince = code => /^[1-9]0000$/.test(code) || code === '20001' || code === '20002';
const LANGUAGES = { N: ['nl'], F: ['fr'], D: ['de'], FN: ['fr', 'nl'], NF: ['nl', 'fr'] };

function fail(message) { throw new Error('build_gemeenten: ' + message); }

async function download(url) {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) fail(`${url} returned HTTP ${response.status}`);
  const body = Buffer.from(await response.arrayBuffer());
  const text = body.toString('utf8');
  // Statbel sometimes answers automated clients with a JavaScript challenge page. Never try to
  // solve it: stop and let a person download the files (then use --offline).
  if (/\/TSPD\//.test(text) && /<html/i.test(text)) fail(`${url} answered with a bot challenge; use --offline`);
  return { body, lastModified: response.headers.get('last-modified') };
}

const decodeEntities = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const pageText = html => decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

export function parsePage(html) {
  const text = pageText(html);
  const count = text.match(/Nomenclatuur geldig vanaf (1\/01\/2025) \((\d+) gemeenten\)/);
  if (!count) fail('official municipality count not found on the Statbel page');
  const section = html.match(/NIS-codes van de nieuwe gemeenten door fusies[\s\S]*?<\/table>/);
  if (!section) fail('merger table not found on the Statbel page');
  const mergers = [];
  let effective = null;
  for (const row of section[0].matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const cells = Array.from(row[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g), m => pageText(m[1]).trim());
    const date = cells.length === 1 && cells[0].match(/^Vanaf (\d{2})\/(\d{2})\/(\d{4})$/);
    if (date) { effective = `${date[3]}-${date[2]}-${date[1]}`; continue; }
    if (cells.length !== 2 || cells[0] === 'Fuserende gemeenten') continue;
    const parts = s => s.split(' + ').map(p => {
      const m = p.trim().match(/^(.+) \((\d{5})\)$/);
      if (!m) fail('unexpected merger cell: ' + p);
      return { nis: m[2], name: m[1] };
    });
    const created = parts(cells[1]);
    if (created.length !== 1 || !effective) fail('unexpected merger row: ' + cells.join(' | '));
    mergers.push({ effective_from: effective, new: created[0], merged: parts(cells[0]), text: cells.join(' → ') });
  }
  const flemish = text.match(/(\d+) Vlaamse gemeenten zullen fuseren op 1 januari 2025/);
  return {
    statement: count[0], referenceDate: '2025-01-01', officialCount: Number(count[2]), mergers,
    flemishMergingCount: flemish ? Number(flemish[1]) : null
  };
}

export function parseRefnis(csv) {
  const lines = csv.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
  const header = lines.shift().split('|');
  const expected = ['Code INS', 'Entités administratives', 'Langue', 'Code NIS', 'Administratieve eenheden', 'Taal'];
  expected.forEach((h, i) => { if (header[i] !== h) fail(`unexpected column ${i}: ${header[i]}`); });
  const regions = {}, provinces = [], arrondissements = [], municipalities = [];
  let region = null, province = null, arrondissement = null;
  for (const line of lines) {
    const [codeFr, nameFr, langFr, codeNl, nameNl, langNl] = line.split('|');
    if (!/^\d{5}$/.test(codeFr) || codeFr !== codeNl) fail('inconsistent codes in line: ' + line);
    const code = codeFr;
    if (!langFr) {
      if (code === '01000') continue; // the Kingdom
      if (REGIONS[code]) {
        region = REGIONS[code]; province = null; arrondissement = null;
        regions[region] = { nis: code, name_fr: nameFr, name_nl: nameNl };
      } else if (isProvince(code)) {
        province = code; arrondissement = null;
        provinces.push({ nis: code, region, name_fr: nameFr, name_nl: nameNl });
      } else {
        arrondissement = code;
        arrondissements.push({ nis: code, region, province_nis: province, name_fr: nameFr, name_nl: nameNl });
      }
      continue;
    }
    if (!region || !arrondissement) fail('municipality outside a region/arrondissement: ' + line);
    const languages = LANGUAGES[langFr];
    if (!languages || !LANGUAGES[langNl]) fail('unknown language code in line: ' + line);
    municipalities.push({
      nis: code,
      name_nl: nameNl,
      name_fr: nameFr,
      language: langFr,
      official_languages: languages,
      bilingual: languages.length === 2,
      region,
      province_nis: province,
      arrondissement_nis: arrondissement,
      merger: null
    });
  }
  return { regions, provinces, arrondissements, municipalities };
}

export function build({ page, csv, csvSha256, lastModified, retrieved }) {
  const meta = parsePage(page);
  const data = parseRefnis(csv);
  const byNis = new Map(data.municipalities.map(m => [m.nis, m]));
  if (byNis.size !== data.municipalities.length) fail('duplicate NIS codes');
  if (data.municipalities.length !== meta.officialCount)
    fail(`file has ${data.municipalities.length} municipalities, Statbel states ${meta.officialCount}`);
  for (const merger of meta.mergers) {
    const target = byNis.get(merger.new.nis);
    if (!target) fail('merged municipality missing from the file: ' + merger.text);
    for (const old of merger.merged)
      if (old.nis !== merger.new.nis && byNis.has(old.nis)) fail('former municipality still listed: ' + old.nis);
    target.merger = { effective_from: merger.effective_from, merged_from: merger.merged.map(m => m.nis) };
  }
  const flemish = meta.mergers.filter(m => m.effective_from === '2025-01-01')
    .reduce((n, m) => n + m.merged.length, 0);
  if (meta.flemishMergingCount !== null && flemish !== meta.flemishMergingCount)
    fail(`merger table lists ${flemish} Flemish municipalities, the text states ${meta.flemishMergingCount}`);
  return {
    schema_version: 1,
    source: {
      publisher: PUBLISHER,
      page_url: PAGE_URL,
      file_url: FILE_URL,
      file_name: FILE_NAME,
      file_last_modified: lastModified || null,
      file_sha256: csvSha256,
      retrieved,
      statement: meta.statement,
      reference_date: meta.referenceDate,
      official_count: meta.officialCount,
      record_count: data.municipalities.length,
      generator: 'tools/build_gemeenten.mjs',
      note: 'Generated file. Do not edit by hand; run node tools/build_gemeenten.mjs.'
    },
    regions: data.regions,
    provinces: data.provinces,
    arrondissements: data.arrondissements,
    mergers: meta.mergers,
    municipalities: data.municipalities
  };
}

async function main(args) {
  let page, csvBody, lastModified;
  const offline = args.indexOf('--offline');
  if (offline >= 0) {
    const dir = args[offline + 1] || fail('--offline needs a directory');
    page = await readFile(path.join(dir, 'geografie.html'), 'utf8');
    csvBody = await readFile(path.join(dir, FILE_NAME));
  } else {
    page = (await download(PAGE_URL)).body.toString('utf8');
    const file = await download(FILE_URL);
    csvBody = file.body; lastModified = file.lastModified;
  }
  const retrieved = new Date().toISOString().slice(0, 10);
  const json = build({
    page, csv: csvBody.toString('utf8'), lastModified, retrieved,
    csvSha256: createHash('sha256').update(csvBody).digest('hex')
  });
  const text = JSON.stringify(json, null, 1) + '\n';
  if (args.includes('--check')) {
    const committed = JSON.parse(await readFile(OUT, 'utf8'));
    const strip = o => JSON.stringify({ ...o, source: { ...o.source, retrieved: null, file_last_modified: null } });
    if (strip(committed) !== strip(json)) fail('web/data/gemeenten.json differs from the official file; regenerate it');
    console.log(`gemeenten.json matches ${FILE_NAME} (${json.source.record_count} municipalities)`);
    return;
  }
  await writeFile(OUT, text);
  console.log(`wrote ${path.relative(ROOT, OUT)}: ${json.source.record_count} municipalities (official: ${json.source.official_count})`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exit(1); });
}
