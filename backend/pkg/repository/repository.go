package repository

import (
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"time"
)

type Authorization interface {
	CreateUser(user entities.User) (int, int, string, error)
	GetUser(username, password string) (entities.User, error)
	SetUserRefreshToken(id int, refreshToken string, expiresAt time.Time) (int, int, string, error)
	GetUserById(id int) (entities.User, error)
	CreateSeniorAdmin(name string, password string) error
}

type UserActions interface {
	DropRefreshToken(id int, newTime time.Time) (int, error)
	GetUserById(id int) (string, int, time.Time, string, error)
	CreateUserComplaint(complaint entities.UserComplaint) error
	CreateLevelComplaint(complaint entities.LevelComplaint) error
}

type Stats interface {
	GetUserStats(id int) (entities.PlayerStats, error)
	GetUsersTop(params map[string]interface{}) ([]entities.PlayerStats, error)
}

type Admin interface {
	GetUserAccess(id int) (int, error)
	BanUser(userId int, expirationTime time.Time, reason string) error
	UnbanUser(userId int) error
	BanLevel(levelId int) error
	UnbanLevel(levelId int) error
	ChangeUserAccess(userId int, newAccess int) error
	GetUserComplaints(moderatorId int) ([]entities.UserComplaint, error)
	GetLevelComplaints(moderatorId int) ([]entities.LevelComplaint, error)
	DeleteUserComplaint(moderatorId int, complaintId int) error
	DeleteLevelComplaint(moderatorId int, complaintId int) error
	GetUsers(params entities.UserSearchParams) ([]entities.UserInfo, error)
}

type MultiplayerGame interface {
}

type SinglePlayerGame interface {
	SendResults(lc entities.LevelComplete, totalPush int, totalErr int) error
}

type Level interface {
	CreateLevel(level entities.Level) (string, string, int, error)
	DeleteLevel(levelId int) error
	UpdateLevel(levelInfo entities.LevelUpdateStruct) (string, string, int, error)
	GetLevelById(levelId int) (entities.Level, error)
	FetchLevels(map[string]interface{}) ([]entities.Level, error)
	GetPathsById(levelId int) (int, string, string, error)
	GetLevelStats(levelId int) (entities.LevelStats, error)
	GetLevelUserTop(levelId int) ([]entities.UserLevelCompletionInfo, error)
}

type Repository struct {
	Authorization    Authorization
	UserActions      UserActions
	AdminActions     Admin
	Level            Level
	Stats            Stats
	SinglePlayerGame SinglePlayerGame
}

func NewRepository(db *sqlx.DB, client *redis.Client) *Repository {
	repo := Repository{
		Authorization:    NewAuthPostgres(db, client),
		UserActions:      NewUserActionsPostgres(db, client),
		AdminActions:     NewAdminPostgres(db, client),
		Level:            NewLevelPostgres(db),
		Stats:            NewStatsPostgres(db),
		SinglePlayerGame: NewSinglePlayerGamePostgres(db),
	}

	return &repo
}
