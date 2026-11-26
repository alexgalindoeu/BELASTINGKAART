import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../web/js/tax-engine.js', import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(source, context);
const pb = context.window.BKTaxEngine.personenbelasting;
const fx = JSON.parse(await readFile(new URL('./fixtures/personenbelasting_cases.json', import.meta.url), 'utf8'));
const real = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));
const sp = fx.synthetic_parameters;
const fed = sp.federal.personal_income_tax;
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} != ${b}`);

test('fixture parameters are labelled synthetic, not 2026', () => assert.equal(sp.label, 'synthetic, not 2026'));

test('net professional income: art. 23 § 2, 51 and 52, 7° (shared fixture)', () => {
  for (const c of fx.net_professional_income) {
    const r = pb.netProfessionalIncome(c.taxable_wages, c.social_contributions, sp.payroll.professional_expenses);
    for (const k of Object.keys(c.expected)) close(r[k], c.expected[k], `${c.name} ${k}`);
  }
  assert.throws(() => pb.netProfessionalIncome(100, 200, sp.payroll.professional_expenses), /exceed/);
  assert.throws(() => pb.netProfessionalIncome(100, 0, { status: 'pending', value: null }), /not officially confirmed/);
});

test('basic tax: art. 130 at bracket boundaries, no rounding', () => {
  for (const c of fx.basic_tax) close(pb.basicTax(c.base, fed.brackets), c.expected, 'base ' + c.base);
  assert.throws(() => pb.basicTax(-1, fed.brackets), /non-negative/);
});

test('tax-free sum: art. 131-132 (disabled count double, > 4 children)', () => {
  for (const c of fx.tax_free_sum) {
    const r = pb.taxFreeSum(c.person, sp.federal);
    for (const k of Object.keys(c.expected)) close(r[k], c.expected[k], `${c.name} ${k}`);
  }
  assert.throws(() => pb.taxFreeSum({ children: 1, children_disabled: 2 }, sp.federal), /cannot exceed/);
  assert.throws(() => pb.taxFreeSum({ children: 1.5 }, sp.federal), /integer/);
});

test('art. 134 § 2: own scale, several brackets, reduction capped at the tax', () => {
  for (const c of fx.reduction) {
    const r = pb.taxFreeSumReduction(c.basic_tax, c.tax_free_sum, fed.tax_on_tax_free_sum);
    for (const k of Object.keys(c.expected)) close(r[k], c.expected[k], `${c.name} ${k}`);
    assert.ok(r.tax_after_reduction >= 0);
  }
});

test('municipal surcharge: art. 466-468, one decimal, fails closed', () => {
  for (const c of fx.municipal) close(pb.municipalSurcharge(c.total_tax, { status: 'confirmed', value: c.rate }), c.expected, `${c.total_tax} ${c.rate}`);
  for (const r of fx.municipal_invalid_rates)
    assert.throws(() => pb.municipalSurcharge(1000, { status: 'confirmed', value: r }), /decimal|percentage/);
  assert.throws(() => pb.municipalSurcharge(1000, { status: 'pending', value: null }), /not officially confirmed/);
  assert.throws(() => pb.municipalSurcharge(1000, undefined), /not officially confirmed/);
});

test('not-modelled reductions report themselves', () => {
  const h = pb.notModelledReductions();
  assert.ok(h.every(x => x.status === 'not_modelled' && x.amount === null));
  assert.ok(h.some(x => x.id === 'fiscal_work_bonus_289ter'));
});

test('top-level with synthetic parameters: amounts match, status stays not_modelled', () => {
  for (const c of fx.full) {
    const r = pb.calculate(c.input, sp);
    assert.equal(r.status, c.expected_status);
    assert.equal(r.missing.length, 0);
    const am = Object.fromEntries(r.steps.map(s => [s.id, s.amount]));
    for (const k of Object.keys(c.expected_steps)) close(am[k], c.expected_steps[k], `${c.name} ${k}`);
    assert.equal(am.total_tax, null); assert.equal(am.municipal_surcharge, null);
    for (const s of r.steps) assert.ok(s.label_nl && s.label_fr && s.source);
  }
  assert.ok(pb.calculate({ ...fx.full[0].input, assessment: 'joint' }, sp).not_modelled.some(x => /joint/.test(x)));
});

test('top-level with the real 2026 parameters is blocked and shows no amount', () => {
  const r = pb.calculate({ taxable_wages: 40000, social_contributions: 5228, municipality: 'Leuven', children: 1 }, real);
  assert.equal(r.status, 'blocked');
  assert.ok(r.missing.some(m => /municipal surcharge rate/.test(m)));
  assert.ok(r.missing.some(m => /social-security rate/.test(m)));
  assert.ok(r.missing.some(m => /werkbonus/.test(m)));
  assert.ok(!r.missing.some(m => /art\. 130|art\. 131|art\. 132|art\. 134|professional expenses/.test(m)));
  assert.ok(r.steps.every(s => s.amount === null));
  const p2 = structuredClone(real);
  p2.federal.personal_income_tax.tax_on_tax_free_sum.status = 'pending';
  assert.ok(pb.calculate({ taxable_wages: 1, municipality: 'Leuven' }, p2).missing.some(m => /art\. 134/.test(m)));
  assert.equal(context.window.BKTaxEngine.calculate().status, 'blocked');
});

test('real 2026 confirmed parameters are read by their names', () => {
  close(pb.taxFreeSum({ children: 2 }, real.federal).tax_free_sum, 11550 + 5130, '2026 tfs 2 children');
  close(pb.taxFreeSumReduction(1e6, 11550, real.federal.personal_income_tax.tax_on_tax_free_sum).tax_on_tax_free_sum, 11550 * 0.25, '2026 tax on basic tfs');
  close(pb.netProfessionalIncome(30000, 0, real.payroll.professional_expenses).professional_expenses, 6070, '2026 cap');
});
