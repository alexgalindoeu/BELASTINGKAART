# Employee social-security components. Never use provisional parameters in a result.
parameter_value <- function(x, label="parameter") {
  if (is.null(x) || !identical(x$status, "confirmed") || is.null(x$value))
    stop(label, " is not officially confirmed for this calculation year", call.=FALSE)
  as.numeric(x$value)
}

employee_social_security <- function(gross_monthly, social_parameters) {
  if (length(gross_monthly)!=1L || !is.finite(gross_monthly) || gross_monthly<0)
    stop("gross_monthly must be a non-negative finite number", call.=FALSE)
  rate <- parameter_value(social_parameters$employee_contribution$rate,
                          "Employee social-security rate")
  bonus <- social_parameters$employee_contribution$work_bonus
  bonus_value <- if (is.null(bonus) || !identical(bonus$status,"confirmed"))
    NA_real_ else as.numeric(bonus$value)
  if (is.na(bonus_value))
    stop("The work bonus is not confirmed; employee contributions cannot yet be calculated safely", call.=FALSE)
  list(gross_monthly=gross_monthly, standard_contribution=round(gross_monthly*rate,2),
       work_bonus=bonus_value, net_contribution=round(gross_monthly*rate-bonus_value,2))
}
