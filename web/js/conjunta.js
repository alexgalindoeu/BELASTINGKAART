// Household status model for future Belgian family-tax treatment; no Spanish joint-return concept is assumed.
(() => {
  function normalize(input={}){
    const status=window.BKForm.familyStatuses.includes(input.familyStatus)?input.familyStatus:"single";
    const children=Math.max(0,Math.trunc(Number(input.children)||0));
    return {familyStatus:status,children,partnerIncomeKnown:input.partnerIncomeKnown===true};
  }
  function eligibilityState(household){
    return {status:"not_calculated",reason:"Belgian family-related tax treatment has not yet been fully implemented.",household:normalize(household)};
  }
  window.BKHousehold=Object.freeze({normalize,eligibilityState});
})();
