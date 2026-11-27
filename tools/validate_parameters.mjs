// Validate provenance of every parameter in the generated browser dataset.
// web/data/parameters.json is generated from params/<year>/*.yaml by
// tools/export_parameters.R, and `Rscript tools/export_parameters.R --check`
// guarantees it is in sync, so checking the JSON checks the YAML.
// Mirrors validate_parameter_provenance() and official_source_host() in R/00_utils.R.
import { readFile } from 'node:fs/promises';

const REQUIRED = ['status', 'jurisdiction', 'income_year', 'source_name', 'source_url',
  'source_title', 'retrieved_at', 'unit', 'rounding', 'notes'];
const STATUSES = ['confirmed', 'provisional', 'pending'];
const ALLOWED_HOSTS = ['fin.belgium.be', 'finances.belgium.be', 'minfin.fgov.be',
  'socialsecurity.be', 'vlaanderen.be', 'belasting.vlaanderen.be',
  'fiscaliteit.brussels', 'finances.wallonie.be', 'ejustice.just.fgov.be',
  'statbel.fgov.be', 'emploi.belgique.be', 'werk.belgie.be', 'rsvz.be', 'inasti.be'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const file = process.argv[2] ?? new URL('../web/data/parameters.json', import.meta.url);
const data = JSON.parse(await readFile(file, 'utf8'));
const errors = [];
let count = 0;

function officialHost(url) {
  if (typeof url !== 'string') return null;
  let parsed;
  try { parsed = new URL(url); } catch { return null; } // malformed URL: reject, don't crash
  if (parsed.protocol !== 'https:') return null;
  const host = parsed.hostname.toLowerCase();
  return ALLOWED_HOSTS.some(a => host === a || host.endsWith('.' + a)) ? host : null;
}

function checkParameter(p, path) {
  count++;
  for (const k of REQUIRED)
    if (p[k] === undefined || p[k] === null || p[k] === '') errors.push(`${path}: missing ${k}`);
  if (!STATUSES.includes(p.status)) errors.push(`${path}: invalid status '${p.status}'`);
  for (const [k, v] of Object.entries(p))
    if (k.endsWith('_url') && v !== null && !officialHost(v))
      errors.push(`${path}: ${k} is not HTTPS on an official-source domain (${v})`);
  if (p.retrieved_at !== undefined && !DATE.test(String(p.retrieved_at)))
    errors.push(`${path}: retrieved_at must be YYYY-MM-DD`);
  if (p.income_year !== undefined && p.income_year !== data.income_year)
    errors.push(`${path}: income_year ${p.income_year} differs from dataset ${data.income_year}`);
  if (p.effective_to != null && !DATE.test(String(p.effective_to)))
    errors.push(`${path}: effective_to must be YYYY-MM-DD or null`);
  if (p.effective_from != null && p.effective_to != null && String(p.effective_to) < String(p.effective_from))
    errors.push(`${path}: effective_to precedes effective_from`);
  if (p.status === 'confirmed') {
    if (!DATE.test(String(p.effective_from ?? ''))) errors.push(`${path}: confirmed parameter needs effective_from`);
    if (p.value === null || p.value === undefined) errors.push(`${path}: confirmed parameter has no value`);
  }
  if (p.status === 'pending' && p.value !== null && p.value !== undefined)
    errors.push(`${path}: pending parameter must not carry a value`);
}

// A parameter is any object carrying a `status` and a `source_url`.
function walk(node, path) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return;
  if ('status' in node && 'source_url' in node) return checkParameter(node, path);
  for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
}

for (const section of ['federal', 'social_security', 'payroll', 'zelfstandigen', 'pensioensparen', 'wonen']) {
  if (!data[section]) errors.push(`missing section ${section}`);
  else walk(data[section], section);
}
if (count === 0) errors.push('no parameters found');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Parameter provenance checks passed (${count} parameters).`);
}
