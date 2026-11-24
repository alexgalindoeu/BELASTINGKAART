// Scenario construction is independent of tax rules; calculations are delegated to BKTaxEngine.
(() => {
  function grossSteps(baseMonthly, percentages=[-10,-5,0,5,10]) {
    const base = window.BKGross.parseMonthlyGross(baseMonthly);
    return percentages.map(p => {
      if (!Number.isFinite(p) || p <= -100) throw new RangeError("Invalid scenario percentage.");
      return {changePercent:p,grossMonthly:Math.round((base*(1+p/100)+Number.EPSILON)*100)/100};
    });
  }
  function evaluate(household, baseMonthly, parameters) {
    return grossSteps(baseMonthly).map(scenario => ({
      ...scenario,
      result: window.BKTaxEngine.calculate(household,scenario.grossMonthly,parameters)
    }));
  }
  window.BKScenarios = Object.freeze({grossSteps,evaluate});
})();
