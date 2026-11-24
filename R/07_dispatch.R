# Public calculation dispatcher. Returns a structured blocked state until every
# required Belgian payroll component is confirmed and implemented.
calculate_salary <- function(household, gross_monthly, parameters) {
  validate_household(household)
  if (!is.finite(gross_monthly) || gross_monthly <= 0)
    stop("gross_monthly must be positive and finite", call.=FALSE)
  if (household$income_year != parameters$income_year ||
      household$assessment_year != parameters$assessment_year)
    stop("Household years do not match the parameter dataset", call.=FALSE)
  missing <- character()
  social <- parameters$social_security$employee_contribution
  if (is.null(social$rate) || !identical(social$rate$status,"confirmed"))
    missing <- c(missing,"confirmed employee social-security rate")
  if (is.null(social$work_bonus) || !identical(social$work_bonus$status,"confirmed"))
    missing <- c(missing,"work bonus")
  if (is.null(parameters$payroll$professional_withholding) ||
      !identical(parameters$payroll$professional_withholding$status,"confirmed"))
    missing <- c(missing,"professional withholding")
  if (is.null(parameters$payroll$professional_expenses) ||
      !identical(parameters$payroll$professional_expenses$status,"confirmed"))
    missing <- c(missing,"professional expenses")
  if (is.null(parameters$regional_rules) || is.null(parameters$regional_rules[[household$region]]))
    missing <- c(missing,"regional rules")
  if (is.null(parameters$municipal_rules) ||
      is.null(parameters$municipal_rules[[household$municipality]]))
    missing <- c(missing,"municipal surcharge")
  if (length(missing)) return(structure(list(status="blocked",
    message="A reliable Belgian net salary cannot yet be calculated.",
    missing=unique(missing), income_year=household$income_year,
    assessment_year=household$assessment_year), class="belastingkaart_blocked"))
  stop("All parameters are present but the complete calculation pipeline is not implemented", call.=FALSE)
}
