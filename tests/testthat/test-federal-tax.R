testthat::test_that("Belgian federal progressive scale is applied marginally", {
  brackets <- list(
    list(upper = 16720, rate = 0.25),
    list(upper = 29510, rate = 0.40),
    list(upper = 51070, rate = 0.45),
    list(upper = Inf, rate = 0.50)
  )
  expected <- 16720 * 0.25 + (29510 - 16720) * 0.40 + (40000 - 29510) * 0.45
  testthat::expect_equal(calculate_tax_on_taxable_income(40000, brackets), expected)
})

testthat::test_that("negative taxable income is rejected", {
  testthat::expect_error(calculate_tax_on_taxable_income(-1, list()), "non-negative")
})

testthat::test_that("R engine matches the shared R/JS parity fixture", {
  fx <- jsonlite::fromJSON(file.path("..", "..", "test", "fixtures", "progressive_scale_cases.json"),
                           simplifyVector = FALSE)
  for (c in fx$cases) {
    testthat::expect_equal(calculate_tax_on_taxable_income(c$base, fx$brackets), c$expected,
                           tolerance = 1e-9, label = paste("base", c$base))
  }
})
