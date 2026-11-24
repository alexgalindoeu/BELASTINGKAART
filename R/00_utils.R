# Belastingkaart — generic calculation utilities

`%||%` <- function(x, y) {
  if (is.null(x) || length(x) == 0L || (length(x) == 1L && is.na(x))) y else x
}

round_money <- function(x) round(x + 1e-9, 2)

apply_progressive_scale <- function(base, brackets) {
  if (length(base) != 1L || is.na(base) || base <= 0) return(0)
  tax <- 0
  lower <- 0
  for (bracket in brackets) {
    upper <- bracket$upper
    rate <- bracket$rate
    if (is.null(upper) || is.infinite(upper) || base <= upper) {
      return(tax + (base - lower) * rate)
    }
    tax <- tax + (upper - lower) * rate
    lower <- upper
  }
  tax
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
  if (parameter$status == "confirmed" && (!grepl("^https://", parameter$source_url) ||
      is.null(parameter$effective_from))) {
    stop(sprintf("%s: confirmed parameter needs official URL and effective_from", path), call. = FALSE)
  }
  invisible(TRUE)
}

parameter_is_usable <- function(parameter) identical(parameter$status, "confirmed")
