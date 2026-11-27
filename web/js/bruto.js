// Gross-pay input normalization shared by the calculator and scenario tools.
(() => {
  function parseMonthlyGross(value) {
    // One parser for the whole site: BKAmount (js/importe.js) reads nl-BE/fr-BE input, where
    // "3.500" means 3500 and "3.500,50" means 3500.50. Never Number("3.500") (= 3.5).
    let amount;
    if (typeof value === "number") amount = value;
    else if (window.BKAmount) {
      try { amount = window.BKAmount.parse(value); } catch (_) { amount = NaN; }
      if (amount === null) amount = NaN;
    } else throw new Error("BKAmount (js/importe.js) must be loaded before js/bruto.js.");
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
