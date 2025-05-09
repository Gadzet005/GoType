package repository

import (
	repository "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Repositories"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

type Repository struct {
	Authorization    repository.Authorization
	UserActions      repository.UserActions
	AdminActions     repository.Admin
	Level            repository.Level
	Stats            repository.Stats
	SinglePlayerGame repository.SinglePlayerGame
	Files            repository.Files
}

func NewRepository(db *sqlx.DB, client *redis.Client, levelUserTopTTL, levelStatsTTL, ratingTTL int) *Repository {
	repo := Repository{
		Authorization:    NewAuthPostgres(db),
		UserActions:      NewUserActionsPostgres(db),
		AdminActions:     NewAdminPostgres(db),
		Level:            NewLevelPostgres(db, client, levelUserTopTTL, levelStatsTTL),
		Stats:            NewStatsPostgres(db, client, ratingTTL),
		SinglePlayerGame: NewSinglePlayerGamePostgres(db),
		Files:            NewLocalFileRepository(),
	}

	return &repo
}
