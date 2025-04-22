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

func NewService(repos *repository.Repository) *Service {
	return &Service{
		Authorization:    NewAuthService(repos.Authorization),
		UserActions:      NewUserActionsService(repos.UserActions),
		Admin:            NewAdminService(repos.AdminActions),
		Level:            NewLevelService(repos.Level),
		Stats:            NewStatsService(repos.Stats),
		SinglePlayerGame: NewSinglePlayerGame(repos.SinglePlayerGame),
	}
}
