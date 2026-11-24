# Employee social-security components. Never use provisional parameters in a result.
parameter_value <- function(x, label="parameter") {
  if (is.null(x) || !identical(x$status, "confirmed") || is.null(x$value))
    stop(label, " is not officially confirmed for this calculation year", call.=FALSE)
  as.numeric(x$value)
}

# --- Sociale werkbonus (RSZ DmfA instructions) -------------------------------

# Period in force on `date` (YYYY-MM-DD): the one with the latest effective_from
# not after `date`, provided `date` is not after its effective_to.
work_bonus_period <- function(work_bonus, date) {
  periods <- work_bonus$periods
  if (is.null(periods) || !length(periods)) stop("No work-bonus periods available", call.=FALSE)
  date <- as.Date(date)
  from <- as.Date(vapply(periods, function(p) as.character(p$effective_from), ""))
  ok <- from <= date
  if (!any(ok)) stop("No work-bonus period covers ", date, call.=FALSE)
  key <- names(periods)[ok][which.max(from[ok])]
  p <- periods[[key]]
  if (!is.null(p$effective_to) && date > as.Date(as.character(p$effective_to)))
    stop("No work-bonus period covers ", date, call.=FALSE)
  p$key <- key
  p
}

# Step 1: reference monthly wage S. `regime` is "full_time" (days J of D) or
# "part_time" (hours H of U). Fractions W/J and W/H are rounded half-up to the cent.
work_bonus_reference_wage <- function(W, regime = c("full_time","part_time"),
                                      J = NULL, D = NULL, H = NULL, U = NULL) {
  regime <- match.arg(regime)
  if (!is.finite(W) || W < 0) stop("W must be a non-negative finite wage", call.=FALSE)
  if (regime == "full_time") {
    if (is.null(J) || is.null(D) || J <= 0 || D <= 0 || J > D)
      stop("Full-time regime needs 0 < J <= D", call.=FALSE)
    if (J == D) return(list(S = W, fraction = 1))
    return(list(S = round_half_up(W / J) * D, fraction = min(1, round_half_up(J / D))))
  }
  if (is.null(H) || is.null(U) || H <= 0 || U <= 0)
    stop("Part-time regime needs H > 0 and U > 0", call.=FALSE)
  list(S = round_half_up(W / H) * U, fraction = min(1, round_half_up(H / U)))
}

# Step 2: basic amount R of one luik for one category, rounded to the cent.
work_bonus_basic_amount <- function(S, luik, category) {
  cat_par <- luik[[category]]
  if (is.null(cat_par)) stop("Unknown work-bonus category: ", category, call.=FALSE)
  R <- if (S <= luik$threshold) cat_par$max
       else if (S <= luik$upper) cat_par$max - cat_par$slope * (S - luik$threshold)
       else 0
  # The tables set R to 0 above `upper`; at the very top of the sloped band the
  # formula can dip a few cents below zero, so a negative R is floored at 0.
  round_half_up(max(0, R))
}

# Steps 2-3 for one month. `category` is "bedienden" (declared at 100%) or
# "arbeiders" (declared at 108%). `contribution_due` is the personal contribution
# for the month; the reduction may not exceed it (cut from luik B first, then A).
# The annual cap is NOT applied: its application within the year is pending.
work_bonus_month <- function(period, S, fraction, category, contribution_due) {
  v <- period$value
  if (is.null(v)) stop("Work-bonus period ", period$key %||% "", " is not available", call.=FALSE)
  RA <- work_bonus_basic_amount(S, v$luik_a, category)
  RB <- work_bonus_basic_amount(S, v$luik_b, category)
  PA <- round_half_up(fraction * RA)
  PB <- round_half_up(fraction * RB)
  shortfall <- max(0, PA + PB - contribution_due)
  cutB <- min(PB, shortfall); PB <- PB - cutB
  cutA <- min(PA, shortfall - cutB); PA <- PA - cutA
  list(period = period$key, S = S, fraction = fraction, RA = RA, RB = RB,
       PA = round_half_up(PA), PB = round_half_up(PB), P = round_half_up(PA + PB),
       status = period$status)
}

# The work bonus is usable in a public result only when the method and every
# period of the income year are confirmed.
work_bonus_is_confirmed <- function(work_bonus) {
  if (is.null(work_bonus) || !identical(work_bonus$method$status, "confirmed")) return(FALSE)
  periods <- work_bonus$periods
  length(periods) > 0 && all(vapply(periods, function(p) identical(p$status, "confirmed"), TRUE))
}

employee_social_security <- function(gross_monthly, social_parameters) {
  if (length(gross_monthly)!=1L || !is.finite(gross_monthly) || gross_monthly<0)
    stop("gross_monthly must be a non-negative finite number", call.=FALSE)
  rate <- parameter_value(social_parameters$employee_contribution$rate,
                          "Employee social-security rate")
  if (!work_bonus_is_confirmed(social_parameters$employee_contribution$work_bonus))
    stop("The work bonus is not confirmed; employee contributions cannot yet be calculated safely", call.=FALSE)
  stop("Employee contributions with work bonus are not yet wired into the payroll pipeline", call.=FALSE)
}
