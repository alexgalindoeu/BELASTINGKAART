# Shared R/JS fixture for the 2026 bedrijfsvoorheffing engine (monthly wages, residents).
# Expected values: independent exact-decimal computation from params/2026/payroll.yaml,
# transcribed from Fisconet (Bijlage III KB/WIB 92 and sleutelformules), 2026-11-25.
fx <- jsonlite::fromJSON(file.path("..","..","test","fixtures","bedrijfsvoorheffing_cases.json"), simplifyVector = FALSE)
payroll <- yaml::read_yaml(file.path("..","..","params","2026","payroll.yaml"))

step_values <- function(steps) setNames(vapply(steps, function(s) s$value, 0), vapply(steps, function(s) s$id, ""))

testthat::test_that("engine matches every fixture case to the cent, step by step", {
  for (c in fx$cases) {
    r <- calculate_professional_withholding(c$input, payroll)
    testthat::expect_identical(r$status, c$expected_status %||% "confirmed", label = c$name)
    if (identical(r$status, "confirmed")) {
      testthat::expect_identical(r$period, c$period, label = c$name)
      sv <- step_values(r$steps)
      for (k in names(c$expected))
        testthat::expect_equal(unname(sv[[k]]), c$expected[[k]], tolerance = 1e-9, label = paste(c$name, k))
      testthat::expect_equal(r$withholding, c$expected$withholding, tolerance = 1e-9, label = c$name)
    } else {
      testthat::expect_null(r$withholding)
      testthat::expect_true(length(r$missing) > 0)
    }
  }
})

testthat::test_that("the engine blocks when the method or the period is not confirmed", {
  p <- payroll
  p$professional_withholding$periods[["2026_11"]]$status <- "provisional"
  r <- calculate_professional_withholding(list(pay_date = "2026-11-25", gross_monthly = 3000), p)
  testthat::expect_identical(r$status, "blocked")
  testthat::expect_null(r$withholding)
  testthat::expect_identical(calculate_professional_withholding(list(pay_date = "2026-03-15", gross_monthly = 3000), p)$status, "confirmed")
  p$professional_withholding$method$status <- "pending"
  testthat::expect_identical(calculate_professional_withholding(list(pay_date = "2026-03-15", gross_monthly = 3000), p)$status, "blocked")
  r <- calculate_professional_withholding(list(pay_date = "2027-01-01", gross_monthly = 3000), payroll)
  testthat::expect_identical(r$status, "blocked")
})

testthat::test_that("the period is chosen by payment date; luik B is 63 pct from August", {
  testthat::expect_identical(bv_period(payroll$professional_withholding, "2026-07-31")$key, "2026_01")
  testthat::expect_identical(bv_period(payroll$professional_withholding, "2026-08-01")$key, "2026_08")
  testthat::expect_identical(bv_period(payroll$professional_withholding, "2026-11-01")$key, "2026_11")
  testthat::expect_equal(bv_period(payroll$professional_withholding, "2026-08-01")$value$work_bonus_reduction$luik_b, 0.63)
  testthat::expect_error(bv_period(payroll$professional_withholding, "2025-12-31"), "No withholding period")
})

testthat::test_that("inconsistent inputs are rejected", {
  v <- payroll$professional_withholding$periods[["2026_01"]]$value
  testthat::expect_error(bv_compute(list(gross_monthly = 3000, spouse_situation = "married"), v), "Unknown spouse_situation")
  testthat::expect_error(bv_compute(list(gross_monthly = 3000, single_parent = TRUE), v), "single_parent")
  testthat::expect_error(bv_compute(list(gross_monthly = 3000, spouse_disabled = TRUE), v), "spouse_disabled")
  testthat::expect_error(bv_compute(list(gross_monthly = 3000, children = 1, children_disabled = 2), v), "children_disabled")
  testthat::expect_error(bv_compute(list(gross_monthly = 3000, children = 1.5), v), "integer")
  testthat::expect_error(bv_compute(list(gross_monthly = 100, social_contributions = 200), v), "exceed")
  testthat::expect_error(bv_compute(list(gross_monthly = -1), v), "non-negative")
})

testthat::test_that("the public dispatcher stays blocked", {
  testthat::expect_null(payroll$professional_withholding$status)
})
