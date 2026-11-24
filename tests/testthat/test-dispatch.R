testthat::test_that("salary dispatcher fails closed when official payroll parameters are pending", {
  h <- new_household("flanders","Leuven",2026,2027)
  p <- list(income_year=2026,assessment_year=2027,
    social_security=list(employee_contribution=list(
      rate=list(status="provisional",value=0.1307),
      work_bonus=list(status="pending",value=NULL))),
    payroll=list(professional_withholding=list(status="pending"),
      professional_expenses=list(status="pending")))
  result <- calculate_salary(h,3500,p)
  testthat::expect_equal(result$status,"blocked")
  testthat::expect_true("work bonus" %in% result$missing)
  testthat::expect_error(employee_social_security(3500,p$social_security),
                         "not officially confirmed")
})
