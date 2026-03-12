dev:
	docker compose \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	-f docker-compose.dev.yml \
	up --build

prod:
	docker compose \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	up --build

build:
	docker compose \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	build

down:
	docker compose \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	down

logs:
	docker compose logs -f api

ps:
	docker compose ps
