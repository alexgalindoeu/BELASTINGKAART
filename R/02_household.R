# Belgian household input model. This layer contains no tax assumptions.
new_household <- function(region, municipality, income_year, assessment_year,
                          employment = "employee", family_status = "single",
                          children = 0L, resident = TRUE) {
  x <- list(region=region, municipality=municipality,
            income_year=as.integer(income_year),
            assessment_year=as.integer(assessment_year),
            employment=employment, family_status=family_status,
            children=as.integer(children), resident=isTRUE(resident))
  validate_household(x)
  class(x) <- c("belastingkaart_household", "list")
  x
}

validate_household <- function(household) {
  required <- c("region","municipality","income_year","assessment_year",
                "employment","family_status","children","resident")
  missing <- setdiff(required, names(household))
  if (length(missing)) stop("Household is missing: ", paste(missing, collapse=", "), call.=FALSE)
  if (!household$region %in% c("flanders","brussels","wallonia"))
    stop("region must be flanders, brussels or wallonia", call.=FALSE)
  if (!household$employment %in% c("employee","self_employed","pensioner"))
    stop("Unsupported employment category", call.=FALSE)
  if (household$children < 0 || household$children != as.integer(household$children))
    stop("children must be a non-negative integer", call.=FALSE)
  if (household$assessment_year <= household$income_year)
    stop("assessment_year must follow income_year", call.=FALSE)
  invisible(TRUE)
}
