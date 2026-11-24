import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const yaml = await readFile(new URL('../params/2026/social_security.yaml', import.meta.url), 'utf8');
const data = JSON.parse(await readFile(new URL('../data/parameters.json', import.meta.url), 'utf8'));

test('2026 social-security rate is sourced but remains provisional for year-specific use', () => {
  assert.match(yaml, /value: 0\.1307/);
  assert.match(yaml, /status: provisional/);
  assert.match(yaml, /socialsecurity\.be/);
  assert.match(yaml, /work_bonus:[\s\S]*status: pending/);
});

test('federal 2026 brackets and basic allowance have official provenance', () => {
  const brackets = data.federal.personal_income_tax.brackets;
  assert.deepEqual(brackets.value.map(x => [x.upper, x.rate]), [
    [16720, 0.25], [29510, 0.4], [51070, 0.45], [null, 0.5]
  ]);
  assert.equal(data.federal.personal_income_tax.basic_personal_tax_allowance.value, 11550);
  assert.equal(brackets.income_year, 2026);
  assert.equal(brackets.assessment_year, 2027);
  assert.match(brackets.source_url, /^https:\/\//);
});

test('a full net salary result remains blocked', () => {
  assert.equal(data.calculation_status, 'blocked_until_all_required_parameters_confirmed');
});
