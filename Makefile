.PHONY: help install test pack-check clean-all

.DEFAULT_GOAL := help

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-14s %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

test: ## Run tests
	npm test

pack-check: ## Fail if the packed tarball would ship unexpected files
	node scripts/check-pack.js

clean-all: ## Remove build output and node_modules/
	rm -rf node_modules coverage
