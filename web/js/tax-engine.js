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
    calculate
  });
})();
