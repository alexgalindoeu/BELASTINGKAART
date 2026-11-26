# Bedrijfsvoorheffing / précompte professionnel on REGULAR MONTHLY wages of RESIDENT
# employees, income year 2026. Payroll withholding is a cash-flow advance, not the final
# annual tax. Rules: Bijlage III KB/WIB 92 (Deel 1-3) and the FOD sleutelformule
# (Deel I, Hoofdstuk 1, nrs. 6-21), transcribed in docs/sources/. Parameters are read
# from params/2026/payroll.yaml -> professional_withholding (method + periods).
# Every amount is rounded half-up to the cent at every step (Bijlage III nr. 12,
# sleutelformule nr. 3). JS port: web/js/tax-engine.js (BKTaxEngine.withholding).

BV_SPOUSE_SITUATIONS <- c(
  "single",                      # alleenstaande (Bijlage III nr. 4.2)
  "spouse_with_income",          # echtgenoot met eigen beroepsinkomsten (nr. 32)
  "spouse_other_income_le_290",  # nr. 32 + reduction nr. 40.2 (net <= 290 EUR/month)
  "spouse_pension_le_579",       # nr. 32 + reduction nr. 40.3 (pension only, net <= 579)
  "spouse_pension_le_174",       # nr. 33: treated as without income (huwelijksquotiënt)
  "spouse_no_income")            # nr. 34: huwelijksquotiënt

bv_not_modelled_hooks <- function(input) {
  out <- character()
  pt <- input$payment_type %||% "regular_monthly"
  if (!identical(pt, "regular_monthly"))
    out <- c(out, paste0("payment_type '", pt, "' (exceptional pay, holiday pay, 13th month, arrears: Bijlage III nr. 53 e.v.) is not modelled"))
  if (!isTRUE(input$resident %||% TRUE)) out <- c(out, "non-residents (Bijlage III nr. 36.2, Deel 6) are not modelled")
  if (!identical(input$employee_type %||% "employee", "employee"))
    out <- c(out, "bedrijfsleiders (nr. 25.2, 29) are not modelled")
  if (!identical(input$pay_frequency %||% "monthly", "monthly"))
    out <- c(out, "pay other than per month (nrs. 48-50) is not modelled")
  if (isTRUE((input$overtime_hours %||% 0) > 0))
    out <- c(out, "overtime reduction (nr. 45) is not modelled")
  if (isTRUE(input$public_sector_non_contract %||% FALSE))
    out <- c(out, "low-income public-sector reduction (nr. 47) is not modelled")
  out
}

# Period in force on the PAYMENT date (income 'betaald of toegekend').
bv_period <- function(withholding, pay_date) {
  periods <- withholding$periods
  if (is.null(periods) || !length(periods)) stop("No withholding periods available", call.=FALSE)
  d <- as.Date(pay_date)
  for (key in names(periods)) {
    p <- periods[[key]]
    from <- as.Date(as.character(p$effective_from))
    to <- if (is.null(p$effective_to)) as.Date("9999-12-31") else as.Date(as.character(p$effective_to))
    if (d >= from && d <= to) { p$key <- key; return(p) }
  }
  stop("No withholding period covers ", pay_date, call.=FALSE)
}

# Base scale (nr. 31): printed cumulative tax at the lower limit + rate on the slice above.
bv_scale_tax <- function(base, scale) {
  if (base <= 0) return(0)
  lower <- 0
  for (b in scale) {
    up <- b$upper %||% Inf
    if (base <= up) return(round_half_up((b$tax_at_lower %||% 0) + b$rate * (base - lower)))
    lower <- up
  }
  stop("Base scale must end with an open bracket", call.=FALSE)
}

bv_count <- function(x, label) {
  x <- x %||% 0
  if (length(x) != 1L || !is.finite(x) || x < 0 || x != round(x))
    stop(label, " must be a non-negative integer", call.=FALSE)
  as.integer(x)
}
bv_amount <- function(x, label) {
  x <- x %||% 0
  if (length(x) != 1L || !is.finite(x) || x < 0) stop(label, " must be a non-negative amount", call.=FALSE)
  x
}

# Core calculation for one period value. Returns list(withholding, steps).
bv_compute <- function(input, v) {
  gross <- bv_amount(input$gross_monthly, "gross_monthly")
  social <- bv_amount(input$social_contributions, "social_contributions")
  sit <- input$spouse_situation %||% "single"
  if (!sit %in% BV_SPOUSE_SITUATIONS) stop("Unknown spouse_situation: ", sit, call.=FALSE)
  quotient <- sit %in% c("spouse_no_income", "spouse_pension_le_174")
  n_children <- bv_count(input$children, "children")
  n_child_dis <- bv_count(input$children_disabled, "children_disabled")
  if (n_child_dis > n_children) stop("children_disabled cannot exceed children", call.=FALSE)
  n_dep66 <- bv_count(input$dependents_66_care, "dependents_66_care")
  n_dep <- bv_count(input$other_dependents, "other_dependents")
  n_dep_dis <- bv_count(input$other_dependents_disabled, "other_dependents_disabled")
  if (n_dep_dis > n_dep) stop("other_dependents_disabled cannot exceed other_dependents", call.=FALSE)
  if (isTRUE(input$single_parent) && (sit != "single" || n_children == 0))
    stop("single_parent requires spouse_situation 'single' and at least one child (nr. 40.1)", call.=FALSE)
  if (isTRUE(input$spouse_disabled) && !quotient)
    stop("spouse_disabled applies only to a spouse without own income (nr. 41); otherwise it is granted to the spouse (nr. 7)", call.=FALSE)
  if (isTRUE(input$both_spouses_66) && !quotient)
    stop("both_spouses_66 only affects the huwelijksquotiënt", call.=FALSE)

  steps <- list()
  add <- function(id, value, rule) { steps[[length(steps) + 1L]] <<- list(id = id, value = value, rule = rule); value }

  m <- add("taxable_monthly", round_half_up(gross - social), "nr. 25.1 / SF nr. 7, 1°")
  if (m < 0) stop("social_contributions exceed gross_monthly", call.=FALSE)
  ga <- add("annual_gross", round_half_up(m * 12), "nr. 26 / SF nr. 7, 2°")
  pe <- v$professional_expenses
  ex <- add("professional_expenses", min(round_half_up(pe$rate * ga), pe$maximum), "nr. 28 / SF nr. 8, 1°")
  net <- add("net_annual", round_half_up(ga - ex), "nr. 30 / SF nr. 8")

  mq <- v$marital_quotient
  if (quotient) {
    cap <- if (!is.null(mq$maximum)) mq$maximum else if (isTRUE(input$both_spouses_66))
      mq$maximum_both_spouses_66_on_2027_01_01 else mq$maximum_other_cases
    if (is.null(cap)) stop("Marital-quotient cap missing in parameters", call.=FALSE)
    alloc <- add("allocated_to_spouse", min(round_half_up(mq$share * net), cap), "nr. 34.1.1 / SF nr. 11 b")
    ta <- add("tax_a", bv_scale_tax(alloc, v$base_scale), "nr. 34.1.2")
    tb <- add("tax_b", bv_scale_tax(round_half_up(net - alloc), v$base_scale), "nr. 34.1.3")
    basic <- add("basic_tax", round_half_up(ta + tb - mq$tax_on_two_tax_free_sums), "nr. 34.2")
  } else {
    st <- add("scale_tax", bv_scale_tax(net, v$base_scale), "nr. 31")
    basic <- add("basic_tax", round_half_up(st - v$tax_on_tax_free_sum), "nr. 32 / SF nr. 11 a")
  }

  # Children (nr. 38, a disabled child counts for two: nr. 8)
  n <- n_children + n_child_dis
  cr <- v$children_reduction
  by <- unlist(cr$by_count)
  top <- max(as.integer(names(by)))
  ch <- if (n == 0) 0 else if (n <= top) as.numeric(by[[as.character(n)]]) else
    as.numeric(by[[as.character(top)]]) + cr$per_child_above_eight * (n - top)
  add("children_reduction", ch, "nr. 38 (count incl. disabled children twice)")

  of <- v$other_family_reductions
  o <- of$all$disabled_beneficiary * isTRUE(input$self_disabled) +
    of$all$dependant_66_plus_in_care_per_person * n_dep66 +
    of$all$other_dependant_per_person * (n_dep + n_dep_dis)
  if (quotient) {
    o <- o + of$spouse_without_income$disabled_spouse * isTRUE(input$spouse_disabled)
  } else {
    s <- of$single_or_spouse_with_income
    o <- o + s$single_parent_with_children * isTRUE(input$single_parent) +
      s$spouse_income_other_than_pension_net_max_290 * (sit == "spouse_other_income_le_290") +
      s$spouse_pension_only_net_max_579 * (sit == "spouse_pension_le_579")
  }
  add("other_family_reduction", round_half_up(o), "nrs. 39-41")
  red <- add("family_reductions_applied", min(ch + o, max(0, basic)), "SF nr. 13: total may not exceed the basic tax")
  annual <- add("annual_tax", max(0, round_half_up(basic - red)), "SF nr. 9")
  rem <- add("monthly_withholding_before_other_reductions", round_half_up(annual / 12), "nr. 42 / SF nr. 16")

  gi <- round_half_up(0.30 * bv_amount(input$group_insurance_contributions, "group_insurance_contributions"))
  gi <- add("group_insurance_reduction_applied", min(gi, rem), "nr. 44 / SF nr. 17 (30 pct.)")
  rem <- round_half_up(rem - gi)
  wb <- v$work_bonus_reduction
  wbr <- round_half_up(round_half_up(wb$luik_a * bv_amount(input$work_bonus_luik_a, "work_bonus_luik_a")) +
                       round_half_up(wb$luik_b * bv_amount(input$work_bonus_luik_b, "work_bonus_luik_b")))
  add("work_bonus_reduction", wbr, "nr. 46.2 / SF nr. 20")
  wba <- add("work_bonus_reduction_applied", min(wbr, rem), "SF nr. 21: not below zero")
  rem <- round_half_up(rem - wba)
  add("withholding", rem, "SF nr. 21")
  list(withholding = rem, steps = steps)
}

# Public entry point. status: "confirmed" (withholding only), "blocked" (a parameter in
# the chain is not confirmed) or "not_modelled" (input outside the 2026 scope).
calculate_professional_withholding <- function(input, payroll_parameters) {
  w <- payroll_parameters$professional_withholding
  nm <- bv_not_modelled_hooks(input)
  if (length(nm)) return(list(status = "not_modelled", withholding = NULL, steps = list(), missing = nm))
  if (is.null(input$pay_date)) stop("pay_date is required to select the period", call.=FALSE)
  missing <- character()
  if (is.null(w) || !identical(w$method$status, "confirmed")) missing <- c(missing, "withholding method")
  p <- tryCatch(bv_period(w, input$pay_date), error = function(e) NULL)
  if (is.null(p)) missing <- c(missing, paste("withholding period for", input$pay_date))
  else if (!identical(p$status, "confirmed") || is.null(p$value)) missing <- c(missing, paste("withholding period", p$key))
  if (length(missing)) return(list(status = "blocked", withholding = NULL, steps = list(), missing = missing))
  r <- bv_compute(input, p$value)
  list(status = "confirmed", period = p$key, withholding = r$withholding, steps = r$steps, missing = character())
}

# Bijzondere bijdrage voor de sociale zekerheid: usable only when the method and every
# period of the income year are confirmed. No calculation yet: the rate base
# (monthly vs quarterly excess) and rounding are still open (see params notes).
special_contribution_is_confirmed <- function(x) {
  if (is.null(x) || !identical(x$method$status, "confirmed")) return(FALSE)
  length(x$periods) > 0 && all(vapply(x$periods, function(p) identical(p$status, "confirmed"), TRUE))
}
