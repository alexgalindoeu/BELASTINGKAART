// Explanations consume an existing verified calculation; they never recompute tax.
(() => {
  function build(result,lang="nl"){
    if(!result||result.status!=="complete"||!Array.isArray(result.breakdown))
      return {status:"unavailable",message:lang==="fr"?"L’explication sera disponible avec un calcul vérifié.":"De toelichting is beschikbaar zodra een berekening volledig is gevalideerd.",steps:[]};
    return {status:"available",message:"",steps:result.breakdown.map(x=>({label:String(x.label),amount:Number(x.amount),source:x.source||null}))};
  }
  window.BKExplanation=Object.freeze({build});
})();
