import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../params/', import.meta.url);
const years = (await readdir(root, { withFileTypes: true })).filter(x => x.isDirectory() && /^\d{4}$/.test(x.name));
const allowedHosts = new Set([
  'fin.belgium.be','finances.belgium.be','finances.belgium.fr',
  'socialsecurity.be','vlaanderen.be','belasting.vlaanderen.be',
  'fiscaliteit.brussels','finances.wallonie.be','ejustice.just.fgov.be',
  'statbel.fgov.be','emploi.belgique.be','werk.belgie.be'
]);
const required = ['status:', 'jurisdiction:', 'income_year:', 'source_name:',
  'source_url:', 'source_title:', 'retrieved_at:', 'unit:', 'rounding:', 'notes:'];
const errors = [];
for (const year of years) {
  for (const file of (await readdir(new URL(year.name + '/', root))).filter(x => x.endsWith('.yaml'))) {
    const path = year.name + '/' + file;
    const content = await readFile(new URL(path, root), 'utf8');
    for (const field of required) {
      if (!content.includes(field)) errors.push(path + ': missing ' + field);
    }
    const sourceUrls = [...content.matchAll(/^\s*source_url:\s*(https:\/\/[^\s#]+)\s*$/gm)].map(m => m[1]);
    for (const url of sourceUrls) {
      let host;
      try { host = new URL(url).hostname.toLowerCase(); }
      catch { errors.push(path + ': malformed source URL ' + url); continue; }
      const official = [...allowedHosts].some(domain => host === domain || host.endsWith('.' + domain));
      if (!official) errors.push(path + ': non-approved source domain ' + host);
    }
    const confirmedBlocks = [...content.matchAll(/(^[\w-]+:\n(?:[ \t]+.*\n)*)/gm)].map(m => m[0])
      .filter(block => /status:\s*confirmed/.test(block));
    if (/status:\s*confirmed/.test(content) && !/effective_from:\s*\d{4}-\d{2}-\d{2}/.test(content)) {
      errors.push(path + ': confirmed parameter missing effective_from date');
    }
    if (/status:\s*confirmed/.test(content) && sourceUrls.length === 0) {
      errors.push(path + ': confirmed parameter missing official HTTPS source URL');
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Parameter provenance checks passed (official domains only).');
}
