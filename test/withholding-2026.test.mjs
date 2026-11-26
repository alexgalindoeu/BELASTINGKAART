import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Transcribed values: docs/sources/bedrijfsvoorheffing_2026_fisconet.md and
// docs/sources/personenbelasting_2026_fisconet.md (FOD Financiën, Fisconet, 2026-11-25).
const data = JSON.parse(await readFile(new URL('../web/data/parameters.json', import.meta.url), 'utf8'));
const bv = data.payroll.professional_withholding;
const pit = data.federal.personal_income_tax;
const FISCONET = /^https:\/\/www\.minfin\.fgov\.be\/myminfin-web\/pages\/public\/fisconet\/document\/[0-9a-f-]{36}$/;
const halfUp = x => Math.sign(x) * Math.floor(Math.abs(x) * 100 + 0.5 + 1e-9) / 100;

test('withholding 2026: three periods by payment date, contiguous and confirmed from Fisconet', () => {
  assert.deepEqual(Object.keys(bv.periods), ['2026_01', '2026_08', '2026_11']);
  const spans = Object.values(bv.periods).map(p => [p.effective_from, p.effective_to]);
  assert.deepEqual(spans, [['2026-01-01', '2026-07-31'], ['2026-08-01', '2026-10-31'], ['2026-11-01', '2026-12-31']]);
  for (const [k, p] of Object.entries(bv.periods)) {
    assert.equal(p.status, 'confirmed', k);
    assert.equal(p.income_year, 2026);
    assert.equal(p.assessment_year, 2027);
    assert.match(p.source_url, FISCONET, k);
  }
  assert.equal(bv.method.status, 'confirmed');
  assert.equal(bv.method.value.rounding, 'half_up_eurocent_every_step');
  assert.equal(bv.method.value.surcharge_built_in, 0.07);
  assert.equal(bv.status, undefined, 'no top-level status: the dispatcher must keep blocking');
});

test('withholding 2026: base scale, forfait and tax-free sum as published', () => {
  for (const p of Object.values(bv.periods)) {
    assert.deepEqual(p.value.base_scale.map(b => [b.upper, b.rate, b.tax_at_lower ?? 0]),
      [[16710, 0.2675, 0], [29500, 0.428, 4469.93], [51050, 0.4815, 9944.05], [null, 0.535, 20320.38]]);
    assert.deepEqual(p.value.professional_expenses, { rate: 0.3, threshold_annual: 20233.33, maximum: 6070 });
  }
  const [jan, aug, nov] = Object.values(bv.periods).map(p => p.value);
  assert.equal(jan.tax_free_sum, 11170); assert.equal(jan.tax_on_tax_free_sum, 2987.98);
  assert.equal(nov.tax_free_sum, 11550); assert.equal(nov.tax_on_tax_free_sum, 3089.63);
  assert.equal(jan.marital_quotient.maximum, 13790);
  assert.equal(nov.marital_quotient.maximum_both_spouses_66_on_2027_01_01, 12790);
  assert.equal(nov.marital_quotient.maximum_other_cases, 11780);
  assert.deepEqual(aug.tax_free_sum, jan.tax_free_sum);
});

test('withholding 2026: printed cumulative amounts follow from the rates with half-up rounding', () => {
  for (const p of Object.values(bv.periods)) {
    const s = p.value.base_scale;
    assert.equal(halfUp(16710 * 0.2675), s[1].tax_at_lower);
    assert.equal(halfUp(s[1].tax_at_lower + (29500 - 16710) * 0.428), s[2].tax_at_lower);
    assert.equal(halfUp(s[2].tax_at_lower + (51050 - 29500) * 0.4815), s[3].tax_at_lower);
    assert.equal(halfUp(p.value.tax_free_sum * 0.2675), p.value.tax_on_tax_free_sum);
    assert.equal(halfUp(2 * p.value.tax_on_tax_free_sum), p.value.marital_quotient.tax_on_two_tax_free_sums);
    assert.equal(halfUp(6070 / 0.3), p.value.professional_expenses.threshold_annual);
  }
  const nov = bv.periods['2026_11'].value.marital_quotient;
  assert.equal(halfUp(12790 / 0.3), nov.maximum_both_spouses_66_reached_at);
  assert.equal(halfUp(11780 / 0.3), nov.maximum_other_cases_reached_at);
  assert.equal(halfUp(13790 / 0.3), bv.periods['2026_01'].value.marital_quotient.maximum_reached_at);
});

test('withholding 2026: family reductions per period (nrs. 38-41)', () => {
  const jan = bv.periods['2026_01'].value, nov = bv.periods['2026_11'].value;
  assert.deepEqual(Object.values(jan.children_reduction.by_count), [624, 1656, 4404, 7620, 11100, 14592, 18120, 21996]);
  assert.equal(jan.children_reduction.per_child_above_eight, 3864);
  assert.deepEqual(Object.values(nov.children_reduction.by_count), [684, 1644, 4344, 7488, 10884, 14292, 17712, 21492]);
  assert.equal(nov.children_reduction.per_child_above_eight, 3780);
  assert.deepEqual(jan.other_family_reductions, {
    all: { disabled_beneficiary: 624, dependant_66_plus_in_care_per_person: 1992, other_dependant_per_person: 624 },
    single_or_spouse_with_income: { single_parent_with_children: 624, spouse_income_other_than_pension_net_max_290: 1740, spouse_pension_only_net_max_579: 3474 },
    spouse_without_income: { disabled_spouse: 624 } });
  assert.deepEqual(nov.other_family_reductions, {
    all: { disabled_beneficiary: 648, dependant_66_plus_in_care_per_person: 1992, other_dependant_per_person: 636 },
    single_or_spouse_with_income: { single_parent_with_children: 636, spouse_income_other_than_pension_net_max_290: 1740, spouse_pension_only_net_max_579: 3474 },
    spouse_without_income: { disabled_spouse: 636 } });
});

test('withholding 2026: fiscal work-bonus reduction rises for luik B from 1 August 2026 (KB 24.07.2026)', () => {
  assert.deepEqual(bv.periods['2026_01'].value.work_bonus_reduction, { luik_a: 0.3314, luik_b: 0.5254 });
  assert.deepEqual(bv.periods['2026_08'].value.work_bonus_reduction, { luik_a: 0.3314, luik_b: 0.63 });
  assert.deepEqual(bv.periods['2026_11'].value.work_bonus_reduction, { luik_a: 0.3314, luik_b: 0.63 });
  const { work_bonus_reduction: _a, ...jan } = bv.periods['2026_01'].value;
  const { work_bonus_reduction: _b, ...aug } = bv.periods['2026_08'].value;
  assert.deepEqual(aug, jan, 'August differs from January only in the work-bonus percentage');
});

test('personal income tax AJ 2027: scale, tax-free sum, increases and forfait confirmed from Fisconet', () => {
  for (const k of ['brackets', 'basic_personal_tax_allowance', 'disabled_taxpayer_increase', 'dependant_increases', 'tax_on_tax_free_sum']) {
    assert.equal(pit[k].status, 'confirmed', k);
    assert.match(pit[k].source_url, FISCONET, k);
    assert.equal(pit[k].assessment_year, 2027);
  }
  assert.equal(pit.basic_personal_tax_allowance.value, 11550);
  assert.equal(pit.disabled_taxpayer_increase.value, 2030);
  assert.deepEqual(pit.tax_on_tax_free_sum.value.map(b => [b.upper, b.rate]),
    [[11750, 0.25], [16720, 0.3], [27860, 0.4], [51070, 0.45], [null, 0.5]]);
  const d = pit.dependant_increases.value;
  assert.deepEqual(Object.values(d.children_total_by_count), [2130, 5130, 11440, 18510]);
  assert.equal(d.per_child_above_four, 7070);
  assert.equal(d.child_under_three_supplement, 740);
  assert.equal(d.dependant_66_plus_in_care_per_person, 5950);
  assert.equal(d.other_dependant_per_person, 1980);
  const pe = data.payroll.professional_expenses;
  assert.deepEqual(pe.value, { employees_rate: 0.3, employees_maximum: 6070 });
  assert.match(pe.source_url, FISCONET);
});
