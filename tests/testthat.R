if (!requireNamespace("testthat", quietly = TRUE)) stop("Install testthat to run R tests.")
source(file.path("R", "load.R"))
testthat::test_dir("tests/testthat", env = globalenv())
