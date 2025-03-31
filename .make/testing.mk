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
