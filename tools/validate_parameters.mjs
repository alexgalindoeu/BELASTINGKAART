import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../params/', import.meta.url);
const years = (await readdir(root, { withFileTypes: true }))
  .filter(entry => entry.isDirectory() && /^\d{4}$/.test(entry.name));
const allowedHosts = [
  'fin.belgium.be','finances.belgium.be','socialsecurity.be',
  'vlaanderen.be','belasting.vlaanderen.be','fiscaliteit.brussels',
  'finances.wallonie.be','ejustice.just.fgov.be','statbel.fgov.be',
  'emploi.belgique.be','werk.belgie.be','minfin.fgov.be'
];
const required = [
  'status','jurisdiction','income_year','source_name','source_url',
  'source_title','retrieved_at','unit','rounding','notes'
];
const errors = [];

function parseMapping(line) {
  const match = line.match(/^(\s*)([\w-]+):(?:\s*(.*))?$/);
  if (!match) return null;
  return { indent: match[1].length, key: match[2], value: (match[3] || '').trim() };
}

function isOfficialUrl(raw, path, key) {
  let parsed;
  try { parsed = new URL(raw); }
  catch { errors.push(path + ': malformed ' + key + ' URL: ' + raw); return; }
  if (parsed.protocol !== 'https:') {
    errors.push(path + ': ' + key + ' must use HTTPS: ' + raw);
    return;
  }
  const host = parsed.hostname.toLowerCase();
  if (!allowedHosts.some(domain => host === domain || host.endsWith('.' + domain))) {
    errors.push(path + ': non-approved ' + key + ' domain: ' + host);
  }
}

function parameterBlocks(content) {
  const lines = content.split(/\r?\n/);
  const mappings = lines.map((line, index) => ({ ...parseMapping(line), index }))
    .filter(item => item.key);
  const blocks = [];

  for (const statusLine of mappings.filter(item => item.key === 'status')) {
    const parentIndent = statusLine.indent - 2;
    if (parentIndent < 0) continue;
    const parent = mappings
      .filter(item => item.index < statusLine.index && item.indent === parentIndent && item.value === '')
      .at(-1);
    if (!parent || parent.key === 'meta') continue;

    const siblings = mappings.filter(item =>
      item.index >= parent.index && item.indent === statusLine.indent
    );
    const nextSibling = siblings.find(item => item.index > statusLine.index);
    const end = nextSibling ? nextSibling.index : lines.length;
    const fields = new Map();
    for (const item of mappings) {
      if (item.index >= parent.index && item.index < end && item.indent === statusLine.indent) {
        fields.set(item.key, item.value);
      }
    }
    blocks.push({ key: parent.key, fields, line: parent.index + 1 });
  }
  return blocks;
}

for (const year of years) {
  const dir = new URL(year.name + '/', root);
  const files = (await readdir(dir)).filter(file => file.endsWith('.yaml'));
  for (const file of files) {
    const path = year.name + '/' + file;
    const content = await readFile(new URL(file, dir), 'utf8');
    const blocks = parameterBlocks(content);
    if (!blocks.length) errors.push(path + ': no parameter blocks found');

    for (const block of blocks) {
      const label = path + ':' + block.key + ' (line ' + block.line + ')';
      for (const field of required) {
        if (!block.fields.has(field) || block.fields.get(field) === '') {
          errors.push(label + ': missing ' + field);
        }
      }

      const status = block.fields.get('status');
      if (status && !['confirmed','provisional','pending','partial'].includes(status)) {
        errors.push(label + ': invalid status ' + status);
      }

      const incomeYear = block.fields.get('income_year');
      if (incomeYear && incomeYear !== 'null' && Number(incomeYear) !== Number(year.name)) {
        errors.push(label + ': income_year does not match directory ' + year.name);
      }

      const retrieved = block.fields.get('retrieved_at');
      if (retrieved && !/^\d{4}-\d{2}-\d{2}$/.test(retrieved)) {
        errors.push(label + ': retrieved_at must be YYYY-MM-DD');
      }

      const sourceUrl = block.fields.get('source_url');
      if (sourceUrl && sourceUrl !== 'null') isOfficialUrl(sourceUrl, path, 'source_url');
      for (const [key, value] of block.fields) {
        if (key.endsWith('_url') && key !== 'source_url' && value && value !== 'null') {
          isOfficialUrl(value, path, key);
        }
      }

      if (status === 'confirmed') {
        const from = block.fields.get('effective_from');
        if (!from || !/^\d{4}-\d{2}-\d{2}$/.test(from)) {
          errors.push(label + ': confirmed parameter requires effective_from YYYY-MM-DD');
        }
        if (!sourceUrl || sourceUrl === 'null') {
          errors.push(label + ': confirmed parameter requires source_url');
        }
      }

      const to = block.fields.get('effective_to');
      if (to && to !== 'null' && !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
        errors.push(label + ': effective_to must be a date or null');
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Parameter provenance checks passed for every parameter block (official HTTPS domains only).');
}
