.PHONY: dev prod down reset logs restart build install lint format test test-cov test-e2e

# ── Dev (local DB only, app runs via pnpm) ────────────────────────────────────
dev:
	docker compose -f docker-compose-dev.yml down
	docker compose -f docker-compose-dev.yml up -d --remove-orphans --force-recreate
	pnpm start:dev

db:
	docker compose -f docker-compose-dev.yml down
	docker compose -f docker-compose-dev.yml up -d --remove-orphans --force-recreate

db-down:
	docker compose -f docker-compose-dev.yml down

# ── Production (full stack in Docker) ─────────────────────────────────────────
prod:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml up -d --remove-orphans --force-recreate

prod-build:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.yml up -d --build --remove-orphans --force-recreate

# ── Teardown ──────────────────────────────────────────────────────────────────
down:
	docker compose -f docker-compose-dev.yml down

reset:
	docker compose -f docker-compose-dev.yml down -v --remove-orphans
	docker compose -f docker-compose-dev.yml up -d --remove-orphans --force-recreate

reset-prod:
	docker compose -f docker-compose.yml down -v --remove-orphans

# ── Logs & status ─────────────────────────────────────────────────────────────
logs:
	docker compose -f docker-compose-dev.yml logs -f

logs-prod:
	docker compose -f docker-compose.yml logs -f api

restart:
	docker compose -f docker-compose-dev.yml restart

# ── App ───────────────────────────────────────────────────────────────────────
install:
	pnpm install

build:
	pnpm build

start:
	pnpm start:prod

debug:
	pnpm start:debug

# ── Code quality ──────────────────────────────────────────────────────────────
lint:
	pnpm lint

format:
	pnpm format

# ── Tests ─────────────────────────────────────────────────────────────────────
test:
	pnpm test

test-watch:
	pnpm test:watch

test-cov:
	pnpm test:cov

test-e2e:
	pnpm test:e2e
