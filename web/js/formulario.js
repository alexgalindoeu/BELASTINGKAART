// Serializable household form state and validation; this module does not calculate tax.
(() => {
  const regions = ["flanders", "brussels", "wallonia"];
  const familyStatuses = ["single", "married", "legal_cohabitant", "separated", "widowed"];

  function initialState() {
    return {
      grossMonthly: "",
      region: "flanders",
      municipality: "",
      familyStatus: "single",
      children: 0,
      employment: "employee",
      incomeYear: 2026,
      assessmentYear: 2027,
      paidMonths: 12
    };
  }

  function validate(input) {
    const errors = [];
    const gross = Number(input.grossMonthly);
    const incomeYear = Number(input.incomeYear);
    const assessmentYear = Number(input.assessmentYear);
    const children = Number(input.children);
    const paidMonths = Number(input.paidMonths);

    if (!Number.isFinite(gross) || gross <= 0 || gross > 100000) errors.push("grossMonthly");
    if (!regions.includes(input.region)) errors.push("region");
    if (!String(input.municipality || "").trim()) errors.push("municipality");
    if (!familyStatuses.includes(input.familyStatus)) errors.push("familyStatus");
    if (!Number.isInteger(children) || children < 0 || children > 20) errors.push("children");
    if (input.employment !== "employee") errors.push("employment");
    if (!Number.isInteger(incomeYear) || !Number.isInteger(assessmentYear) || assessmentYear <= incomeYear) {
      errors.push("taxYears");
    }
    if (!Number.isInteger(paidMonths) || paidMonths < 1 || paidMonths > 14) errors.push("paidMonths");

    return { valid: errors.length === 0, errors };
  }

  window.BKForm = Object.freeze({ initialState, validate, regions, familyStatuses });
})();
