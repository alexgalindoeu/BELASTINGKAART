/**
 * Belgian calculation components. A full net-pay result remains unavailable
 * until every required parameter is officially confirmed and the complete
 * payroll pipeline has been implemented.
 */
(() => {
  function progressiveTax(base, brackets) {
    if (!Number.isFinite(base) || base < 0)
      throw new RangeError("Taxable income must be a non-negative finite number.");
    if (!Array.isArray(brackets) || brackets.length === 0)
      throw new Error("Official federal tax brackets are unavailable.");
    // No rounding here: the official rounding rule is still pending
    // (params rounding: pending_official_calculation_rule). Mirrors
    // apply_progressive_scale() in R/00_utils.R, including the requirement of
    // a final open-ended bracket.
    let tax = 0;
    let lower = 0;
    for (const bracket of brackets) {
      const upper = bracket.upper ?? Infinity;
      if (!Number.isFinite(bracket.rate) || bracket.rate < 0)
        throw new Error("Invalid marginal tax rate.");
      if (upper <= lower)
        throw new Error("Progressive tax thresholds must be strictly increasing.");
      if (base <= upper) return tax + (base-lower)*bracket.rate;
      tax += (upper-lower)*bracket.rate;
      lower = upper;
    }
    throw new Error("Progressive scale must include a final open-ended bracket.");
  }

  // --- Sociale werkbonus (RSZ DmfA instructions). Mirrors R/03_social_security.R.
  // Half-up rounding as written by RSZ ("0,005 wordt 0,01").
  function roundHalfUp(x, digits = 2) {
    const m = 10 ** digits;
    return Math.sign(x) * Math.floor(Math.abs(x) * m + 0.5 + 1e-9) / m;
  }

  function workBonusPeriod(workBonus, date) {
    const periods = workBonus?.periods;
    if (!periods || !Object.keys(periods).length) throw new Error("No work-bonus periods available");
    let key = null;
    for (const [k, p] of Object.entries(periods))
      if (String(p.effective_from) <= date && (key === null || String(p.effective_from) > String(periods[key].effective_from))) key = k;
    if (key === null) throw new Error("No work-bonus period covers " + date);
    const p = periods[key];
    if (p.effective_to != null && date > String(p.effective_to)) throw new Error("No work-bonus period covers " + date);
    return { ...p, key };
  }

  function workBonusReferenceWage({ W, regime, J, D, H, U }) {
    if (!Number.isFinite(W) || W < 0) throw new RangeError("W must be a non-negative finite wage");
    if (regime === "full_time") {
      if (!(J > 0 && D > 0 && J <= D)) throw new RangeError("Full-time regime needs 0 < J <= D");
      if (J === D) return { S: W, fraction: 1 };
      return { S: roundHalfUp(W / J) * D, fraction: Math.min(1, roundHalfUp(J / D)) };
    }
    if (regime === "part_time") {
      if (!(H > 0 && U > 0)) throw new RangeError("Part-time regime needs H > 0 and U > 0");
      return { S: roundHalfUp(W / H) * U, fraction: Math.min(1, roundHalfUp(H / U)) };
    }
    throw new RangeError("Unknown regime");
  }

  function workBonusBasicAmount(S, luik, category) {
    const c = luik?.[category];
    if (!c) throw new Error("Unknown work-bonus category: " + category);
    const R = S <= luik.threshold ? c.max : S <= luik.upper ? c.max - c.slope * (S - luik.threshold) : 0;
    return roundHalfUp(Math.max(0, R)); // negative R at the top of the band is floored at 0
  }

  // The annual cap is NOT applied: its application within the year is pending.
  function workBonusMonth(period, S, fraction, category, contributionDue) {
    const v = period?.value;
    if (!v) throw new Error("Work-bonus period " + (period?.key ?? "") + " is not available");
    const RA = workBonusBasicAmount(S, v.luik_a, category);
    const RB = workBonusBasicAmount(S, v.luik_b, category);
    let PA = roundHalfUp(fraction * RA);
    let PB = roundHalfUp(fraction * RB);
    const shortfall = Math.max(0, PA + PB - contributionDue);
    const cutB = Math.min(PB, shortfall); PB -= cutB;
    PA -= Math.min(PA, shortfall - cutB);
    return { period: period.key, S, fraction, RA, RB, PA: roundHalfUp(PA), PB: roundHalfUp(PB),
      P: roundHalfUp(PA + PB), status: period.status };
  }

  function workBonusIsConfirmed(workBonus) {
    const periods = Object.values(workBonus?.periods ?? {});
    return workBonus?.method?.status === "confirmed" && periods.length > 0 &&
      periods.every(p => p.status === "confirmed");
  }

  // --- Bedrijfsvoorheffing 2026, regular monthly wages of resident employees.
  // Mirrors R/04_payroll_tax.R step by step (Bijlage III KB/WIB 92, sleutelformule nrs. 6-21).
  // Reads params payroll.professional_withholding; half-up to the cent at every step (nr. 12).
  const BV_SPOUSE = ["single", "spouse_with_income", "spouse_other_income_le_290",
    "spouse_pension_le_579", "spouse_pension_le_174", "spouse_no_income"];

  function bvNotModelled(input) {
    const out = [];
    const pt = input.payment_type ?? "regular_monthly";
    if (pt !== "regular_monthly")
      out.push(`payment_type '${pt}' (exceptional pay, holiday pay, 13th month, arrears: Bijlage III nr. 53 e.v.) is not modelled`);
    if ((input.resident ?? true) !== true) out.push("non-residents (Bijlage III nr. 36.2, Deel 6) are not modelled");
    if ((input.employee_type ?? "employee") !== "employee") out.push("bedrijfsleiders (nr. 25.2, 29) are not modelled");
    if ((input.pay_frequency ?? "monthly") !== "monthly") out.push("pay other than per month (nrs. 48-50) is not modelled");
    if ((input.overtime_hours ?? 0) > 0) out.push("overtime reduction (nr. 45) is not modelled");
    if (input.public_sector_non_contract === true) out.push("low-income public-sector reduction (nr. 47) is not modelled");
    return out;
  }

  function bvPeriod(withholding, payDate) {
    const periods = withholding?.periods;
    if (!periods || !Object.keys(periods).length) throw new Error("No withholding periods available");
    for (const [key, p] of Object.entries(periods)) {
      const to = p.effective_to == null ? "9999-12-31" : String(p.effective_to);
      if (payDate >= String(p.effective_from) && payDate <= to) return { ...p, key };
    }
    throw new Error("No withholding period covers " + payDate);
  }

  function bvScaleTax(base, scale) {
    if (base <= 0) return 0;
    let lower = 0;
    for (const b of scale) {
      const up = b.upper ?? Infinity;
      if (base <= up) return roundHalfUp((b.tax_at_lower ?? 0) + b.rate * (base - lower));
      lower = up;
    }
    throw new Error("Base scale must end with an open bracket");
  }

  const bvCount = (x, label) => {
    x = x ?? 0;
    if (!Number.isInteger(x) || x < 0) throw new RangeError(label + " must be a non-negative integer");
    return x;
  };
  const bvAmount = (x, label) => {
    x = x ?? 0;
    if (!Number.isFinite(x) || x < 0) throw new RangeError(label + " must be a non-negative amount");
    return x;
  };

  function bvCompute(input, v) {
    const gross = bvAmount(input.gross_monthly, "gross_monthly");
    const social = bvAmount(input.social_contributions, "social_contributions");
    const sit = input.spouse_situation ?? "single";
    if (!BV_SPOUSE.includes(sit)) throw new Error("Unknown spouse_situation: " + sit);
    const quotient = sit === "spouse_no_income" || sit === "spouse_pension_le_174";
    const nChildren = bvCount(input.children, "children");
    const nChildDis = bvCount(input.children_disabled, "children_disabled");
    if (nChildDis > nChildren) throw new RangeError("children_disabled cannot exceed children");
    const nDep66 = bvCount(input.dependents_66_care, "dependents_66_care");
    const nDep = bvCount(input.other_dependents, "other_dependents");
    const nDepDis = bvCount(input.other_dependents_disabled, "other_dependents_disabled");
    if (nDepDis > nDep) throw new RangeError("other_dependents_disabled cannot exceed other_dependents");
    if (input.single_parent === true && (sit !== "single" || nChildren === 0))
      throw new Error("single_parent requires spouse_situation 'single' and at least one child (nr. 40.1)");
    if (input.spouse_disabled === true && !quotient)
      throw new Error("spouse_disabled applies only to a spouse without own income (nr. 41); otherwise it is granted to the spouse (nr. 7)");
    if (input.both_spouses_66 === true && !quotient) throw new Error("both_spouses_66 only affects the huwelijksquotiënt");

    const steps = [];
    const add = (id, value, rule) => { steps.push({ id, value, rule }); return value; };

    const m = add("taxable_monthly", roundHalfUp(gross - social), "nr. 25.1 / SF nr. 7, 1°");
    if (m < 0) throw new RangeError("social_contributions exceed gross_monthly");
    const ga = add("annual_gross", roundHalfUp(m * 12), "nr. 26 / SF nr. 7, 2°");
    const pe = v.professional_expenses;
    const ex = add("professional_expenses", Math.min(roundHalfUp(pe.rate * ga), pe.maximum), "nr. 28 / SF nr. 8, 1°");
    const net = add("net_annual", roundHalfUp(ga - ex), "nr. 30 / SF nr. 8");

    const mq = v.marital_quotient;
    let basic;
    if (quotient) {
      const cap = mq.maximum != null ? mq.maximum
        : input.both_spouses_66 === true ? mq.maximum_both_spouses_66_on_2027_01_01 : mq.maximum_other_cases;
      if (cap == null) throw new Error("Marital-quotient cap missing in parameters");
      const alloc = add("allocated_to_spouse", Math.min(roundHalfUp(mq.share * net), cap), "nr. 34.1.1 / SF nr. 11 b");
      const ta = add("tax_a", bvScaleTax(alloc, v.base_scale), "nr. 34.1.2");
      const tb = add("tax_b", bvScaleTax(roundHalfUp(net - alloc), v.base_scale), "nr. 34.1.3");
      basic = add("basic_tax", roundHalfUp(ta + tb - mq.tax_on_two_tax_free_sums), "nr. 34.2");
    } else {
      const st = add("scale_tax", bvScaleTax(net, v.base_scale), "nr. 31");
      basic = add("basic_tax", roundHalfUp(st - v.tax_on_tax_free_sum), "nr. 32 / SF nr. 11 a");
    }

    const n = nChildren + nChildDis;
    const cr = v.children_reduction;
    const top = Math.max(...Object.keys(cr.by_count).map(Number));
    const ch = n === 0 ? 0 : n <= top ? cr.by_count[String(n)] : cr.by_count[String(top)] + cr.per_child_above_eight * (n - top);
    add("children_reduction", ch, "nr. 38 (count incl. disabled children twice)");

    const of = v.other_family_reductions;
    let o = of.all.disabled_beneficiary * (input.self_disabled === true) +
      of.all.dependant_66_plus_in_care_per_person * nDep66 +
      of.all.other_dependant_per_person * (nDep + nDepDis);
    if (quotient) o += of.spouse_without_income.disabled_spouse * (input.spouse_disabled === true);
    else {
      const s = of.single_or_spouse_with_income;
      o += s.single_parent_with_children * (input.single_parent === true) +
        s.spouse_income_other_than_pension_net_max_290 * (sit === "spouse_other_income_le_290") +
        s.spouse_pension_only_net_max_579 * (sit === "spouse_pension_le_579");
    }
    add("other_family_reduction", roundHalfUp(o), "nrs. 39-41");
    const red = add("family_reductions_applied", Math.min(ch + o, Math.max(0, basic)), "SF nr. 13: total may not exceed the basic tax");
    const annual = add("annual_tax", Math.max(0, roundHalfUp(basic - red)), "SF nr. 9");
    let rem = add("monthly_withholding_before_other_reductions", roundHalfUp(annual / 12), "nr. 42 / SF nr. 16");

    let gi = roundHalfUp(0.30 * bvAmount(input.group_insurance_contributions, "group_insurance_contributions"));
    gi = add("group_insurance_reduction_applied", Math.min(gi, rem), "nr. 44 / SF nr. 17 (30 pct.)");
    rem = roundHalfUp(rem - gi);
    const wb = v.work_bonus_reduction;
    const wbr = roundHalfUp(roundHalfUp(wb.luik_a * bvAmount(input.work_bonus_luik_a, "work_bonus_luik_a")) +
      roundHalfUp(wb.luik_b * bvAmount(input.work_bonus_luik_b, "work_bonus_luik_b")));
    add("work_bonus_reduction", wbr, "nr. 46.2 / SF nr. 20");
    const wba = add("work_bonus_reduction_applied", Math.min(wbr, rem), "SF nr. 21: not below zero");
    rem = roundHalfUp(rem - wba);
    add("withholding", rem, "SF nr. 21");
    return { withholding: rem, steps };
  }

  // status: "confirmed" (withholding only), "blocked" or "not_modelled".
  function calculateWithholding(input, payroll) {
    const w = payroll?.professional_withholding;
    const nm = bvNotModelled(input);
    if (nm.length) return { status: "not_modelled", withholding: null, steps: [], missing: nm };
    if (!input.pay_date) throw new Error("pay_date is required to select the period");
    const missing = [];
    if (w?.method?.status !== "confirmed") missing.push("withholding method");
    let p = null;
    try { p = bvPeriod(w, input.pay_date); } catch { p = null; }
    if (!p) missing.push("withholding period for " + input.pay_date);
    else if (p.status !== "confirmed" || p.value == null) missing.push("withholding period " + p.key);
    if (missing.length) return { status: "blocked", withholding: null, steps: [], missing };
    const r = bvCompute(input, p.value);
    return { status: "confirmed", period: p.key, withholding: r.withholding, steps: r.steps, missing: [] };
  }

  function calculateFederalTaxBeforeAllowances(taxableIncome, parameters) {
    const brackets = parameters?.personal_income_tax?.brackets?.value;
    return progressiveTax(taxableIncome, brackets);
  }

  function calculate() {
    return {
      status: "blocked",
      reason: "The complete Belgian payroll calculation is not yet implemented.",
      missing: [
        "work bonus and applicable employee contribution",
        "professional withholding formula",
        "professional expenses",
        "family-specific tax allowance and credits",
        "regional rules",
        "municipal surcharge",
        "special social-security contribution"
      ]
    };
  }

  window.BKTaxEngine = Object.freeze({
    status: "partial",
    progressiveTax,
    calculateFederalTaxBeforeAllowances,
    roundHalfUp,
    workBonus: Object.freeze({
      period: workBonusPeriod,
      referenceWage: workBonusReferenceWage,
      basicAmount: workBonusBasicAmount,
      month: workBonusMonth,
      isConfirmed: workBonusIsConfirmed
    }),
    withholding: Object.freeze({
      period: bvPeriod,
      compute: bvCompute,
      calculate: calculateWithholding
    }),
    calculate
  });
})();
