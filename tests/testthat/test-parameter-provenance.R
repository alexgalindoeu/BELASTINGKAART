testthat::test_that("a confirmed parameter requires an effective date and official source", {
  p <- list(status = "confirmed", jurisdiction = "federal", income_year = 2026,
            source_name = "FPS Finance", source_url = "https://fin.belgium.be/",
            source_title = "Official source", retrieved_at = "2026-11-24",
            unit = "fraction", rounding = "none", notes = "Test",
            effective_from = "2026-01-01")
  testthat::expect_invisible(validate_parameter_provenance(p))
})

testthat::test_that("private sources are rejected even when they use HTTPS", {
  p <- list(status = "confirmed", jurisdiction = "federal", income_year = 2026,
            source_name = "Private tax site", source_url = "https://example.com/tax",
            source_title = "Not official", retrieved_at = "2026-11-24",
            unit = "EUR", rounding = "none", notes = "Must fail",
            effective_from = "2026-01-01")
  testthat::expect_error(validate_parameter_provenance(p), "official-source allowlist")
})

testthat::test_that("pending parameters cannot be used for public calculations", {
  testthat::expect_false(parameter_is_usable(list(status = "pending")))
})

testthat::test_that("progressive scale utility applies marginal brackets and rejects malformed scales", {
  brackets <- list(list(upper = 10000, rate = 0.1), list(upper = Inf, rate = 0.2))
  testthat::expect_equal(apply_progressive_scale(15000, brackets), 2000)
  testthat::expect_error(apply_progressive_scale(15000,
    list(list(upper=10000,rate=0.1),list(upper=9000,rate=0.2))),"strictly increasing")
})
