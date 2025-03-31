# Dependencies
install:
	pnpm install

# Dependency upgrades
upgrade:
	pnpm dlx @astrojs/upgrade

upgrade-patch:
	pnpm up --interactive

upgrade-minor:
	pnpm up -i

upgrade-major:
	pnpm up -i --latest

upgrade-latest:
	pnpm up --latest

# Dependency management
outdated:
	pnpm outdated

dedupe:
	pnpm dedupe

prune:
	pnpm prune

audit:
	pnpm audit
