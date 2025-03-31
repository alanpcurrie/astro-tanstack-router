# PartyKit commands
partykit-dev:
	npx partykit dev

partykit-deploy:
	npx partykit deploy

partykit-login:
	npx partykit login

partykit-logout:
	npx partykit logout

# Run both Astro and PartyKit dev servers
dev-all:
	npx concurrently "pnpm dev" "npx partykit dev"

# Kill all PartyKit and Astro processes
kill-all:
	@echo "Killing all PartyKit and Astro processes..."
	@pkill -f "partykit|workerd|astro" || echo "No processes found to kill"
	@echo "All processes terminated"
