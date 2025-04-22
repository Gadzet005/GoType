package Repositories

import (
	"database/sql"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	"time"
)

type UserActions interface {
	DropRefreshToken(id int, newTime time.Time) (int, error)
	GetUserById(id int) (string, int, time.Time, string, sql.NullString, error)
	CreateUserComplaint(complaint complaints.UserComplaint) error
	CreateLevelComplaint(complaint complaints.LevelComplaint) error
	UpdateAvatarPath(id int, newPath string) (string, error)
}
