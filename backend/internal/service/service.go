package service

import (
	services "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Services"
	"github.com/Gadzet005/GoType/backend/internal/repository"
)

type Service struct {
	Authorization    services.Authorization
	UserActions      services.UserActions
	Admin            services.Admin
	Level            services.Level
	Stats            services.Stats
	SinglePlayerGame services.SinglePlayer
}

func NewService(repos *repository.Repository, refreshTokenTTL, accessTokenTTL int, signingKey, salt string) *Service {
	return &Service{
		Authorization:    NewAuthService(repos.Authorization, refreshTokenTTL, accessTokenTTL, signingKey, salt),
		UserActions:      NewUserActionsService(repos.UserActions, repos.Files),
		Admin:            NewAdminService(repos.AdminActions),
		Level:            NewLevelService(repos.Level, repos.Files, repos.UserActions),
		Stats:            NewStatsService(repos.Stats),
		SinglePlayerGame: NewSinglePlayerGame(repos.SinglePlayerGame, repos.UserActions),
	}
}
