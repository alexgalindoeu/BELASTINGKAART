/**
 * Belastingkaart calculation engine.
 *
 * Intentionally not implemented yet. Do not add estimated Belgian tax rates
 * without a dated primary source and a validation case.
 */
window.BKTaxEngine = {
  status: "not_implemented",
  calculate() {
    throw new Error("Belgian tax engine is not implemented or validated yet.");
  }
};
