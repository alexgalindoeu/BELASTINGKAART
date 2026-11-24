import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../params/', import.meta.url);
const years = (await readdir(root, { withFileTypes: true })).filter(x => x.isDirectory() && /^\d{4}$/.test(x.name));
const required = ['status:', 'jurisdiction:', 'income_year:', 'source_name:', 'source_url:', 'source_title:', 'retrieved_at:', 'unit:', 'rounding:', 'notes:'];
let errors = [];
for (const year of years) {
  for (const file of (await readdir(new URL(year.name + '/', root))).filter(x => x.endsWith('.yaml'))) {
    const content = await readFile(new URL(year.name + '/' + file, root), 'utf8');
    for (const field of required) if (!content.includes(field)) errors.push(year.name + '/' + file + ': missing ' + field);
    if (/status: confirmed/.test(content) && !/effective_from: \d{4}-\d{2}-\d{2}/.test(content)) {
      errors.push(year.name + '/' + file + ': confirmed parameter missing effective_from date');
    }
    if (/status: confirmed/.test(content) && !/source_url: https:\/\//.test(content)) {
      errors.push(year.name + '/' + file + ': confirmed parameter missing HTTPS source URL');
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Parameter provenance checks passed.');
}
