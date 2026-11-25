import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));
const bb = data.payroll.special_social_security_contribution;

test('special contribution: Q1-Q3 2026 confirmed from the RSZ version of each quarter, Q4 pending', () => {
  assert.deepEqual(Object.keys(bb.periods), ['2026_q1', '2026_q2', '2026_q3', '2026_q4']);
  const versions = { '2026_q1': '/nl/2026-1/', '2026_q2': '/nl/2026-2/', '2026_q3': '/nl/latest/' };
  for (const [k, v] of Object.entries(versions)) {
    assert.equal(bb.periods[k].status, 'confirmed', k);
    assert.ok(bb.periods[k].source_url.includes(v), k);
  }
  assert.equal(bb.periods['2026_q4'].status, 'pending');
  assert.equal(bb.periods['2026_q4'].value, null);
  assert.equal(bb.method.status, 'provisional');
});

test('special contribution: published quarterly bands match the RSZ text', () => {
  const q = bb.periods['2026_q3'].value.quarterly;
  assert.deepEqual(q.joint_spouse_with_income.map(b => [b.q_from, b.fixed, b.rate ?? null, b.maximum ?? null]),
    [[3285.29, 15.45, null, null], [5836.14, 0, 0.059, null], [6570.54, 43.32, 0.011, 154.92]]);
  assert.deepEqual(q.joint_spouse_without_income.map(b => [b.q_from, b.fixed, b.rate ?? null, b.maximum ?? null]),
    [[5836.14, 0, 0.059, null], [6570.54, 43.32, 0.011, 182.82]]);
  assert.deepEqual(q.individual.map(b => [b.q_from, b.fixed, b.rate ?? null]),
    [[5836.14, 0, 0.0422], [6570.54, 30.99, 0.011], [11211, 82.05, 0.0338], [12300, 118.83, 0.011], [18116.46, 182.82, null]]);
  // Q1-Q3 schedules are identical (the RSZ text did not change between versions).
  assert.deepEqual(bb.periods['2026_q1'].value, bb.periods['2026_q3'].value);
  assert.deepEqual(bb.periods['2026_q2'].value, bb.periods['2026_q3'].value);
});

test('special contribution: quarterly limits are three times the monthly limits (basis of the open interpretation)', () => {
  const close = (a, b) => assert.ok(Math.abs(a - b) < 0.011, `${a} vs ${b}`);
  for (const bands of Object.values(bb.periods['2026_q3'].value.quarterly))
    for (const b of bands) if (b.rate_above_monthly && b.q_from > 5000) close(b.q_from, 3 * b.rate_above_monthly);
  const adv = bb.periods['2026_q3'].value.monthly_advance.joint_spouse_with_income;
  const quarterly = bb.periods['2026_q3'].value.quarterly.joint_spouse_with_income;
  close(quarterly[0].fixed, 3 * adv[0].fixed);          // 15.45 = 3 x 5.15
  close(quarterly[2].fixed, 3 * adv[2].fixed);          // 43.32 = 3 x 14.44
  close(quarterly[2].maximum, 3 * adv[2].maximum);      // 154.92 = 3 x 51.64
  // Band continuity holds only if the rate is applied to the quarterly excess (3 x monthly):
  close(0.059 * (6570.54 - 5836.14), 43.32);
  assert.equal(bb.method.value.rate_base_interpretation, null, 'interpretation must stay open until the legal text is checked');
});
