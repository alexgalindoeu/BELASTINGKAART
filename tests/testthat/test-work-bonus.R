fx <- jsonlite::fromJSON(file.path("..","..","test","fixtures","work_bonus_cases.json"), simplifyVector = FALSE)
wb <- yaml::read_yaml(file.path("..","..","params","2026","social_security.yaml"))$employee_contribution$work_bonus

period_for <- function(key) if (key == "hist") fx$historical_2001_period else { p <- wb$periods[[key]]; p$key <- key; p }

testthat::test_that("work-bonus cases match the shared R/JS fixture (incl. official RSZ examples)", {
  for (c in fx$cases) {
    w <- c$wage
    ref <- work_bonus_reference_wage(w$W, w$regime, J = w$J, D = w$D, H = w$H, U = w$U)
    m <- work_bonus_month(period_for(c$period), ref$S, ref$fraction, c$category, c$contribution_due)
    e <- c$expected
    lab <- c$name
    testthat::expect_equal(ref$S, e$S, tolerance = 1e-9, label = paste(lab, "S"))
    testthat::expect_equal(ref$fraction, e$fraction, tolerance = 1e-9, label = paste(lab, "fraction"))
    for (k in c("RA","RB","PA","PB","P"))
      testthat::expect_equal(m[[k]], e[[k]], tolerance = 1e-9, label = paste(lab, k))
  }
})

testthat::test_that("the period in force is selected by date and Q4 2026 is pending", {
  for (s in fx$period_selection)
    testthat::expect_equal(work_bonus_period(wb, s$date)$key, s$key, label = s$date)
  testthat::expect_equal(work_bonus_period(wb, "2026-10-01")$status, "pending")
  testthat::expect_error(work_bonus_month(work_bonus_period(wb, "2026-11-15"), 2000, 1, "bedienden", 261.40),
                         "not available")
  testthat::expect_error(work_bonus_period(wb, "2025-12-31"), "No work-bonus period")
  testthat::expect_error(work_bonus_period(wb, "2027-01-01"), "No work-bonus period")
})

testthat::test_that("the work bonus blocks public results while Q4 and the method are not confirmed", {
  testthat::expect_false(work_bonus_is_confirmed(wb))
  testthat::expect_identical(wb$method$status, "provisional")
})

testthat::test_that("every 2026 work-bonus period carries official provenance", {
  for (k in names(wb$periods)) validate_parameter_provenance(wb$periods[[k]], k)
  validate_parameter_provenance(wb$method, "method")
  testthat::succeed()
})

testthat::test_that("half-up rounding follows the RSZ rule, not R's round-half-even", {
  testthat::expect_equal(round_half_up(0.125), 0.13)
  testthat::expect_equal(round_half_up(2.675), 2.68)
  testthat::expect_equal(round_half_up(15/22), 0.68)
})

testthat::test_that("invalid regimes are rejected", {
  testthat::expect_error(work_bonus_reference_wage(2000, "full_time", J = 23, D = 22), "J <= D")
  testthat::expect_error(work_bonus_reference_wage(2000, "part_time", H = 0, U = 160), "H > 0")
  testthat::expect_error(work_bonus_basic_amount(2000, wb$periods[["2026_09"]]$value$luik_a, "kunstenaars"), "Unknown")
})
