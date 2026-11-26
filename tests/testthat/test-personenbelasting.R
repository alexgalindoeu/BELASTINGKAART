fx <- jsonlite::fromJSON(file.path("..","..","test","fixtures","personenbelasting_cases.json"), simplifyVector = FALSE)
sp <- fx$synthetic_parameters
fed <- sp$federal$personal_income_tax
real <- list(
  federal = yaml::read_yaml(file.path("..","..","params","2026","federal.yaml")),
  payroll = yaml::read_yaml(file.path("..","..","params","2026","payroll.yaml")),
  social_security = yaml::read_yaml(file.path("..","..","params","2026","social_security.yaml")))
eq <- function(a, b, lab) testthat::expect_equal(a, b, tolerance = 1e-9, label = lab)

testthat::test_that("fixture parameters are labelled synthetic, not 2026", {
  testthat::expect_identical(sp$label, "synthetic, not 2026")
})

testthat::test_that("net professional income: art. 23 § 2, 51 and 52, 7° (shared fixture)", {
  for (c in fx$net_professional_income) {
    r <- pb_net_professional_income(c$taxable_wages, c$social_contributions, sp$payroll$professional_expenses)
    for (k in names(c$expected)) eq(r[[k]], c$expected[[k]], paste(c$name, k))
  }
  testthat::expect_error(pb_net_professional_income(100, 200, sp$payroll$professional_expenses), "exceed")
  testthat::expect_error(pb_net_professional_income(100, 0, list(status = "pending", value = NULL)), "not officially confirmed")
})

testthat::test_that("basic tax: art. 130 at bracket boundaries, no rounding", {
  for (c in fx$basic_tax) eq(pb_basic_tax(c$base, fed$brackets), c$expected, paste("base", c$base))
  testthat::expect_error(pb_basic_tax(-1, fed$brackets), "non-negative")
})

testthat::test_that("tax-free sum: art. 131-132 (disabled count double, > 4 children)", {
  for (c in fx$tax_free_sum) {
    r <- pb_tax_free_sum(c$person, sp$federal)
    for (k in names(c$expected)) eq(r[[k]], c$expected[[k]], paste(c$name, k))
  }
  testthat::expect_error(pb_tax_free_sum(list(children = 1, children_disabled = 2), sp$federal), "cannot exceed")
  testthat::expect_error(pb_tax_free_sum(list(children = 1.5), sp$federal), "integer")
})

testthat::test_that("art. 134 § 2: own scale, several brackets, reduction capped at the tax", {
  for (c in fx$reduction) {
    r <- pb_tax_free_sum_reduction(c$basic_tax, c$tax_free_sum, fed$tax_on_tax_free_sum)
    for (k in names(c$expected)) eq(r[[k]], c$expected[[k]], paste(c$name, k))
    testthat::expect_gte(r$tax_after_reduction, 0)
  }
})

testthat::test_that("municipal surcharge: art. 466-468, one decimal, fails closed", {
  for (c in fx$municipal) eq(pb_municipal_surcharge(c$total_tax, list(status = "confirmed", value = c$rate)), c$expected, paste(c$total_tax, c$rate))
  for (r in fx$municipal_invalid_rates)
    testthat::expect_error(pb_municipal_surcharge(1000, list(status = "confirmed", value = r)), "decimal|percentage")
  testthat::expect_error(pb_municipal_surcharge(1000, list(status = "pending", value = NULL)), "not officially confirmed")
  testthat::expect_error(pb_municipal_surcharge(1000, NULL), "not officially confirmed")
})

testthat::test_that("not-modelled reductions report themselves", {
  h <- pb_not_modelled_reductions()
  testthat::expect_true(all(vapply(h, function(x) identical(x$status, "not_modelled") && is.null(x$amount), TRUE)))
  testthat::expect_true("fiscal_work_bonus_289ter" %in% vapply(h, `[[`, "", "id"))
})

testthat::test_that("top-level with synthetic parameters: amounts match, status stays not_modelled", {
  for (c in fx$full) {
    r <- pb_calculate(c$input, sp)
    testthat::expect_identical(r$status, c$expected_status)
    testthat::expect_length(r$missing, 0)
    am <- setNames(lapply(r$steps, `[[`, "amount"), vapply(r$steps, `[[`, "", "id"))
    for (k in names(c$expected_steps)) eq(am[[k]], c$expected_steps[[k]], paste(c$name, k))
    testthat::expect_null(am$total_tax); testthat::expect_null(am$municipal_surcharge)
    for (s in r$steps) testthat::expect_true(nzchar(s$label_nl) && nzchar(s$label_fr) && nzchar(s$source))
  }
  testthat::expect_true(any(grepl("joint", pb_calculate(c(fx$full[[1]]$input, assessment = "joint"), sp)$not_modelled)))
})

testthat::test_that("top-level with the real 2026 parameters is blocked and shows no amount", {
  r <- pb_calculate(list(taxable_wages = 40000, social_contributions = 5228, municipality = "24062", children = 1), real)
  testthat::expect_identical(r$status, "blocked")
  testthat::expect_true(any(grepl("municipal surcharge rate", r$missing)))
  testthat::expect_true(any(grepl("social-security rate", r$missing)))
  testthat::expect_true(any(grepl("werkbonus", r$missing)))
  testthat::expect_false(any(grepl("art. 130|art. 131|art. 132|art. 134|professional expenses", r$missing)))
  testthat::expect_true(all(vapply(r$steps, function(s) is.null(s$amount), TRUE)))
  rb <- pb_calculate(list(taxable_wages = 1, municipality = "24062"),
    within(real, federal$personal_income_tax$tax_on_tax_free_sum$status <- "pending"))
  testthat::expect_true(any(grepl("art. 134", rb$missing)))
})

testthat::test_that("real 2026 confirmed parameters are read by their names", {
  r <- pb_tax_free_sum(list(children = 2), real$federal)
  eq(r$tax_free_sum, 11550 + 5130, "2026 tfs 2 children")
  red <- pb_tax_free_sum_reduction(1e6, 11550, real$federal$personal_income_tax$tax_on_tax_free_sum)
  eq(red$tax_on_tax_free_sum, 11550 * 0.25, "2026 tax on basic tfs")
  eq(pb_net_professional_income(30000, 0, real$payroll$professional_expenses)$professional_expenses, 6070, "2026 cap")
})
