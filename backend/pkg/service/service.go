package service

import (
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/Gadzet005/GoType/backend/pkg/repository"
	"mime/multipart"
	"time"
)

type Authorization interface {
	CreateUser(user entities.User) (string, string, error)
	GenerateToken(username, password string) (string, string, error)
	GenerateTokenByToken(accessToken, refreshToken string) (string, string, error)
	Parse(accessToken string) (time.Time, int, int, error)
	CreateSeniorAdmin(username string, password string) error
}

type UserActions interface {
	DropRefreshToken(id int) error
	GetUserById(id int) (string, int, time.Time, string, error)
	CreateUserComplaint(complaint entities.UserComplaint) error
	CreateLevelComplaint(complaint entities.LevelComplaint) error
}

type Stats interface {
	GetUserStats(id int) (entities.PlayerStats, error)
	GetUsersTop(params entities.StatSortFilterParams) ([]entities.PlayerStats, error)
}

type Admin interface {
	TryBanUser(adminAccess int, ban entities.UserBan) error
	TryUnbanUser(adminAccess int, ban entities.UserUnban) error
	TryBanLevel(adminAccess int, ban entities.LevelBan) error
	TryUnbanLevel(adminAccess int, ban entities.LevelBan) error
	TryChangeAccessLevel(adminAccess int, ban entities.ChangeUserAccess) error
	GetUserComplaints(adminId int, adminAccess int) ([]entities.UserComplaint, error)
	GetLevelComplaints(adminId int, adminAccess int) ([]entities.LevelComplaint, error)
	ProcessUserComplaint(adminId int, adminAccess int, complaintId int) error
	ProcessLevelComplaint(adminId int, adminAccess int, complaintId int) error
	GetUsers(adminAccess int, searchParams entities.UserSearchParams) ([]entities.UserInfo, error)
}

type MultiplayerGame interface {
}

type SinglePlayer interface {
	SendResults(senderID int, lc entities.LevelComplete) error
}

type Level interface {
	CreateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error)
	UpdateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error)
	DeleteLevel(levelId int) error
	GetLevelById(levelId int) (entities.Level, error)
	GetLevelList(fetchStruct entities.FetchLevelStruct) ([]entities.Level, error)
	CheckLevelExists(levInfo entities.GetLevelInfoStruct) (string, error)
	GetLevelStats(levelId int) (entities.LevelStats, error)
	GetLevelUserTop(levelId int) ([]entities.UserLevelCompletionInfo, error)
}

type Service struct {
	Authorization    Authorization
	UserActions      UserActions
	Admin            Admin
	Level            Level
	Stats            Stats
	SinglePlayerGame SinglePlayer
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
