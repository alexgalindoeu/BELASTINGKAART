# Scenario comparisons use the same household and explicitly versioned parameters.
compare_gross_scenarios <- function(household, gross_monthly_values, parameters) {
  if (!is.numeric(gross_monthly_values) || !length(gross_monthly_values) ||
      any(!is.finite(gross_monthly_values)) || any(gross_monthly_values<=0))
    stop("gross_monthly_values must contain positive finite values", call.=FALSE)
  lapply(gross_monthly_values, function(gross) {
    result <- calculate_salary(household, gross, parameters)
    c(list(gross_monthly=gross), result)
  })
}
