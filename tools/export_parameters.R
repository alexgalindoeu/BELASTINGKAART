#!/usr/bin/env Rscript
# Export YAML parameters to the browser dataset. Run from repository root.
if (!requireNamespace("yaml", quietly = TRUE) ||
    !requireNamespace("jsonlite", quietly = TRUE)) {
  stop("Install the R packages 'yaml' and 'jsonlite'.")
}
args <- commandArgs(trailingOnly = TRUE)
check_only <- "--check" %in% args
year <- Sys.getenv("BK_INCOME_YEAR", "2026")
base <- file.path("params", year)
if (!dir.exists(base)) stop("No parameter directory for income year ", year)
federal <- yaml::read_yaml(file.path(base, "federal.yaml"))
social <- yaml::read_yaml(file.path(base, "social_security.yaml"))
payroll <- yaml::read_yaml(file.path(base, "payroll.yaml"))
payload <- list(
  country = "BE",
  income_year = as.integer(year),
  assessment_year = federal$meta$assessment_year,
  generated_from = paste0("params/", year, "/*.yaml"),
  generated_at = as.character(max(c(federal$personal_income_tax$brackets$retrieved_at, social$employee_contribution$rate$retrieved_at))),
  federal = federal[names(federal) != "meta"],
  social_security = social[names(social) != "meta"],
  payroll = payroll[names(payroll) != "meta"],
  calculation_status = "blocked_until_all_required_parameters_confirmed"
)
json <- jsonlite::toJSON(payload, auto_unbox = TRUE, pretty = TRUE, null = "null", na = "null")
out <- file.path("web", "data", "parameters.json")
if (check_only) {
  if (!file.exists(out)) stop(out, " is missing; run Rscript tools/export_parameters.R")
  actual <- jsonlite::fromJSON(paste(readLines(out, warn = FALSE), collapse = "\n"), simplifyVector = FALSE)
  expected <- jsonlite::fromJSON(json, simplifyVector = FALSE)
  if (!identical(actual, expected)) stop(out, " is stale; run Rscript tools/export_parameters.R")
  message("Generated parameter JSON is up to date.")
} else {
  dir.create(file.path("web", "data"), showWarnings = FALSE, recursive = TRUE)
  writeLines(json, out, useBytes = TRUE)
  message("Wrote ", out)
}
