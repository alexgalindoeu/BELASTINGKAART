# Belastingkaart — generic calculation utilities.

`%||%` <- function(x, y) {
  if (is.null(x) || length(x) == 0L || (length(x) == 1L && is.na(x))) y else x
}

round_money <- function(x) round(x + 1e-9, 2)

apply_progressive_scale <- function(base, brackets) {
  if (length(base) != 1L || !is.finite(base) || base <= 0) return(0)
  if (!is.list(brackets) || length(brackets) == 0L)
    stop("A non-empty progressive scale is required", call.=FALSE)
  tax <- 0
  lower <- 0
  for (bracket in brackets) {
    upper <- bracket$upper
    rate <- bracket$rate
    if (is.null(rate) || !is.finite(rate) || rate < 0)
      stop("Invalid marginal tax rate", call.=FALSE)
    if (is.null(upper)) upper <- Inf
    if (upper <= lower) stop("Progressive tax thresholds must be strictly increasing", call.=FALSE)
    if (base <= upper) return(tax + (base-lower)*rate)
    tax <- tax + (upper-lower)*rate
    lower <- upper
  }
  stop("Progressive scale must include a final open-ended bracket", call.=FALSE)
}

official_source_host <- function(url) {
  if (length(url)!=1L || is.na(url) || !grepl("^https://",url))
    stop("Source URL must use HTTPS",call.=FALSE)
  host <- tolower(sub("^https://([^/:]+).*$","\\1",url))
  allowed <- c("fin.belgium.be","finances.belgium.be","minfin.fgov.be",
    "socialsecurity.be","vlaanderen.be","belasting.vlaanderen.be",
    "fiscaliteit.brussels","finances.wallonie.be","ejustice.just.fgov.be",
    "statbel.fgov.be","emploi.belgique.be","werk.belgie.be")
  if (!any(host==allowed | endsWith(host,paste0(".",allowed))))
    stop("Source domain is not in the Belastingkaart official-source allowlist: ",host,call.=FALSE)
  host
}

validate_parameter_provenance <- function(parameter, path = "parameter") {
  required <- c("status", "jurisdiction", "income_year", "source_name",
                "source_url", "source_title", "retrieved_at", "unit",
                "rounding", "notes")
  missing <- required[!vapply(required, function(k) !is.null(parameter[[k]]), logical(1))]
  if (length(missing)) {
    stop(sprintf("%s: missing provenance fields: %s", path, paste(missing, collapse = ", ")), call. = FALSE)
  }
  if (!parameter$status %in% c("confirmed", "provisional", "pending")) {
    stop(sprintf("%s: invalid status '%s'", path, parameter$status), call. = FALSE)
  }
  official_source_host(parameter$source_url)
  if (parameter$status == "confirmed" && is.null(parameter$effective_from)) {
    stop(sprintf("%s: confirmed parameter needs effective_from", path), call. = FALSE)
  }
  invisible(TRUE)
}

parameter_is_usable <- function(parameter) identical(parameter$status, "confirmed")

# Half-up rounding as written in the RSZ instructions ("0,005 wordt 0,01").
# Base R round() rounds half to even, which is not the official rule.
round_half_up <- function(x, digits = 2L) {
  m <- 10^digits
  sign(x) * floor(abs(x) * m + 0.5 + 1e-9) / m
}
