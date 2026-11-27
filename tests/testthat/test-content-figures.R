fx <- jsonlite::fromJSON(file.path("..","..","test","fixtures","content_figures.json"), simplifyVector = FALSE)
content <- read_content_parameters(2026, base = file.path("..","..","params"))
json <- jsonlite::fromJSON(file.path("..","..","web","data","parameters.json"), simplifyVector = FALSE)

walk_params <- function(node, path = character()) {
  if (is_parameter_node(node)) return(list(setNames(list(node), paste(path, collapse = "."))))
  if (!is.list(node) || is.null(names(node))) return(list())
  unlist(lapply(names(node), function(k) walk_params(node[[k]], c(path, k))), recursive = FALSE)
}

testthat::test_that("content figures match the shared R/JS fixture", {
  for (c in fx$cases) testthat::expect_identical(content_figure(content, c$path, c$fmt), c$expected, label = c$path)
  for (c in fx$announced) testthat::expect_identical(content_figure(content, c$path, c$fmt, announced = TRUE), c$expected, label = c$path)
  for (c in fx$refused) testthat::expect_error(content_figure(content, c$path, c$fmt), label = c$path)
  testthat::expect_error(content_figure(content, "zelfstandigen.spouse_income_limit", "eur", announced = TRUE), "announced")
})

testthat::test_that("every content parameter carries official provenance", {
  params <- unlist(lapply(names(content), function(s) walk_params(content[[s]], s)), recursive = FALSE)
  testthat::expect_gte(length(params), 15L)
  for (id in names(params)) {
    validate_parameter_provenance(params[[id]], id)
    p <- params[[id]]
    if (identical(p$status, "confirmed")) testthat::expect_false(is.null(p$value), label = id)
    if (isTRUE(p$announced)) testthat::expect_identical(p$status, "provisional", label = id)
  }
  testthat::expect_identical(content$zelfstandigen$contributions_2026$status, "confirmed")
  for (id in c("spouse_income_limit", "affiliation_fine", "side_occupation_reduced_band"))
    testthat::expect_identical(content$zelfstandigen[[id]]$status, "provisional", label = id)
  testthat::expect_identical(content$wonen$supplementary_duties_surcharge$status, "provisional")
})

testthat::test_that("the browser dataset carries the same content parameters (R/JS parity)", {
  for (s in content_sections) testthat::expect_equal(json[[s]], jsonlite::fromJSON(jsonlite::toJSON(content[[s]], auto_unbox = TRUE, null = "null", na = "null", digits = NA), simplifyVector = FALSE), label = s)
  testthat::expect_identical(json$zelfstandigen$contributions_2026$value$revaluation_coefficient, 1.07236269)
})

testthat::test_that("Belgian number formatting", {
  testthat::expect_identical(format_be(1234567.891, 2), "1.234.567,89")
  testthat::expect_identical(format_figure(3000, "eur"), "3.000")
  testthat::expect_identical(format_figure(0.1416, "pct"), "14,16")
  testthat::expect_identical(format_figure(0.07, "pct"), "7")
  testthat::expect_error(format_figure(1, "xyz"), "Unknown")
})
