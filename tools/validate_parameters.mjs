// Validate provenance of every parameter in the generated browser dataset.
// web/data/parameters.json is generated from params/<year>/*.yaml by
// tools/export_parameters.R; the R export check guarantees it matches YAML.
// Mirrors validate_parameter_provenance() and official_source_host() in R/00_utils.R.
import { readFile } from 'node:fs/promises';

const REQUIRED = ['status', 'jurisdiction', 'income_year', 'source_name', 'source_url',
  'source_title', 'retrieved_at', 'unit', 'rounding', 'notes'];
const STATUSES = ['confirmed', 'provisional', 'pending'];
const ALLOWED_HOSTS = ['fin.belgium.be', 'finances.belgium.be', 'minfin.fgov.be',
  'socialsecurity.be', 'vlaanderen.be', 'belasting.vlaanderen.be',
  'fiscaliteit.brussels', 'finances.wallonie.be', 'ejustice.just.fgov.be',
  'statbel.fgov.be', 'emploi.belgique.be', 'werk.belgie.be'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const file = process.argv[2] ?? new URL('../web/data/parameters.json', import.meta.url);
const data = JSON.parse(await readFile(file, 'utf8'));
const errors = [];
let count = 0;

function officialHost(url) {
  if (typeof url !== 'string') return null;
  let parsed;
  try { parsed = new URL(url); } catch { return null; }
  if (parsed.protocol !== 'https:') return null;
  const host = parsed.hostname.toLowerCase();
  return ALLOWED_HOSTS.some(domain => host === domain || host.endsWith('.' + domain))
    ? host : null;
}

function checkParameter(parameter, path) {
  count++;
  for (const key of REQUIRED) {
    if (parameter[key] === undefined || parameter[key] === null || parameter[key] === '') {
      errors.push(path + ': missing ' + key);
    }
  }
  if (!STATUSES.includes(parameter.status)) {
    errors.push(path + ': invalid status ' + String(parameter.status));
  }

  for (const [key, value] of Object.entries(parameter)) {
    if (key.endsWith('_url') && value !== null && !officialHost(value)) {
      errors.push(path + ': ' + key + ' is not HTTPS on an official-source domain (' + value + ')');
    }
  }

  if (parameter.retrieved_at !== undefined && !DATE.test(String(parameter.retrieved_at))) {
    errors.push(path + ': retrieved_at must be YYYY-MM-DD');
  }
  if (parameter.income_year !== undefined && parameter.income_year !== data.income_year) {
    errors.push(path + ': income_year differs from dataset income_year');
  }
  if (parameter.effective_to !== null && parameter.effective_to !== undefined &&
      !DATE.test(String(parameter.effective_to))) {
    errors.push(path + ': effective_to must be YYYY-MM-DD or null');
  }

  if (parameter.status === 'confirmed') {
    if (!DATE.test(String(parameter.effective_from ?? ''))) {
      errors.push(path + ': confirmed parameter needs effective_from');
    }
    if (parameter.value === null || parameter.value === undefined) {
      errors.push(path + ': confirmed parameter has no value');
    }
  }
  if (parameter.status === 'pending' && parameter.value !== null && parameter.value !== undefined) {
    errors.push(path + ': pending parameter must not carry a value');
  }
}

// A parameter is any object carrying both a status and a source_url.
function walk(node, path) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return;
  if (Object.hasOwn(node, 'status') && Object.hasOwn(node, 'source_url')) {
    checkParameter(node, path);
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    walk(value, path ? path + '.' + key : key);
  }
}

for (const section of ['federal', 'social_security', 'payroll']) {
  if (!data[section]) errors.push('missing section ' + section);
  else walk(data[section], section);
}
if (count === 0) errors.push('no parameters found');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Parameter provenance checks passed (' + count + ' parameters).');
}
