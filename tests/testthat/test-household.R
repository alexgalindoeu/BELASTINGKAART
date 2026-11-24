testthat::test_that("Belgian household validates region and year pair", {
  h <- new_household("flanders","Leuven",2026,2027)
  testthat::expect_s3_class(h,"belastingkaart_household")
  testthat::expect_invisible(validate_household(h))
  testthat::expect_error(new_household("basque","Leuven",2026,2027),"region")
  testthat::expect_error(new_household("flanders","Leuven",2027,2026),"assessment_year")
})
