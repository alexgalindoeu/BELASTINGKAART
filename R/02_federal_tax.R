# Federal personal income tax components.
# This module intentionally does not calculate final annual tax or net salary:
# professional expenses, personal allowances, credits and municipal surcharge
# must be implemented as separate, sourced steps.

calculate_tax_on_taxable_income <- function(taxable_income, brackets) {
  if (!is.numeric(taxable_income) || length(taxable_income) != 1L ||
      is.na(taxable_income) || taxable_income < 0) {
    stop("taxable_income must be a single non-negative number", call. = FALSE)
  }
  apply_progressive_scale(taxable_income, brackets)
}
