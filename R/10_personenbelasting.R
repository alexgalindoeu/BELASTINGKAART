# Annual personal income tax (personenbelasting / impôt des personnes physiques) of ONE
# resident employee, individual assessment, income year 2026 / assessment year 2027.
# Every step follows the codified WIB 92 text ("inkomsten 2026") read on Fisconet on
# 2026-11-25; verbatim quotes in docs/sources/wib92_personenbelasting_methode.md.
# No rounding is applied: arts. 6, 23, 51, 130, 134 and 466 state none.
# The public result stays blocked (see pb_calculate): the regional step ("totale belasting",
# BFW Titel III/1), tax reductions/credits and the municipal rate are not available.
# JS port: web/js/tax-engine.js (BKTaxEngine.personenbelasting). Joint assessment
# (art. 126 § 1, 86-88, 134 § 4) is not modelled; the per-taxpayer functions below take
# one taxpayer so that a joint layer can call them per spouse later.

pb_amount <- function(x, label) {
  x <- x %||% 0
  if (length(x) != 1L || !is.numeric(x) || !is.finite(x) || x < 0)
    stop(label, " must be a non-negative amount", call. = FALSE)
  x
}
pb_count <- function(x, label) {
  x <- x %||% 0
  if (length(x) != 1L || !is.numeric(x) || !is.finite(x) || x < 0 || x != round(x))
    stop(label, " must be a non-negative integer", call. = FALSE)
  as.integer(x)
}
pb_value <- function(p, label) {
  if (is.null(p) || !identical(p$status, "confirmed") || is.null(p$value))
    stop(label, " is not officially confirmed", call. = FALSE)
  p$value
}

# Art. 23 § 2, 1°, art. 49, art. 51 (first and second paragraph, 1°, and cap), art. 52, 7°
# WIB 92: net professional income from wages = gross taxable wages - personal social
# contributions (beroepskosten, art. 52, 7°) - flat-rate professional expenses. The forfait
# is 'rate' of the gross amount 'vooraf verminderd met de voormelde bijdragen', capped at
# 'maximum' for all wages of the taxpayer. `social_contributions` are those actually due,
# i.e. after the sociale werkbonus. Actual expenses (art. 49) instead of the forfait are not
# modelled. `professional_expenses` is params payroll.yaml -> professional_expenses.
pb_net_professional_income <- function(taxable_wages, social_contributions, professional_expenses) {
  w <- pb_amount(taxable_wages, "taxable_wages")
  c <- pb_amount(social_contributions, "social_contributions")
  if (c > w) stop("social_contributions exceed taxable_wages", call. = FALSE)
  v <- pb_value(professional_expenses, "Flat-rate professional expenses (art. 51)")
  base <- w - c
  forfait <- min(v$employees_rate * base, v$employees_maximum)
  list(wages_less_contributions = base, professional_expenses = forfait,
       net_professional_income = base - forfait)
}

# Art. 130 WIB 92: basic tax = progressive scale on the taxable income of each taxpayer.
pb_basic_tax <- function(taxable_income, brackets) {
  apply_progressive_scale(pb_amount(taxable_income, "taxable_income"),
                          pb_value(brackets, "Tax scale (art. 130)"))
}

# Arts. 131, 132 and 134 § 1 WIB 92: tax-free sum = basic amount (+ increase if the taxpayer
# is disabled) + increases for dependants. Disabled children and other dependants count
# double for art. 132, 1° to 6° and 8° (art. 132, second paragraph), not for 7°. Whether a
# person is 'ten laste' (arts. 136-145) is an input assumption. Art. 133 increases and the
# co-parenting split (art. 132bis) are hooks (pb_not_modelled_inputs).
pb_tax_free_sum <- function(person, federal) {
  pit <- federal$personal_income_tax
  basic <- pb_value(pit$basic_personal_tax_allowance, "Basic tax-free amount (art. 131)")
  disabled <- isTRUE(person$taxpayer_disabled)
  dis_inc <- if (disabled) pb_value(pit$disabled_taxpayer_increase, "Disabled-taxpayer increase (art. 131)") else 0
  d <- pb_value(pit$dependant_increases, "Dependant increases (art. 132)")
  ch <- pb_count(person$children, "children")
  chd <- pb_count(person$children_disabled, "children_disabled")
  u3 <- pb_count(person$children_under_3, "children_under_3")
  u3d <- pb_count(person$children_under_3_disabled, "children_under_3_disabled")
  dep66 <- pb_count(person$dependants_66_care, "dependants_66_care")
  oth <- pb_count(person$other_dependants, "other_dependants")
  othd <- pb_count(person$other_dependants_disabled, "other_dependants_disabled")
  if (chd > ch) stop("children_disabled cannot exceed children", call. = FALSE)
  if (u3 > ch) stop("children_under_3 cannot exceed children", call. = FALSE)
  if (u3d > u3 || u3d > chd) stop("children_under_3_disabled cannot exceed children_under_3 or children_disabled", call. = FALSE)
  if (othd > oth) stop("other_dependants_disabled cannot exceed other_dependants", call. = FALSE)
  double <- isTRUE(d$disabled_counts_double)
  n <- ch + if (double) chd else 0L
  by <- unlist(d$children_total_by_count)
  top <- max(as.integer(names(by)))
  children_inc <- if (n == 0L) 0 else if (n <= top) as.numeric(by[[as.character(n)]]) else
    as.numeric(by[[as.character(top)]]) + d$per_child_above_four * (n - top)
  under3_inc <- d$child_under_three_supplement * (u3 + if (double) u3d else 0L)
  care66_inc <- d$dependant_66_plus_in_care_per_person * dep66
  other_inc <- d$other_dependant_per_person * (oth + if (double) othd else 0L)
  list(basic_amount = basic + dis_inc,
       children_increases = children_inc + under3_inc,        # art. 132, 1° to 6°
       other_dependant_increases = care66_inc + other_inc,    # art. 132, 7° and 8°
       tax_free_sum = basic + dis_inc + children_inc + under3_inc + care66_inc + other_inc)
}

# Art. 134 § 2 WIB 92: the basic tax (art. 130) is reduced by the tax on the tax-free sum,
# computed with the art. 134 § 2 scale (NOT the art. 130 scale). The reduction cannot exceed
# the basic tax. The non-deductible part is lost, except the part relating to art. 132,
# 1° to 6°, which § 3 turns into a refundable credit (not modelled: reported as a hook).
pb_tax_free_sum_reduction <- function(basic_tax, tax_free_sum, tfs_scale) {
  b <- pb_amount(basic_tax, "basic_tax")
  t <- apply_progressive_scale(pb_amount(tax_free_sum, "tax_free_sum"),
                               pb_value(tfs_scale, "Scale for the tax on the tax-free sum (art. 134 § 2)"))
  applied <- min(t, b)
  list(tax_on_tax_free_sum = t, reduction_applied = applied,
       not_deductible = t - applied, tax_after_reduction = b - applied)
}

# Employee tax reductions and credits that are not modelled. Each one reports
# 'not modelled'; any of them can change the final tax of an employee.
PB_NOT_MODELLED_REDUCTIONS <- list(
  list(id = "child_tax_credit_134_3", source = "art. 134, § 3, WIB 92",
       label_nl = "Terugbetaalbaar belastingkrediet voor kinderen ten laste",
       label_fr = "Crédit d'impôt remboursable pour enfants à charge"),
  list(id = "minimum_child_tax_credit_2026", source = "W 15.07.2026, hoofdstuk 2 (art. 41-42)",
       label_nl = "Minimaal belastingkrediet voor kinderen ten laste",
       label_fr = "Crédit d'impôt minimal pour enfants à charge"),
  list(id = "long_term_savings_145_1", source = "art. 145/1 tot 145/16, WIB 92",
       label_nl = "Vermindering voor lange termijnsparen en pensioensparen",
       label_fr = "Réduction pour épargne à long terme et épargne-pension"),
  list(id = "service_vouchers_145_21", source = "art. 145/21, WIB 92",
       label_nl = "Vermindering voor PWA en dienstencheques",
       label_fr = "Réduction pour ALE et titres-services"),
  list(id = "gifts_145_33", source = "art. 145/33, WIB 92",
       label_nl = "Vermindering voor giften", label_fr = "Réduction pour libéralités"),
  list(id = "childcare_145_35", source = "art. 145/35, WIB 92",
       label_nl = "Vermindering voor kinderoppas", label_fr = "Réduction pour garde d'enfants"),
  list(id = "overtime_154bis", source = "art. 154bis, WIB 92",
       label_nl = "Vermindering voor overwerk", label_fr = "Réduction pour heures supplémentaires"),
  list(id = "fiscal_work_bonus_289ter", source = "art. 289ter, WIB 92",
       label_nl = "Belastingkrediet voor lage activiteitsinkomsten (fiscale werkbonus)",
       label_fr = "Crédit d'impôt pour bas revenus d'activité (bonus à l'emploi fiscal)"),
  list(id = "allocation_order_178_1", source = "art. 178/1, WIB 92",
       label_nl = "Aanrekening van de belastingverminderingen op de gereduceerde belasting Staat",
       label_fr = "Imputation des réductions d'impôt sur l'impôt Etat réduit"))

pb_not_modelled_reductions <- function() {
  lapply(PB_NOT_MODELLED_REDUCTIONS, function(h) c(h, list(amount = NULL, status = "not_modelled")))
}

# Arts. 466 and 468 WIB 92: aanvullende gemeentebelasting = a uniform percentage of the
# 'totale belasting' (art. 466; the term has the meaning given in BFW 16.01.1989, Titel
# III/1, per art. 2, § 3). The percentage may have at most one decimal (art. 468, second
# paragraph); no reduction, exemption or exception applies (third paragraph). `entry` is
# one municipality's parameter: value = percentage (e.g. 7.3). Pending or absent -> stop.
# The part of art. 466, second paragraph (certain movable and miscellaneous income) does
# not arise for wage income only and is not modelled.
pb_municipal_surcharge <- function(total_tax, entry) {
  base <- pb_amount(total_tax, "total_tax")
  pct <- pb_value(entry, "Municipal surcharge rate (art. 466-468)")
  if (length(pct) != 1L || !is.numeric(pct) || !is.finite(pct) || pct < 0)
    stop("Municipal surcharge rate must be a non-negative percentage", call. = FALSE)
  if (abs(pct * 10 - round(pct * 10)) > 1e-9)
    stop("Municipal surcharge rate may have at most one decimal (art. 468)", call. = FALSE)
  base * pct / 100
}

# Inputs outside the modelled scope.
pb_not_modelled_inputs <- function(input) {
  out <- character()
  if (!identical(input$assessment %||% "individual", "individual"))
    out <- c(out, "joint assessment (art. 126 § 1, 86-88, 134 § 4) is not modelled")
  if (!isTRUE(input$resident %||% TRUE)) out <- c(out, "non-residents are not modelled")
  if (!is.null(input$actual_professional_expenses))
    out <- c(out, "actual professional expenses (art. 49) instead of the forfait are not modelled")
  if (isTRUE((input$other_income %||% 0) > 0))
    out <- c(out, "income other than wages (art. 6, 1°, 2° and 4°; art. 23, 1°-3° and 5°) is not modelled")
  if (isTRUE(input$single_parent)) out <- c(out, "art. 133 increases (single parent) are not modelled")
  if (isTRUE(input$co_parenting)) out <- c(out, "co-parenting split (art. 132bis) is not modelled")
  out
}

PB_SRC <- function(guid) paste0("https://www.minfin.fgov.be/myminfin-web/pages/public/fisconet/document/", guid)

# Top-level annual calculation. Returns list(status, steps, missing, not_modelled).
# status: "blocked" if ANY parameter used is not confirmed (steps carry no amounts);
#         "not_modelled" otherwise, because the regional step, the tax reductions and
#         credits are not modelled. It never returns a final public amount yet.
# `parameters` = list(federal, payroll, social_security, municipal) as in params/<year>.
pb_calculate <- function(input, parameters) {
  nm <- pb_not_modelled_inputs(input)
  fed <- parameters$federal$personal_income_tax
  muni_entry <- parameters$municipal$aanvullende_gemeentebelasting[[input$municipality %||% ""]]
  ec <- parameters$social_security$employee_contribution
  needed <- list(
    "flat-rate professional expenses (payroll.professional_expenses)" = parameters$payroll$professional_expenses,
    "tax scale art. 130 (federal.personal_income_tax.brackets)" = fed$brackets,
    "basic tax-free amount art. 131 (federal.personal_income_tax.basic_personal_tax_allowance)" = fed$basic_personal_tax_allowance,
    "dependant increases art. 132 (federal.personal_income_tax.dependant_increases)" = fed$dependant_increases,
    "scale art. 134 § 2 (federal.personal_income_tax.tax_on_tax_free_sum)" = fed$tax_on_tax_free_sum,
    "employee social-security rate (social_security.employee_contribution.rate)" = ec$rate,
    "municipal surcharge rate (municipal.aanvullende_gemeentebelasting.<municipality>)" = muni_entry)
  if (isTRUE(input$taxpayer_disabled))
    needed[["disabled-taxpayer increase art. 131 (federal.personal_income_tax.disabled_taxpayer_increase)"]] <- fed$disabled_taxpayer_increase
  missing <- names(needed)[!vapply(needed, function(p) identical(p$status, "confirmed") && !is.null(p$value), TRUE)]
  if (!work_bonus_is_confirmed(ec$work_bonus))
    missing <- c(missing, "sociale werkbonus (social_security.employee_contribution.work_bonus)")
  nm <- c(nm, "regional step: gereduceerde belasting Staat, gewestelijke opcentiemen and 'totale belasting' (art. 2, § 3, WIB 92; BFW 16.01.1989, Titel III/1)",
          vapply(PB_NOT_MODELLED_REDUCTIONS, function(h) paste(h$source, "is not modelled"), ""))

  step <- function(id, nl, fr, amount, source) list(id = id, label_nl = nl, label_fr = fr, amount = amount, source = source)
  blocked <- length(missing) > 0L
  a <- function(x) if (blocked) NULL else x

  if (!blocked) {
    npi <- pb_net_professional_income(input$taxable_wages, input$social_contributions, parameters$payroll$professional_expenses)
    taxable <- npi$net_professional_income  # art. 6: no deductible spending modelled
    basic <- pb_basic_tax(taxable, fed$brackets)
    tfs <- pb_tax_free_sum(input, parameters$federal)
    red <- pb_tax_free_sum_reduction(basic, tfs$tax_free_sum, fed$tax_on_tax_free_sum)
  }
  steps <- list(
    step("wages_less_contributions", "Belastbare bezoldigingen min persoonlijke sociale bijdragen",
         "Rémunérations imposables moins cotisations sociales personnelles",
         a(npi$wages_less_contributions), "art. 52, 7°, WIB 92"),
    step("professional_expenses", "Forfaitaire beroepskosten", "Frais professionnels forfaitaires",
         a(npi$professional_expenses), paste("art. 51 WIB 92 —", PB_SRC("e2fb1778-ac33-4e91-8e57-e53c0cac384c"))),
    step("net_professional_income", "Netto beroepsinkomen", "Revenu professionnel net",
         a(npi$net_professional_income), paste("art. 23, § 2, WIB 92 —", PB_SRC("faca8178-20de-45b6-acb6-00769cba1c00"))),
    step("taxable_income", "Belastbaar inkomen", "Revenu imposable",
         a(taxable), paste("art. 6 WIB 92 —", PB_SRC("2f73b26b-e8f3-4f07-a1df-3f626caa2978"))),
    step("basic_tax", "Basisbelasting", "Impôt de base",
         a(basic), paste("art. 130 WIB 92 —", PB_SRC("796a4fc5-340e-4c89-a72a-88caa804ca96"))),
    step("tax_free_sum", "Belastingvrije som", "Quotité du revenu exemptée d'impôt",
         a(tfs$tax_free_sum), paste("art. 131, 132 en 134, § 1, WIB 92 —", PB_SRC("20a503a9-4213-4e60-a91c-0ebb907e176a"))),
    step("tax_on_tax_free_sum", "Belasting op de belastingvrije som", "Impôt afférent à la quotité exemptée",
         a(red$tax_on_tax_free_sum), paste("art. 134, § 2, WIB 92 —", PB_SRC("20a503a9-4213-4e60-a91c-0ebb907e176a"))),
    step("tax_free_sum_reduction_applied", "Aangerekende vermindering voor de belastingvrije som",
         "Réduction imputée pour la quotité exemptée", a(red$reduction_applied), "art. 134, § 2, WIB 92"),
    step("tax_after_tax_free_sum", "Belasting na vermindering voor de belastingvrije som",
         "Impôt après réduction pour la quotité exemptée", a(red$tax_after_reduction), "art. 134, § 2, WIB 92"),
    step("tax_free_sum_not_deductible", "Niet aanrekenbaar deel van de belasting op de belastingvrije som",
         "Partie non imputable de l'impôt afférent à la quotité exemptée", a(red$not_deductible),
         "art. 134, § 3, WIB 92 (conversion into a credit not modelled)"))
  steps <- c(steps, lapply(pb_not_modelled_reductions(), function(h)
    step(h$id, h$label_nl, h$label_fr, NULL, paste(h$source, "— not modelled"))))
  steps <- c(steps, list(
    step("total_tax", "Totale belasting", "Impôt total", NULL,
         "art. 2, § 3, WIB 92; BFW 16.01.1989, Titel III/1 — not modelled"),
    step("municipal_surcharge", "Aanvullende gemeentebelasting", "Taxe communale additionnelle", NULL,
         paste("art. 466 en 468 WIB 92 —", PB_SRC("81bf3101-a837-4d89-8b97-713e080f00ac"), "— needs total_tax and a confirmed rate"))))
  list(status = if (blocked) "blocked" else "not_modelled", steps = steps,
       missing = unique(missing), not_modelled = nm)
}
