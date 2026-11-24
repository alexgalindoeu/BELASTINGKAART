// Public, non-secret configuration. Production integrations stay disabled until configured.
window.BK_CONFIG = Object.freeze({
  defaultLanguage: "nl",
  supportedLanguages: ["nl","fr"],
  defaultIncomeYear: 2026,
  features: Object.freeze({
    grossToNet: true,
    scenarios: false,
    csvExport: false,
    accounts: false,
    paidReports: false,
    advertising: false,
    analytics: false
  })
});
