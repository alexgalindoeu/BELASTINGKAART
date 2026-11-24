# Load Belastingkaart reference calculation modules from the repository root.
files <- c("00_utils.R","01_parameters.R","02_federal_tax.R","02_household.R",
           "03_social_security.R","04_payroll_tax.R","05_regional.R",
           "06_municipal.R","07_dispatch.R","08_metrics.R","09_scenarios.R")
for (file in files) source(file.path("R",file), local=globalenv())
