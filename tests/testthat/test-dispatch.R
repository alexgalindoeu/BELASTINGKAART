testthat::test_that("salary dispatcher fails closed when official payroll parameters are pending", {
  h <- new_household("flanders","Leuven",2026,2027)
  p <- list(income_year=2026,assessment_year=2027,
    social_security=list(employee_contribution=list(
      rate=list(status="provisional",value=0.1307),
      work_bonus=list(method=list(status="provisional"),periods=list(x=list(status="pending",value=NULL))))),
    payroll=list(professional_withholding=list(status="pending"),
      professional_expenses=list(status="pending")))
  result <- calculate_salary(h,3500,p)
  testthat::expect_equal(result$status,"blocked")
  testthat::expect_true("work bonus" %in% result$missing)
  testthat::expect_error(employee_social_security(3500,p$social_security),
                         "not officially confirmed")
})

testthat::test_that("the special social-security contribution blocks the result until method and all periods are confirmed", {
  p <- yaml::read_yaml(file.path("..","..","params","2026","payroll.yaml"))$special_social_security_contribution
  testthat::expect_false(special_contribution_is_confirmed(p))
  for (k in names(p$periods)) validate_parameter_provenance(p$periods[[k]], k)
  validate_parameter_provenance(p$method, "method")
  h <- new_household("flanders","Leuven",2026,2027)
  params <- list(income_year=2026, assessment_year=2027,
    social_security=list(employee_contribution=list(rate=list(status="confirmed",value=0.1307))),
    payroll=list(special_social_security_contribution=p))
  testthat::expect_true("special social-security contribution" %in% calculate_salary(h,3500,params)$missing)
})
