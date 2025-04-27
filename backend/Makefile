.PHONY: run
run:
	docker compose up --build

.PHONY: run-background
run-background:
	docker compose up --build -d

.PHONY: docs
docs:
	swag init -g cmd/main.go
