package repository_test

import (
	"fmt"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestCreateSeniorAdminRepository(t *testing.T) {
	repo := repository.NewAuthPostgres(db)

	tests := []struct {
		name        string
		adminName   string
		password    string
		expectError bool
	}{
		{
			name:        "Valid senior admin",
			adminName:   "SuperAdmin1",
			password:    "securePass",
			expectError: false,
		},
		{
			name:        "Duplicate senior admin",
			adminName:   "SuperAdmin1", // дублируем имя
			password:    "anotherPass",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := repo.CreateSeniorAdmin(tt.adminName, tt.password)

			if tt.expectError {
				assert.Error(t, err)
				return
			}

			assert.NoError(t, err)
		})
	}
}

func TestCreateUserRepository1(t *testing.T) {
	repo := repository.NewAuthPostgres(db)

	tests := []struct {
		name        string
		inputUser   user.User
		expectError bool
	}{
		{
			name: "Valid user",
			inputUser: user.User{
				Id:           0,
				Name:         "Alice",
				Password:     "1234",
				RefreshToken: "a",
				ExpiresAt:    time.Now().Add(time.Hour * 24),
				Access:       user.AccessLevel(1),
			},
			expectError: false,
		},
		{
			name: "Duplicate user",
			inputUser: user.User{
				Id:           0,
				Name:         "Alice",
				Password:     "1234",
				RefreshToken: "b",
				ExpiresAt:    time.Now().Add(time.Hour * 24),
				Access:       user.AccessLevel(1),
			},
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			id, access, rTok, err := repo.CreateUser(tt.inputUser)

			if tt.expectError {
				assert.Error(t, err)
				assert.Equal(t, -1, id)
				return
			}

			assert.NoError(t, err)
			assert.Equal(t, tt.inputUser.RefreshToken, rTok)
			assert.Equal(t, int(tt.inputUser.Access), access)
			assert.NotEqual(t, 0, id)
		})
	}
}

func TestGetUserRepository(t *testing.T) {
	repo := repository.NewAuthPostgres(db)

	createdUser := user.User{
		Name:         "Bob",
		Password:     "pass123",
		RefreshToken: "token123",
		ExpiresAt:    time.Now().Add(time.Hour),
		Access:       user.AccessLevel(2),
	}
	_, _, _, err := repo.CreateUser(createdUser)
	require.NoError(t, err)

	tests := []struct {
		name        string
		username    string
		password    string
		expectError bool
	}{
		{
			name:        "Valid credentials",
			username:    "Bob",
			password:    "pass123",
			expectError: false,
		},
		{
			name:        "Wrong password",
			username:    "Bob",
			password:    "wrongpass",
			expectError: true,
		},
		{
			name:        "Non-existent user",
			username:    "Ghost",
			password:    "nope",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resultUser, err := repo.GetUser(tt.username, tt.password)

			if tt.expectError {
				assert.Error(t, err)
				assert.Equal(t, user.User{}, resultUser)
				return
			}
			fmt.Printf("LOL: %v", resultUser)
			assert.NoError(t, err)
			assert.Equal(t, 1, int(resultUser.Access))
		})
	}
}

func TestGetUserByIdRepository(t *testing.T) {
	repo := repository.NewAuthPostgres(db)

	createdUser := user.User{
		Name:         "Charlie",
		Password:     "charliepwd",
		RefreshToken: "charlieToken",
		ExpiresAt:    time.Now().Add(24 * time.Hour),
		Access:       user.AccessLevel(3),
	}
	id, _, _, err := repo.CreateUser(createdUser)
	require.NoError(t, err)

	tests := []struct {
		name        string
		userId      int
		expectError bool
	}{
		{
			name:        "Valid user id",
			userId:      id,
			expectError: false,
		},
		{
			name:        "Non-existent user id",
			userId:      999999,
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			resultUser, err := repo.GetUserById(tt.userId)

			if tt.expectError {
				assert.Error(t, err)
				assert.Equal(t, user.User{}, resultUser)
				return
			}

			assert.NoError(t, err)
			assert.Equal(t, tt.userId, resultUser.Id)
			assert.Equal(t, 1, int(resultUser.Access))
			assert.Equal(t, createdUser.RefreshToken, resultUser.RefreshToken)
		})
	}
}

func TestSetUserRefreshTokenRepository(t *testing.T) {
	repo := repository.NewAuthPostgres(db)

	createdUser := user.User{
		Name:         "David",
		Password:     "pass456",
		RefreshToken: "initialToken",
		ExpiresAt:    time.Now().Add(time.Hour),
		Access:       user.AccessLevel(1),
	}
	id, originalAccess, _, err := repo.CreateUser(createdUser)
	require.NoError(t, err)

	tests := []struct {
		name           string
		userId         int
		newToken       string
		newExpiresAt   time.Time
		expectError    bool
		expectedToken  string
		expectedAccess int
	}{
		{
			name:           "Valid update",
			userId:         id,
			newToken:       "updatedToken123",
			newExpiresAt:   time.Now().Add(48 * time.Hour),
			expectError:    false,
			expectedToken:  "updatedToken123",
			expectedAccess: originalAccess,
		},
		{
			name:           "Non-existent user",
			userId:         999999,
			newToken:       "ghostToken",
			newExpiresAt:   time.Now().Add(24 * time.Hour),
			expectError:    true,
			expectedToken:  "",
			expectedAccess: -1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			retId, access, rToken, err := repo.SetUserRefreshToken(tt.userId, tt.newToken, tt.newExpiresAt)

			if tt.expectError {
				assert.Error(t, err)
				assert.Equal(t, -1, retId)
				assert.Equal(t, -1, access)
				assert.Equal(t, "", rToken)
				return
			}

			assert.NoError(t, err)
			assert.Equal(t, tt.userId, retId)
			assert.Equal(t, tt.expectedToken, rToken)
			assert.Equal(t, tt.expectedAccess, access)
		})
	}
}
