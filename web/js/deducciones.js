// Belgian tax advantages catalogue. No deduction is asserted until a rule is officially documented.
(() => {
  const entries=[
    {id:"professional-expenses",status:"pending",jurisdiction:"federal"},
    {id:"dependent-children",status:"pending",jurisdiction:"federal"},
    {id:"childcare",status:"pending",jurisdiction:"federal"},
    {id:"pension-savings",status:"pending",jurisdiction:"federal"},
    {id:"service-vouchers",status:"pending",jurisdiction:"flanders"}
  ];
  function list({jurisdiction}={}){return entries.filter(x=>!jurisdiction||x.jurisdiction===jurisdiction).map(x=>({...x}));}
  window.BKTaxAdvantages=Object.freeze({list});
})();
