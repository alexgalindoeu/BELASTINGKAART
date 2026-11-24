// Gross salary distribution only. No tax or net-pay assumptions.
(() => {
  function distributeAnnualGross(annualGross,paidMonths=12){
    if(!Number.isFinite(annualGross)||annualGross<0) throw new RangeError("Annual gross must be non-negative.");
    if(!Number.isInteger(paidMonths)||paidMonths<1||paidMonths>14) throw new RangeError("Paid months must be between 1 and 14.");
    const regular=Math.round((annualGross/paidMonths+Number.EPSILON)*100)/100;
    return {annualGross:Math.round(annualGross*100)/100,paidMonths,regularPayment:regular,extraPayments:paidMonths-12};
  }
  window.BKSalarySchedule=Object.freeze({distributeAnnualGross});
})();
