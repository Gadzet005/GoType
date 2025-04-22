package Repositories

import (
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"time"
)

type Authorization interface {
	CreateUser(user user.User) (int, int, string, error)
	GetUser(username, password string) (user.User, error)
	SetUserRefreshToken(id int, refreshToken string, expiresAt time.Time) (int, int, string, error)
	GetUserById(id int) (user.User, error)
	CreateSeniorAdmin(name string, password string) error
}
