package repository

import (
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"time"
)

type Authorization interface {
	CreateUser(user user.User) (int, int, string, error)
	GetUser(username, password string) (user.User, error)
	SetUserRefreshToken(id int, refreshToken string, expiresAt time.Time) (int, int, string, error)
	GetUserById(id int) (user.User, error)
	CreateSeniorAdmin(name string, password string) error
}

type UserActions interface {
	DropRefreshToken(id int, newTime time.Time) (int, error)
	GetUserById(id int) (string, int, time.Time, string, string, error)
	CreateUserComplaint(complaint complaints.UserComplaint) error
	CreateLevelComplaint(complaint complaints.LevelComplaint) error
	UpdateAvatarPath(id int, newPath string) (string, error)
}

type Stats interface {
	GetUserStats(id int) (statistics.PlayerStats, error)
	GetUsersTop(params map[string]interface{}) ([]statistics.PlayerStats, error)
}

type Admin interface {
	GetUserAccess(id int) (int, error)
	BanUser(userId int, expirationTime time.Time, reason string) error
	UnbanUser(userId int) error
	BanLevel(levelId int) error
	UnbanLevel(levelId int) error
	ChangeUserAccess(userId int, newAccess int) error
	GetUserComplaints(moderatorId int) ([]complaints.UserComplaint, error)
	GetLevelComplaints(moderatorId int) ([]complaints.LevelComplaint, error)
	DeleteUserComplaint(moderatorId int, complaintId int) error
	DeleteLevelComplaint(moderatorId int, complaintId int) error
	GetUsers(params user.UserSearchParams) ([]user.UserInfo, error)
}

type MultiplayerGame interface {
}

type SinglePlayerGame interface {
	SendResults(lc statistics.LevelComplete, totalPush int, totalErr int) error
}

type Level interface {
	CreateLevel(level level.Level) (string, string, int, error)
	DeleteLevel(levelId int) error
	UpdateLevel(levelInfo level.LevelUpdateStruct) (string, string, int, error)
	GetLevelById(levelId int) (level.Level, error)
	FetchLevels(map[string]interface{}) ([]level.Level, error)
	GetPathsById(levelId int) (int, string, string, error)
	GetLevelStats(levelId int) (statistics.LevelStats, error)
	GetLevelUserTop(levelId int) ([]statistics.UserLevelCompletionInfo, error)
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
		Authorization:    NewAuthPostgres(db),
		UserActions:      NewUserActionsPostgres(db),
		AdminActions:     NewAdminPostgres(db),
		Level:            NewLevelPostgres(db, client),
		Stats:            NewStatsPostgres(db, client),
		SinglePlayerGame: NewSinglePlayerGamePostgres(db),
	}

	return &repo
}
