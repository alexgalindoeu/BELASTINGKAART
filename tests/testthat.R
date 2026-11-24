if (!requireNamespace("testthat", quietly = TRUE)) stop("Install testthat to run R tests.")
testthat::test_dir("tests/testthat")
