# Official figures shown on the content pages (audit P2-16). R mirror of
# tools/lib/figures.mjs; shared cases in test/fixtures/content_figures.json.
# A figure may be shown only when its parameter is confirmed, or, with
# announced = TRUE, when it is a provisional parameter flagged `announced: true`.

content_sections <- c("zelfstandigen", "pensioensparen", "wonen")

read_content_parameters <- function(income_year = 2026, base = "params") {
  out <- lapply(content_sections, function(s) {
    x <- read_parameters(income_year, paste0(s, ".yaml"), base = base)
    x[names(x) != "meta"]
  })
  names(out) <- content_sections
  out
}

is_parameter_node <- function(x) is.list(x) && !is.null(x$status) && !is.null(x$source_url)

# Belgian notation shared by NL and FR pages: 75.024,54 / 3.000 / 20,50.
format_be <- function(x, decimals) {
  s <- formatC(abs(x), format = "f", digits = decimals, big.mark = ".", decimal.mark = ",")
  paste0(if (x < 0) "-" else "", s)
}

format_figure <- function(value, fmt = "eur") {
  if (!is.numeric(value) || length(value) != 1L || !is.finite(value)) stop("Figure is not a number", call. = FALSE)
  fix <- function(v) round(v, 10)
  if (fmt == "eur") return(format_be(value, if (fix(value) == round(fix(value))) 0L else 2L))
  if (fmt == "int") return(format_be(value, 0L))
  if (grepl("^pct[0-9]?$", fmt)) {
    p <- fix(value * 100)
    d <- if (nchar(fmt) == 4L) as.integer(substr(fmt, 4, 4)) else {
      txt <- format(p, scientific = FALSE, trim = TRUE, digits = 15)
      if (grepl("\\.", txt)) nchar(sub("^[^.]*\\.", "", txt)) else 0L
    }
    return(format_be(p, d))
  }
  if (grepl("^d[0-9]+$", fmt)) return(format_be(value, as.integer(sub("^d", "", fmt))))
  stop("Unknown figure format: ", fmt, call. = FALSE)
}

resolve_content_figure <- function(data, path) {
  keys <- strsplit(path, ".", fixed = TRUE)[[1]]
  node <- data; i <- 1L
  while (i <= length(keys) && !is_parameter_node(node)) {
    node <- node[[keys[i]]]
    if (is.null(node)) stop("Unknown parameter path: ", path, call. = FALSE)
    i <- i + 1L
  }
  if (!is_parameter_node(node)) stop("Path does not reach a parameter: ", path, call. = FALSE)
  value <- node$value
  while (i <= length(keys)) {
    value <- value[[keys[i]]]
    if (is.null(value)) stop("Unknown value path: ", path, call. = FALSE)
    i <- i + 1L
  }
  list(param = node, value = value)
}

content_figure <- function(data, path, fmt = "eur", announced = FALSE) {
  r <- resolve_content_figure(data, path)
  if (announced) {
    if (!(identical(r$param$status, "provisional") && isTRUE(r$param$announced)))
      stop(path, ": 'announced:' is only allowed for a provisional parameter flagged announced: true", call. = FALSE)
  } else if (!identical(r$param$status, "confirmed")) {
    stop(path, ": parameter status is '", r$param$status, "'; only confirmed figures may be shown", call. = FALSE)
  }
  format_figure(r$value, fmt)
}
