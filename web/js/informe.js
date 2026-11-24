// Printable reports are disabled until a verified result exists and report policy is published.
(() => {
  function canGenerate(result){return result?.status==="complete"&&Array.isArray(result.breakdown)&&result.provenanceComplete===true;}
  function printableData(result){if(!canGenerate(result)) throw new Error("A verified, provenance-complete calculation is required.");return {title:"Belastingkaart calculation report",result};}
  window.BKReport=Object.freeze({canGenerate,printableData});
})();
