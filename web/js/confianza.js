// Calculation transparency and income-year / assessment-year labels.
(() => {
  function yearLabel(incomeYear,assessmentYear,lang="nl"){
    if(!Number.isInteger(incomeYear)||!Number.isInteger(assessmentYear)||assessmentYear<=incomeYear)
      throw new RangeError("Income year and assessment year are inconsistent.");
    return lang==="fr" ? `Revenus ${incomeYear} · exercice d’imposition ${assessmentYear}`
      : `Inkomsten ${incomeYear} · aanslagjaar ${assessmentYear}`;
  }
  function sourceStatus(parameter,lang="nl"){
    if(parameter?.status==="confirmed") return lang==="fr"?"Source officielle vérifiée":"Officiële bron gecontroleerd";
    if(parameter?.status==="provisional") return lang==="fr"?"Validation annuelle en attente":"Jaarlijkse bevestiging vereist";
    return lang==="fr"?"Paramètre non confirmé":"Parameter niet bevestigd";
  }
  window.BKTrust=Object.freeze({yearLabel,sourceStatus});
})();
