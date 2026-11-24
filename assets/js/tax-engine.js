/**
 * Belgian tax calculation components.
 *
 * This module only exposes sourced sub-calculations. A complete gross-to-net
 * result remains blocked until all required payroll, tax and municipal rules
 * are confirmed and tested.
 */
(() => {
  function progressiveTax(base, brackets) {
    if (!Number.isFinite(base) || base < 0) {
      throw new RangeError("Taxable income must be a non-negative finite number.");
    }
    let tax = 0;
    let lower = 0;
    for (const bracket of brackets) {
      const upper = bracket.upper ?? Infinity;
      if (base <= upper) return tax + (base - lower) * bracket.rate;
      tax += (upper - lower) * bracket.rate;
      lower = upper;
    }
    return tax;
  }

  window.BKTaxEngine = Object.freeze({
    status: "partial",
    progressiveTax,
    calculateFederalTaxBeforeAllowances(taxableIncome, parameters) {
      const brackets = parameters?.personal_income_tax?.brackets?.value;
      if (!Array.isArray(brackets) || brackets.length === 0) {
        throw new Error("Official federal tax brackets are unavailable.");
      }
      return progressiveTax(taxableIncome, brackets);
    },
    calculate() {
      return {
        status: "blocked",
        reason: "The complete Belgian payroll calculation is not yet implemented.",
        missing: ["employee social-security work bonus", "professional withholding",
          "professional expenses", "family-specific tax allowance",
          "municipal surcharge", "special social-security contribution"]
      };
    }
  });
})();
