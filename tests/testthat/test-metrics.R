testthat::test_that("basic metrics validate inputs", {
  testthat::expect_equal(weighted_mean_safe(c(10,20),c(1,3)),17.5)
  testthat::expect_equal(effective_rate(250,1000),0.25)
  testthat::expect_true(is.na(effective_rate(0,0)))
  testthat::expect_error(weighted_mean_safe(c(1,2),c(1,-1)),"Invalid weights")
})
