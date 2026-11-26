import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Shared R/JS fixture. Expected values: independent exact-decimal computation from
// params/2026/payroll.yaml, transcribed from Fisconet (Bijlage III KB/WIB 92 and the
// sleutelformules of 1 January and 1 November 2026), 2026-11-25.
const source = await readFile(new URL('../web/js/tax-engine.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const engine = context.window.BKTaxEngine;
const bv = engine.withholding;
const fx = JSON.parse(await readFile(new URL('./fixtures/bedrijfsvoorheffing_cases.json', import.meta.url), 'utf8'));
const data = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));
const payroll = data.payroll;
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} != ${b}`);

test('JS engine matches every fixture case to the cent, step by step', () => {
  assert.ok(fx.cases.length >= 90);
  for (const c of fx.cases) {
    const r = bv.calculate(c.input, payroll);
    assert.equal(r.status, c.expected_status ?? 'confirmed', c.name);
    if (r.status === 'confirmed') {
      assert.equal(r.period, c.period, c.name);
      const sv = Object.fromEntries(r.steps.map(s => [s.id, s.value]));
      for (const [k, e] of Object.entries(c.expected)) close(sv[k], e, `${c.name} ${k}`);
      close(r.withholding, c.expected.withholding, c.name);
    } else {
      assert.equal(r.withholding, null);
      assert.ok(r.missing.length > 0);
    }
  }
});

test('the engine blocks when the method or the period is not confirmed', () => {
  const p = structuredClone(payroll);
  p.professional_withholding.periods['2026_11'].status = 'provisional';
  assert.equal(bv.calculate({ pay_date: '2026-11-25', gross_monthly: 3000 }, p).status, 'blocked');
  assert.equal(bv.calculate({ pay_date: '2026-03-15', gross_monthly: 3000 }, p).status, 'confirmed');
  p.professional_withholding.method.status = 'pending';
  assert.equal(bv.calculate({ pay_date: '2026-03-15', gross_monthly: 3000 }, p).status, 'blocked');
  assert.equal(bv.calculate({ pay_date: '2027-01-01', gross_monthly: 3000 }, payroll).status, 'blocked');
});

test('the period is chosen by payment date; luik B is 63 pct from August', () => {
  const w = payroll.professional_withholding;
  assert.equal(bv.period(w, '2026-07-31').key, '2026_01');
  assert.equal(bv.period(w, '2026-08-01').key, '2026_08');
  assert.equal(bv.period(w, '2026-11-01').key, '2026_11');
  assert.equal(bv.period(w, '2026-08-01').value.work_bonus_reduction.luik_b, 0.63);
  assert.throws(() => bv.period(w, '2025-12-31'), /No withholding period/);
});

test('inconsistent inputs are rejected', () => {
  const v = payroll.professional_withholding.periods['2026_01'].value;
  assert.throws(() => bv.compute({ gross_monthly: 3000, spouse_situation: 'married' }, v), /Unknown spouse_situation/);
  assert.throws(() => bv.compute({ gross_monthly: 3000, single_parent: true }, v), /single_parent/);
  assert.throws(() => bv.compute({ gross_monthly: 3000, spouse_disabled: true }, v), /spouse_disabled/);
  assert.throws(() => bv.compute({ gross_monthly: 3000, children: 1, children_disabled: 2 }, v), /children_disabled/);
  assert.throws(() => bv.compute({ gross_monthly: 3000, children: 1.5 }, v), /integer/);
  assert.throws(() => bv.compute({ gross_monthly: 100, social_contributions: 200 }, v), /exceed/);
  assert.throws(() => bv.compute({ gross_monthly: -1 }, v), /non-negative/);
});

test('the public net-salary calculation stays blocked', () => {
  assert.equal(engine.calculate().status, 'blocked');
  assert.equal(payroll.professional_withholding.status, undefined);
});
