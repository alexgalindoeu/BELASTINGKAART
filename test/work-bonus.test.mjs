import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../web/js/tax-engine.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const wbEngine = context.window.BKTaxEngine.workBonus;
const fx = JSON.parse(await readFile(new URL('./fixtures/work_bonus_cases.json', import.meta.url), 'utf8'));
const data = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));
const wb = data.social_security.employee_contribution.work_bonus;
const periodFor = key => key === 'hist' ? fx.historical_2001_period : { ...wb.periods[key], key };
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} != ${b}`);

test('JS work bonus matches the shared R/JS fixture (incl. official RSZ examples)', () => {
  for (const c of fx.cases) {
    const ref = wbEngine.referenceWage(c.wage);
    const m = wbEngine.month(periodFor(c.period), ref.S, ref.fraction, c.category, c.contribution_due);
    close(ref.S, c.expected.S, c.name + ' S');
    close(ref.fraction, c.expected.fraction, c.name + ' fraction');
    for (const k of ['RA', 'RB', 'PA', 'PB', 'P']) close(m[k], c.expected[k], c.name + ' ' + k);
  }
});

test('the period in force is selected by date and Q4 2026 blocks', () => {
  for (const s of fx.period_selection) assert.equal(wbEngine.period(wb, s.date).key, s.key, s.date);
  assert.equal(wbEngine.period(wb, '2026-11-15').status, 'pending');
  assert.throws(() => wbEngine.month(wbEngine.period(wb, '2026-11-15'), 2000, 1, 'bedienden', 261.4), /not available/);
  assert.throws(() => wbEngine.period(wb, '2025-12-31'), /No work-bonus period/);
  assert.throws(() => wbEngine.period(wb, '2027-01-01'), /No work-bonus period/);
});

test('work bonus is not usable in a public result yet', () => {
  assert.equal(wbEngine.isConfirmed(wb), false);
  assert.equal(wb.method.status, 'provisional');
  assert.equal(context.window.BKTaxEngine.calculate().status, 'blocked');
});

test('published 2026 periods are confirmed Jan-Sep with RSZ sources', () => {
  const keys = Object.keys(wb.periods);
  assert.deepEqual(keys, ['2026_01', '2026_03', '2026_04', '2026_07', '2026_09', '2026_10']);
  for (const k of keys.slice(0, 5)) {
    assert.equal(wb.periods[k].status, 'confirmed', k);
    assert.match(wb.periods[k].source_url, /^https:\/\/www\.socialsecurity\.be\//);
  }
  assert.equal(wb.periods['2026_10'].value, null);
});

test('invalid inputs are rejected', () => {
  assert.throws(() => wbEngine.referenceWage({ W: 2000, regime: 'full_time', J: 23, D: 22 }), /J <= D/);
  assert.throws(() => wbEngine.referenceWage({ W: 2000, regime: 'part_time', H: 0, U: 160 }), /H > 0/);
  assert.throws(() => wbEngine.basicAmount(2000, wb.periods['2026_09'].value.luik_a, 'kunstenaars'), /Unknown/);
});
