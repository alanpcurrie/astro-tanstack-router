.PHONY: default dev start build preview sync test install clean format lint check check-all upgrade unit-test test-coverage test-watch test-report

# List all available targets
help:
	@echo "Available targets:"
	@echo "  dev           - Start development server"
	@echo "  start         - Alias for dev command"
	@echo "  build         - Build the project"
	@echo "  preview       - Preview the built project"
	@echo "  sync          - Sync Astro types and generated files"
	@echo "  test          - Run Playwright tests"
	@echo "  unit-test     - Run Vitest unit tests"
	@echo "  test-coverage - Run Vitest tests with coverage"
	@echo "  test-watch    - Run Vitest tests in watch mode"
	@echo "  test-report   - Show Playwright test report"
	@echo "  install       - Install dependencies"
	@echo "  clean         - Clean build artifacts"
	@echo "  format        - Format code using Biome"
	@echo "  lint          - Lint code using Biome"
	@echo "  check         - Check types"
	@echo "  check-all     - Run all checks (types, lint, format)"
	@echo "  upgrade       - Upgrade Astro to latest version"

default: help

# Development commands
dev:
	pnpm astro dev

start: dev

# Build and preview
build:
	pnpm astro check && pnpm astro build

preview:
	pnpm astro preview

# Astro commands
sync:
	pnpm astro sync

upgrade:
	pnpm dlx @astrojs/upgrade

# Testing
test:
	pnpm playwright test

test-report:
	pnpm exec playwright show-report

unit-test:
	pnpm vitest run

test-coverage:
	pnpm vitest run --coverage

test-watch:
	pnpm vitest

# Dependencies
install:
	pnpm install

# Cleanup
clean:
	rm -rf dist/
	rm -rf .astro/

# Code quality
format:
	pnpm biome format .

lint:
	pnpm biome lint .

check:
	pnpm astro check

check-all: check lint
	pnpm biome format . --write
