# Load and validate versioned Belgian parameter files.

read_parameters <- function(income_year, file, base = "params") {
  path <- file.path(base, as.character(income_year), file)
  if (!file.exists(path)) stop(sprintf("Missing parameter file: %s", path), call. = FALSE)
  if (!requireNamespace("yaml", quietly = TRUE)) stop("Package 'yaml' is required.", call. = FALSE)
  yaml::read_yaml(path)
}

available_income_years <- function(base = "params") {
  dirs <- list.dirs(base, recursive = FALSE, full.names = FALSE)
  sort(as.integer(dirs[grepl("^[0-9]{4}$", dirs)]))
}
