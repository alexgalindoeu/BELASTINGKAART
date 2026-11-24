import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../params/', import.meta.url);
const years = (await readdir(root, { withFileTypes: true }))
  .filter(entry => entry.isDirectory() && /^\\d{4}$/.test(entry.name));
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

function parseScalar(line) {
  const match = line.match(/^\\s*([\\w-]+):\\s*(.*?)\\s*$/);
  return match ? { key: match[1], value: match[2].replace(/^['"]|['"]$/g, '') } : null;
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
  const lines = content.split(/\\r?\\n/);
  const starts = [];
  for (let i=0;i<lines.length;i++) {
    const match = lines[i].match(/^(  )(?! )(\\w[\\w-]*):\\s*$/);
    if (match) starts.push({ key: match[2], start: i, indent: 2 });
  }
  return starts.map((item,index) => {
    const end = index+1<starts.length ? starts[index+1].start : lines.length;
    const blockLines = lines.slice(item.start+1,end);
    const fields = new Map();
    for (const line of blockLines) {
      const parsed = parseScalar(line);
      if (parsed) fields.set(parsed.key,parsed.value);
    }
    return { ...item, fields };
  });
}
for (const year of years) {
  const dir = new URL(year.name + '/', root);
  const files = (await readdir(dir)).filter(file => file.endsWith('.yaml'));
  for (const file of files) {
    const path = year.name + '/' + file;
    const content = await readFile(new URL(file,dir),'utf8');
    const blocks = parameterBlocks(content);
    if (!blocks.length) errors.push(path + ': no parameter blocks found');
    for (const block of blocks) {
      const label = path + ':' + block.key;
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
      if (retrieved && !/^\\d{4}-\\d{2}-\\d{2}$/.test(retrieved)) {
        errors.push(label + ': retrieved_at must be YYYY-MM-DD');
      }
      const sourceUrl = block.fields.get('source_url');
      if (sourceUrl && sourceUrl !== 'null') isOfficialUrl(sourceUrl,path,'source_url');
      for (const [key,value] of block.fields) {
        if (key.endsWith('_url') && key !== 'source_url' && value && value !== 'null') {
          isOfficialUrl(value,path,key);
        }
      }
      if (status === 'confirmed') {
        const from = block.fields.get('effective_from');
        if (!from || !/^\\d{4}-\\d{2}-\\d{2}$/.test(from)) {
          errors.push(label + ': confirmed parameter requires effective_from YYYY-MM-DD');
        }
        if (!sourceUrl || sourceUrl === 'null') errors.push(label + ': confirmed parameter requires source_url');
      }
      const to = block.fields.get('effective_to');
      if (to && to !== 'null' && !/^\\d{4}-\\d{2}-\\d{2}$/.test(to)) {
        errors.push(label + ': effective_to must be a date or null');
      }
    }
  }
}
if (errors.length) {
  console.error(errors.join('\\n'));
  process.exitCode = 1;
} else {
  console.log('Parameter provenance checks passed for every parameter block (official HTTPS domains only).');
}
