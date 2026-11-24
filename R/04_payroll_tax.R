# Payroll withholding is a distinct cash-flow calculation, not the final annual tax.
calculate_professional_withholding <- function(gross_monthly, payroll_parameters, household) {
  validate_household(household)
  if (!is.finite(gross_monthly) || gross_monthly < 0)
    stop("gross_monthly must be a non-negative finite number", call.=FALSE)
  withholding <- payroll_parameters$professional_withholding
  if (is.null(withholding) || !identical(withholding$status,"confirmed") ||
      is.null(withholding$value))
    stop("Professional withholding rules are not confirmed; no estimate will be produced", call.=FALSE)
  stop("The official withholding formula has not yet been implemented", call.=FALSE)
}
