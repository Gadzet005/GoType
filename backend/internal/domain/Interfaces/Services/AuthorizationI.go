package Services

import (
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"time"
)

type Authorization interface {
	CreateUser(user user.User) (string, string, error)
	GenerateToken(username, password string) (string, string, error)
	GenerateTokenByToken(accessToken, refreshToken string) (string, string, error)
	Parse(accessToken string) (time.Time, int, int, error)
	CreateSeniorAdmin(username string, password string) error
}
