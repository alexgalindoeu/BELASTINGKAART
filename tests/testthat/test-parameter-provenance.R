testthat::test_that("a confirmed parameter requires an effective date", {
  p <- list(status = "confirmed", jurisdiction = "federal", income_year = 2026,
            source_name = "RSZ", source_url = "https://www.socialsecurity.be/",
            source_title = "Official source", retrieved_at = "2026-11-24",
            unit = "fraction", rounding = "none", notes = "Test",
            effective_from = "2026-01-01")
  testthat::expect_invisible(validate_parameter_provenance(p))
})

testthat::test_that("pending parameters cannot be used for public calculations", {
  p <- list(status = "pending")
  testthat::expect_false(parameter_is_usable(p))
})

testthat::test_that("progressive scale utility applies marginal brackets", {
  brackets <- list(list(upper = 10000, rate = 0.1), list(upper = Inf, rate = 0.2))
  testthat::expect_equal(apply_progressive_scale(15000, brackets), 2000)
})
