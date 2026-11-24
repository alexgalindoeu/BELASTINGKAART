// Gross-pay input normalization shared by the calculator and scenario tools.
(() => {
  function parseMonthlyGross(value) {
    const amount = typeof value === "number" ? value : Number(String(value).trim().replace(",","."));
    if (!Number.isFinite(amount) || amount <= 0 || amount > 100000)
      throw new RangeError("Gross monthly pay must be between 0 and 100,000 EUR.");
    return Math.round((amount + Number.EPSILON)*100)/100;
  }
  function annualize(monthlyGross, paidMonths=12) {
    const monthly = parseMonthlyGross(monthlyGross);
    if (!Number.isFinite(paidMonths) || paidMonths < 1 || paidMonths > 14)
      throw new RangeError("paidMonths must be between 1 and 14.");
    return Math.round((monthly*paidMonths + Number.EPSILON)*100)/100;
  }
  window.BKGross = Object.freeze({parseMonthlyGross,annualize});
})();
