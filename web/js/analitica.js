// Privacy-first analytics gate. No vendor is loaded unless explicitly configured and consented.
(() => {
  function hasConsent() { return localStorage.getItem("bk-analytics-consent") === "yes"; }
  function setConsent(allowed) {
    localStorage.setItem("bk-analytics-consent",allowed ? "yes" : "no");
  }
  function track() {
    if (!hasConsent() || typeof window.BK_CONFIG?.analyticsProvider !== "function") return false;
    window.BK_CONFIG.analyticsProvider.apply(null,arguments);
    return true;
  }
  window.BKAnalytics = Object.freeze({hasConsent,setConsent,track});
})();
