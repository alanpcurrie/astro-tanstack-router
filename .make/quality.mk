# Code quality
format:
	pnpm biome format .

lint:
	pnpm biome lint .

check:
	pnpm astro check

check-all: check lint
	pnpm biome format . --write
