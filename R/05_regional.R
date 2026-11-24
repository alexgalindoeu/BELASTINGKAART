# Regional tax rules. Keep the three Belgian regions separate.
regional_parameters <- function(region, parameters) {
  if (!region %in% c("flanders","brussels","wallonia"))
    stop("Unknown Belgian region", call.=FALSE)
  block <- parameters$regions[[region]]
  if (is.null(block)) stop("No official regional parameter set for ", region, call.=FALSE)
  block
}
