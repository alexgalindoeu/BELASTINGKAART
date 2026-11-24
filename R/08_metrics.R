# Descriptive metrics for future household comparisons and scenario analysis.
weighted_mean_safe <- function(x, weights=rep(1,length(x))) {
  if (length(x)!=length(weights) || any(!is.finite(weights)) || any(weights<0) || sum(weights)<=0)
    stop("Invalid weights", call.=FALSE)
  ok <- is.finite(x) & weights>0
  if (!any(ok)) return(NA_real_)
  sum(x[ok]*weights[ok])/sum(weights[ok])
}

effective_rate <- function(tax, gross_income) {
  if (any(!is.finite(c(tax,gross_income))) || gross_income < 0)
    stop("Inputs must be finite and gross income non-negative", call.=FALSE)
  if (gross_income==0) return(NA_real_)
  tax/gross_income
}
