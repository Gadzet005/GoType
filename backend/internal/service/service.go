package service

import (
	"database/sql"
	bans "github.com/Gadzet005/GoType/backend/internal/domain/Bans"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	useraccess "github.com/Gadzet005/GoType/backend/internal/domain/UserAccess"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"mime/multipart"
	"time"
)

type Authorization interface {
	CreateUser(user user.User) (string, string, error)
	GenerateToken(username, password string) (string, string, error)
	GenerateTokenByToken(accessToken, refreshToken string) (string, string, error)
	Parse(accessToken string) (time.Time, int, int, error)
	CreateSeniorAdmin(username string, password string) error
}

type UserActions interface {
	DropRefreshToken(id int) error
	GetUserById(id int) (string, int, time.Time, string, sql.NullString, error)
	CreateUserComplaint(complaint complaints.UserComplaint) error
	CreateLevelComplaint(complaint complaints.LevelComplaint) error
	UpdateAvatar(userId int, avatarFile *multipart.FileHeader) error
}

type Stats interface {
	GetUserStats(id int) (statistics.PlayerStats, error)
	GetUsersTop(params statistics.StatSortFilterParams) ([]statistics.PlayerStats, error)
}

type Admin interface {
	TryBanUser(adminAccess int, ban bans.UserBan) error
	TryUnbanUser(adminAccess int, ban bans.UserUnban) error
	TryBanLevel(adminAccess int, ban bans.LevelBan) error
	TryUnbanLevel(adminAccess int, ban bans.LevelBan) error
	TryChangeAccessLevel(adminAccess int, ban useraccess.ChangeUserAccess) error
	GetUserComplaints(adminId int, adminAccess int) ([]complaints.UserComplaint, error)
	GetLevelComplaints(adminId int, adminAccess int) ([]complaints.LevelComplaint, error)
	ProcessUserComplaint(adminId int, adminAccess int, complaintId int) error
	ProcessLevelComplaint(adminId int, adminAccess int, complaintId int) error
	GetUsers(adminAccess int, searchParams user.UserSearchParams) ([]user.UserInfo, error)
}

type MultiplayerGame interface {
}

type SinglePlayer interface {
	SendResults(senderID int, lc statistics.LevelComplete) error
}

type Level interface {
	CreateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error)
	UpdateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error)
	DeleteLevel(levelId int) error
	GetLevelById(levelId int) (level.Level, error)
	GetLevelList(fetchStruct level.FetchLevelStruct) ([]level.Level, error)
	CheckLevelExists(levInfo level.GetLevelInfoStruct) (string, error)
	GetLevelStats(levelId int) (statistics.LevelStats, error)
	GetLevelUserTop(levelId int) ([]statistics.UserLevelCompletionInfo, error)
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
