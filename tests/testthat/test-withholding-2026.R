# Transcribed values: docs/sources/bedrijfsvoorheffing_2026_fisconet.md and
# docs/sources/personenbelasting_2026_fisconet.md (FOD Financiën, Fisconet, 2026-11-25).
payroll <- yaml::read_yaml(file.path("..","..","params","2026","payroll.yaml"))
federal <- yaml::read_yaml(file.path("..","..","params","2026","federal.yaml"))
bv <- payroll$professional_withholding
fisconet <- "^https://www\\.minfin\\.fgov\\.be/myminfin-web/pages/public/fisconet/document/[0-9a-f-]{36}$"

testthat::test_that("withholding periods are contiguous, confirmed and sourced on Fisconet", {
  testthat::expect_identical(names(bv$periods), c("2026_01","2026_08","2026_11"))
  spans <- vapply(bv$periods, function(p) paste(p$effective_from, p$effective_to), "")
  testthat::expect_identical(unname(spans), c("2026-01-01 2026-07-31","2026-08-01 2026-10-31","2026-11-01 2026-12-31"))
  for (k in names(bv$periods)) {
    validate_parameter_provenance(bv$periods[[k]], k)
    testthat::expect_identical(bv$periods[[k]]$status, "confirmed")
    testthat::expect_match(bv$periods[[k]]$source_url, fisconet)
  }
  validate_parameter_provenance(bv$method, "method")
  testthat::expect_null(bv$status)
})

testthat::test_that("printed cumulative amounts follow from the rates with half-up rounding", {
  for (p in bv$periods) {
    v <- p$value; s <- v$base_scale
    testthat::expect_equal(round_half_up(16710 * 0.2675), s[[2]]$tax_at_lower)
    testthat::expect_equal(round_half_up(s[[2]]$tax_at_lower + 12790 * 0.428), s[[3]]$tax_at_lower)
    testthat::expect_equal(round_half_up(s[[3]]$tax_at_lower + 21550 * 0.4815), s[[4]]$tax_at_lower)
    testthat::expect_equal(round_half_up(v$tax_free_sum * 0.2675), v$tax_on_tax_free_sum)
    testthat::expect_equal(round_half_up(2 * v$tax_on_tax_free_sum), v$marital_quotient$tax_on_two_tax_free_sums)
    testthat::expect_equal(round_half_up(6070 / 0.3), v$professional_expenses$threshold_annual)
  }
  testthat::expect_equal(bv$periods[["2026_01"]]$value$tax_free_sum, 11170)
  testthat::expect_equal(bv$periods[["2026_11"]]$value$tax_free_sum, 11550)
})

testthat::test_that("period values match the official tables", {
  jan <- bv$periods[["2026_01"]]$value; aug <- bv$periods[["2026_08"]]$value; nov <- bv$periods[["2026_11"]]$value
  testthat::expect_equal(unname(unlist(jan$children_reduction$by_count)), c(624,1656,4404,7620,11100,14592,18120,21996))
  testthat::expect_equal(unname(unlist(nov$children_reduction$by_count)), c(684,1644,4344,7488,10884,14292,17712,21492))
  testthat::expect_equal(c(jan$children_reduction$per_child_above_eight, nov$children_reduction$per_child_above_eight), c(3864, 3780))
  testthat::expect_equal(jan$other_family_reductions$single_or_spouse_with_income$single_parent_with_children, 624)
  testthat::expect_equal(nov$other_family_reductions$single_or_spouse_with_income$single_parent_with_children, 636)
  testthat::expect_equal(nov$other_family_reductions$all$disabled_beneficiary, 648)
  testthat::expect_equal(nov$marital_quotient$maximum_other_cases, 11780)
  testthat::expect_equal(c(jan$work_bonus_reduction$luik_b, aug$work_bonus_reduction$luik_b, nov$work_bonus_reduction$luik_b),
                         c(0.5254, 0.63, 0.63))
  jan$work_bonus_reduction <- NULL; aug$work_bonus_reduction <- NULL
  testthat::expect_identical(aug, jan)
})

testthat::test_that("the dispatcher keeps blocking on the withholding", {
  h <- new_household("flanders","Leuven",2026,2027)
  params <- list(income_year=2026, assessment_year=2027,
    social_security=list(employee_contribution=list(rate=list(status="confirmed",value=0.1307))),
    payroll=payroll)
  r <- calculate_salary(h, 3500, params)
  testthat::expect_equal(r$status, "blocked")
  testthat::expect_true("professional withholding" %in% r$missing)
})

testthat::test_that("personal income tax AJ 2027 values and Fisconet provenance", {
  pit <- federal$personal_income_tax
  for (k in c("brackets","basic_personal_tax_allowance","disabled_taxpayer_increase","dependant_increases","tax_on_tax_free_sum")) {
    validate_parameter_provenance(pit[[k]], k)
    testthat::expect_match(pit[[k]]$source_url, fisconet)
  }
  testthat::expect_equal(pit$basic_personal_tax_allowance$value, 11550)
  testthat::expect_equal(vapply(pit$brackets$value, function(b) b$upper %||% Inf, 0), c(16720, 29510, 51070, Inf))
  testthat::expect_equal(vapply(pit$tax_on_tax_free_sum$value, function(b) b$rate, 0), c(0.25, 0.30, 0.40, 0.45, 0.50))
  testthat::expect_equal(unname(unlist(pit$dependant_increases$value$children_total_by_count)), c(2130, 5130, 11440, 18510))
  testthat::expect_equal(payroll$professional_expenses$value$employees_maximum, 6070)
  validate_parameter_provenance(payroll$professional_expenses, "professional_expenses")
})
