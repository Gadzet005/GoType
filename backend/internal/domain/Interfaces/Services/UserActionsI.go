package Services

import (
	"database/sql"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	"mime/multipart"
	"time"
)

type UserActions interface {
	DropRefreshToken(id int) error
	GetUserById(id int) (string, int, time.Time, string, sql.NullString, error)
	CreateUserComplaint(complaint complaints.UserComplaint) error
	CreateLevelComplaint(complaint complaints.LevelComplaint) error
	UpdateAvatar(userId int, avatarFile *multipart.FileHeader) error
}
