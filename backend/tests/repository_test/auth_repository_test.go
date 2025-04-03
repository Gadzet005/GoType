package repository_test

import (
	"context"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/stretchr/testify/assert"
	"log"
	"testing"
	"time"
)

func TestCreateUserRepository(t *testing.T) {
	repo := repository.NewAuthPostgres(db)

	user := user.User{0, "Alice", "1234", "a", time.Date(1, 1, 1, 1, 1, 1, 1, &time.Location{}), user.AccessLevel(1)}
	id, access, rTok, err := repo.CreateUser(user)
	if err != nil {
		logs, _ := container.Logs(context.Background())
		log.Println("Container logs:", logs)
		t.Fatalf("failed to create user: %v", err)
	}

	assert.Equal(t, rTok, user.RefreshToken, "refresh tokens should be equal")
	assert.Equal(t, access, int(user.Access), "access should be equal")
	assert.NotEqual(t, 0, id, "user id should be greater than zero")
}
