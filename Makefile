dev:
	docker compose -p file-cloud-lab \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	-f docker-compose.dev.yml \
	up -d

prod:
	docker compose -p file-cloud-lab \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	up --build

build:
	docker compose -p file-cloud-lab \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	build

down:
	docker compose -p file-cloud-lab \
	-f docker-compose.yml \
	-f docker-compose.infra.yml \
	-f docker-compose.dev.yml \
	down

logs:
	docker compose -p file-cloud-lab logs -f api

ps:
	docker compose -p file-cloud-lab ps