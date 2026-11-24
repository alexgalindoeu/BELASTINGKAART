# Municipal additional tax. Rates are municipality- and year-specific.
municipal_surcharge <- function(federal_tax, municipality, municipal_parameters) {
  if (!is.finite(federal_tax) || federal_tax < 0)
    stop("federal_tax must be non-negative", call.=FALSE)
  if (!nzchar(trimws(municipality))) stop("A municipality is required", call.=FALSE)
  entry <- municipal_parameters[[municipality]]
  if (is.null(entry) || !identical(entry$status,"confirmed") || is.null(entry$rate))
    stop("No officially confirmed municipal surcharge for this municipality and year", call.=FALSE)
  round(federal_tax * as.numeric(entry$rate), 2)
}
