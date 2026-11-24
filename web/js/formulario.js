// Serializable household form state and validation; this module does not calculate tax.
(() => {
  const regions=["flanders","brussels","wallonia"];
  const familyStatuses=["single","married","legal_cohabitant","separated","widowed"];
  function initialState(){return {grossMonthly:"",region:"flanders",municipality:"",familyStatus:"single",children:0,employment:"employee",incomeYear:2026,assessmentYear:2027,paidMonths:12};}
  function validate(input){
    const errors=[];
    if(!regions.includes(input.region)) errors.push("region");
    if(!familyStatuses.includes(input.familyStatus)) errors.push("familyStatus");
    if(!Number.isInteger(Number(input.children))||Number(input.children)<0) errors.push("children");
    if(!Number.isInteger(Number(input.incomeYear))||Number(input.assessmentYear)<=Number(input.incomeYear)) errors.push("taxYears");
    if(!Number.isInteger(Number(input.paidMonths))||Number(input.paidMonths)<1||Number(input.paidMonths)>14) errors.push("paidMonths");
    if(input.employment!=="employee") errors.push("employment");
    if(!String(input.municipality||"").trim()) errors.push("municipality");
    return {valid:errors.length===0,errors};
  }
  window.BKForm=Object.freeze({initialState,validate,regions,familyStatuses});
})();
