// Accounts are deliberately disabled until authentication, privacy and deletion flows are deployed.
(() => {
  function status(){return {enabled:window.BK_CONFIG?.features?.accounts===true,reason:"Account functionality is not configured."};}
  function requireEnabled(){if(!status().enabled) throw new Error("Belastingkaart accounts are not available yet.");}
  window.BKAccounts=Object.freeze({status,requireEnabled});
})();
