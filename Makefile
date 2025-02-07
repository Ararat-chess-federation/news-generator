build:
	docker compose build --no-cache news-generator

start:
	docker compose up -d

stop:
	docker compose down