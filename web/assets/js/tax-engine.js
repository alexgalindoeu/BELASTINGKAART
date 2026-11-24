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
    let tax = 0;
    let lower = 0;
    for (const bracket of brackets) {
      const upper = bracket.upper ?? Infinity;
      if (!Number.isFinite(bracket.rate) || bracket.rate < 0 || upper <= lower)
        throw new Error("Invalid progressive tax bracket definition.");
      if (base <= upper) return Math.round((tax + (base-lower)*bracket.rate + Number.EPSILON)*100)/100;
      tax += (upper-lower)*bracket.rate;
      lower = upper;
    }
    return Math.round((tax + Number.EPSILON)*100)/100;
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
    calculate
  });
})();
