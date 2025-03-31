# Build commands
dev:
	pnpm dev

start: dev

build:
	pnpm build

preview:
	pnpm preview

sync:
	pnpm astro sync

# Clean up
clean:
	rm -rf dist/
	rm -rf .astro/
