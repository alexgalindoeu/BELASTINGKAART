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

  // --- Personenbelasting (annual, one resident employee, individual assessment).
  // Mirrors R/10_personenbelasting.R; sources: docs/sources/wib92_personenbelasting_methode.md.
  // No rounding: arts. 6, 23, 51, 130, 134 and 466 WIB 92 state none.
  const pbAmount = (x, label) => {
    x = x ?? 0;
    if (typeof x !== "number" || !Number.isFinite(x) || x < 0) throw new RangeError(label + " must be a non-negative amount");
    return x;
  };
  const pbCount = (x, label) => {
    x = x ?? 0;
    if (!Number.isInteger(x) || x < 0) throw new RangeError(label + " must be a non-negative integer");
    return x;
  };
  const pbValue = (p, label) => {
    if (!p || p.status !== "confirmed" || p.value == null) throw new Error(label + " is not officially confirmed");
    return p.value;
  };
  const pbConfirmed = p => !!p && p.status === "confirmed" && p.value != null;

  // Art. 23 § 2, 1°, art. 49, art. 51 and art. 52, 7°, WIB 92.
  function pbNetProfessionalIncome(taxableWages, socialContributions, professionalExpenses) {
    const w = pbAmount(taxableWages, "taxable_wages");
    const c = pbAmount(socialContributions, "social_contributions");
    if (c > w) throw new RangeError("social_contributions exceed taxable_wages");
    const v = pbValue(professionalExpenses, "Flat-rate professional expenses (art. 51)");
    const base = w - c;
    const forfait = Math.min(v.employees_rate * base, v.employees_maximum);
    return { wages_less_contributions: base, professional_expenses: forfait, net_professional_income: base - forfait };
  }

  // Art. 130 WIB 92.
  function pbBasicTax(taxableIncome, brackets) {
    const b = pbAmount(taxableIncome, "taxable_income");
    const scale = pbValue(brackets, "Tax scale (art. 130)");
    return b <= 0 ? 0 : progressiveTax(b, scale);
  }

  // Arts. 131, 132 and 134 § 1 WIB 92.
  function pbTaxFreeSum(person, federal) {
    const pit = federal?.personal_income_tax;
    const basic = pbValue(pit?.basic_personal_tax_allowance, "Basic tax-free amount (art. 131)");
    const disInc = person.taxpayer_disabled === true ? pbValue(pit?.disabled_taxpayer_increase, "Disabled-taxpayer increase (art. 131)") : 0;
    const d = pbValue(pit?.dependant_increases, "Dependant increases (art. 132)");
    const ch = pbCount(person.children, "children");
    const chd = pbCount(person.children_disabled, "children_disabled");
    const u3 = pbCount(person.children_under_3, "children_under_3");
    const u3d = pbCount(person.children_under_3_disabled, "children_under_3_disabled");
    const dep66 = pbCount(person.dependants_66_care, "dependants_66_care");
    const oth = pbCount(person.other_dependants, "other_dependants");
    const othd = pbCount(person.other_dependants_disabled, "other_dependants_disabled");
    if (chd > ch) throw new RangeError("children_disabled cannot exceed children");
    if (u3 > ch) throw new RangeError("children_under_3 cannot exceed children");
    if (u3d > u3 || u3d > chd) throw new RangeError("children_under_3_disabled cannot exceed children_under_3 or children_disabled");
    if (othd > oth) throw new RangeError("other_dependants_disabled cannot exceed other_dependants");
    const dbl = d.disabled_counts_double === true;
    const n = ch + (dbl ? chd : 0);
    const by = d.children_total_by_count;
    const top = Math.max(...Object.keys(by).map(Number));
    const childrenInc = n === 0 ? 0 : n <= top ? by[String(n)] : by[String(top)] + d.per_child_above_four * (n - top);
    const under3Inc = d.child_under_three_supplement * (u3 + (dbl ? u3d : 0));
    const care66Inc = d.dependant_66_plus_in_care_per_person * dep66;
    const otherInc = d.other_dependant_per_person * (oth + (dbl ? othd : 0));
    return { basic_amount: basic + disInc, children_increases: childrenInc + under3Inc,
      other_dependant_increases: care66Inc + otherInc,
      tax_free_sum: basic + disInc + childrenInc + under3Inc + care66Inc + otherInc };
  }

  // Art. 134 § 2 WIB 92 (scale of § 2, not art. 130; reduction capped at the basic tax).
  function pbTaxFreeSumReduction(basicTax, taxFreeSum, tfsScale) {
    const b = pbAmount(basicTax, "basic_tax");
    const s = pbAmount(taxFreeSum, "tax_free_sum");
    const scale = pbValue(tfsScale, "Scale for the tax on the tax-free sum (art. 134 § 2)");
    const t = s <= 0 ? 0 : progressiveTax(s, scale);
    const applied = Math.min(t, b);
    return { tax_on_tax_free_sum: t, reduction_applied: applied, not_deductible: t - applied, tax_after_reduction: b - applied };
  }

  const PB_NOT_MODELLED_REDUCTIONS = [
    { id: "child_tax_credit_134_3", source: "art. 134, § 3, WIB 92",
      label_nl: "Terugbetaalbaar belastingkrediet voor kinderen ten laste", label_fr: "Crédit d'impôt remboursable pour enfants à charge" },
    { id: "minimum_child_tax_credit_2026", source: "W 15.07.2026, hoofdstuk 2 (art. 41-42)",
      label_nl: "Minimaal belastingkrediet voor kinderen ten laste", label_fr: "Crédit d'impôt minimal pour enfants à charge" },
    { id: "long_term_savings_145_1", source: "art. 145/1 tot 145/16, WIB 92",
      label_nl: "Vermindering voor lange termijnsparen en pensioensparen", label_fr: "Réduction pour épargne à long terme et épargne-pension" },
    { id: "service_vouchers_145_21", source: "art. 145/21, WIB 92",
      label_nl: "Vermindering voor PWA en dienstencheques", label_fr: "Réduction pour ALE et titres-services" },
    { id: "gifts_145_33", source: "art. 145/33, WIB 92", label_nl: "Vermindering voor giften", label_fr: "Réduction pour libéralités" },
    { id: "childcare_145_35", source: "art. 145/35, WIB 92", label_nl: "Vermindering voor kinderoppas", label_fr: "Réduction pour garde d'enfants" },
    { id: "overtime_154bis", source: "art. 154bis, WIB 92", label_nl: "Vermindering voor overwerk", label_fr: "Réduction pour heures supplémentaires" },
    { id: "fiscal_work_bonus_289ter", source: "art. 289ter, WIB 92",
      label_nl: "Belastingkrediet voor lage activiteitsinkomsten (fiscale werkbonus)",
      label_fr: "Crédit d'impôt pour bas revenus d'activité (bonus à l'emploi fiscal)" },
    { id: "allocation_order_178_1", source: "art. 178/1, WIB 92",
      label_nl: "Aanrekening van de belastingverminderingen op de gereduceerde belasting Staat",
      label_fr: "Imputation des réductions d'impôt sur l'impôt Etat réduit" }
  ];
  const pbNotModelledReductions = () => PB_NOT_MODELLED_REDUCTIONS.map(h => ({ ...h, amount: null, status: "not_modelled" }));

  // Arts. 466 and 468 WIB 92: percentage (max. one decimal) of the 'totale belasting'.
  function pbMunicipalSurcharge(totalTax, entry) {
    const base = pbAmount(totalTax, "total_tax");
    const pct = pbValue(entry, "Municipal surcharge rate (art. 466-468)");
    if (typeof pct !== "number" || !Number.isFinite(pct) || pct < 0) throw new RangeError("Municipal surcharge rate must be a non-negative percentage");
    if (Math.abs(pct * 10 - Math.round(pct * 10)) > 1e-9) throw new RangeError("Municipal surcharge rate may have at most one decimal (art. 468)");
    return base * pct / 100;
  }

  function pbNotModelledInputs(input) {
    const out = [];
    if ((input.assessment ?? "individual") !== "individual") out.push("joint assessment (art. 126 § 1, 86-88, 134 § 4) is not modelled");
    if ((input.resident ?? true) !== true) out.push("non-residents are not modelled");
    if (input.actual_professional_expenses != null) out.push("actual professional expenses (art. 49) instead of the forfait are not modelled");
    if ((input.other_income ?? 0) > 0) out.push("income other than wages (art. 6, 1°, 2° and 4°; art. 23, 1°-3° and 5°) is not modelled");
    if (input.single_parent === true) out.push("art. 133 increases (single parent) are not modelled");
    if (input.co_parenting === true) out.push("co-parenting split (art. 132bis) is not modelled");
    return out;
  }

  const PB_SRC = guid => "https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/" + guid;

  // status: "blocked" if any parameter used is not confirmed (no amounts), else
  // "not_modelled" (regional step, reductions and credits missing). Never a public amount yet.
  function pbCalculate(input, parameters) {
    const nm = pbNotModelledInputs(input);
    const fed = parameters?.federal?.personal_income_tax;
    const muni = parameters?.municipal?.aanvullende_gemeentebelasting?.[input.municipality ?? ""];
    const ec = parameters?.social_security?.employee_contribution;
    const needed = [
      ["flat-rate professional expenses (payroll.professional_expenses)", parameters?.payroll?.professional_expenses],
      ["tax scale art. 130 (federal.personal_income_tax.brackets)", fed?.brackets],
      ["basic tax-free amount art. 131 (federal.personal_income_tax.basic_personal_tax_allowance)", fed?.basic_personal_tax_allowance],
      ["dependant increases art. 132 (federal.personal_income_tax.dependant_increases)", fed?.dependant_increases],
      ["scale art. 134 § 2 (federal.personal_income_tax.tax_on_tax_free_sum)", fed?.tax_on_tax_free_sum],
      ["employee social-security rate (social_security.employee_contribution.rate)", ec?.rate],
      ["municipal surcharge rate (municipal.aanvullende_gemeentebelasting.<municipality>)", muni]
    ];
    if (input.taxpayer_disabled === true)
      needed.push(["disabled-taxpayer increase art. 131 (federal.personal_income_tax.disabled_taxpayer_increase)", fed?.disabled_taxpayer_increase]);
    const missing = needed.filter(([, p]) => !pbConfirmed(p)).map(([k]) => k);
    if (!workBonusIsConfirmed(ec?.work_bonus)) missing.push("sociale werkbonus (social_security.employee_contribution.work_bonus)");
    nm.push("regional step: gereduceerde belasting Staat, gewestelijke opcentiemen and 'totale belasting' (art. 2, § 3, WIB 92; BFW 16.01.1989, Titel III/1)",
      ...PB_NOT_MODELLED_REDUCTIONS.map(h => h.source + " is not modelled"));

    const blocked = missing.length > 0;
    let npi = {}, taxable = null, basic = null, tfs = {}, red = {};
    if (!blocked) {
      npi = pbNetProfessionalIncome(input.taxable_wages, input.social_contributions, parameters.payroll.professional_expenses);
      taxable = npi.net_professional_income;
      basic = pbBasicTax(taxable, fed.brackets);
      tfs = pbTaxFreeSum(input, parameters.federal);
      red = pbTaxFreeSumReduction(basic, tfs.tax_free_sum, fed.tax_on_tax_free_sum);
    }
    const a = x => blocked ? null : x;
    const step = (id, label_nl, label_fr, amount, source) => ({ id, label_nl, label_fr, amount, source });
    const steps = [
      step("wages_less_contributions", "Belastbare bezoldigingen min persoonlijke sociale bijdragen",
        "Rémunérations imposables moins cotisations sociales personnelles", a(npi.wages_less_contributions), "art. 52, 7°, WIB 92"),
      step("professional_expenses", "Forfaitaire beroepskosten", "Frais professionnels forfaitaires",
        a(npi.professional_expenses), "art. 51 WIB 92 — " + PB_SRC("e2fb1778-ac33-4e91-8e57-e53c0cac384c")),
      step("net_professional_income", "Netto beroepsinkomen", "Revenu professionnel net",
        a(npi.net_professional_income), "art. 23, § 2, WIB 92 — " + PB_SRC("faca8178-20de-45b6-acb6-00769cba1c00")),
      step("taxable_income", "Belastbaar inkomen", "Revenu imposable",
        a(taxable), "art. 6 WIB 92 — " + PB_SRC("2f73b26b-e8f3-4f07-a1df-3f626caa2978")),
      step("basic_tax", "Basisbelasting", "Impôt de base",
        a(basic), "art. 130 WIB 92 — " + PB_SRC("796a4fc5-340e-4c89-a72a-88caa804ca96")),
      step("tax_free_sum", "Belastingvrije som", "Quotité du revenu exemptée d'impôt",
        a(tfs.tax_free_sum), "art. 131, 132 en 134, § 1, WIB 92 — " + PB_SRC("20a503a9-4213-4e60-a91c-0ebb907e176a")),
      step("tax_on_tax_free_sum", "Belasting op de belastingvrije som", "Impôt afférent à la quotité exemptée",
        a(red.tax_on_tax_free_sum), "art. 134, § 2, WIB 92 — " + PB_SRC("20a503a9-4213-4e60-a91c-0ebb907e176a")),
      step("tax_free_sum_reduction_applied", "Aangerekende vermindering voor de belastingvrije som",
        "Réduction imputée pour la quotité exemptée", a(red.reduction_applied), "art. 134, § 2, WIB 92"),
      step("tax_after_tax_free_sum", "Belasting na vermindering voor de belastingvrije som",
        "Impôt après réduction pour la quotité exemptée", a(red.tax_after_reduction), "art. 134, § 2, WIB 92"),
      step("tax_free_sum_not_deductible", "Niet aanrekenbaar deel van de belasting op de belastingvrije som",
        "Partie non imputable de l'impôt afférent à la quotité exemptée", a(red.not_deductible),
        "art. 134, § 3, WIB 92 (conversion into a credit not modelled)"),
      ...pbNotModelledReductions().map(h => step(h.id, h.label_nl, h.label_fr, null, h.source + " — not modelled")),
      step("total_tax", "Totale belasting", "Impôt total", null, "art. 2, § 3, WIB 92; BFW 16.01.1989, Titel III/1 — not modelled"),
      step("municipal_surcharge", "Aanvullende gemeentebelasting", "Taxe communale additionnelle", null,
        "art. 466 en 468 WIB 92 — " + PB_SRC("81bf3101-a837-4d89-8b97-713e080f00ac") + " — needs total_tax and a confirmed rate")
    ];
    return { status: blocked ? "blocked" : "not_modelled", steps, missing: [...new Set(missing)], not_modelled: nm };
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
    personenbelasting: Object.freeze({
      netProfessionalIncome: pbNetProfessionalIncome,
      basicTax: pbBasicTax,
      taxFreeSum: pbTaxFreeSum,
      taxFreeSumReduction: pbTaxFreeSumReduction,
      notModelledReductions: pbNotModelledReductions,
      municipalSurcharge: pbMunicipalSurcharge,
      calculate: pbCalculate
    }),
    calculate
  });
})();
