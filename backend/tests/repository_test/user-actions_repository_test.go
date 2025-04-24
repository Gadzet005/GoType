package repository_test

import (
	"database/sql"
	"errors"
	"fmt"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestDropRefreshToken(t *testing.T) {
	pg := repository.NewUserActionsPostgres(db)

	testCases := []struct {
		name      string
		setup     func() int
		userId    int
		expiresAt time.Time
		expectErr error
	}{
		{
			name: "valid user id",
			setup: func() int {
				var userId int
				err := db.QueryRow(`INSERT INTO Users (name, password_hash, expires_at) VALUES ('testuser', 'hash', $1) RETURNING id`, time.Now().Add(24*time.Hour)).Scan(&userId)
				require.NoError(t, err)
				return userId
			},
			expiresAt: time.Now().Add(48 * time.Hour),
			expectErr: nil,
		},
		{
			name:      "user not found",
			setup:     func() int { return 999999 },
			expiresAt: time.Now().Add(24 * time.Hour),
			expectErr: errors.New(gotype.ErrUserNotFound),
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			id := tc.setup()
			retId, err := pg.DropRefreshToken(id, tc.expiresAt)

			if tc.expectErr != nil {
				assert.Error(t, err)
				assert.Equal(t, -1, retId)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, id, retId)
			}
		})
	}
}

func TestGetUserById(t *testing.T) {
	pg := repository.NewUserActionsPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("user exists", func(t *testing.T) {
		var userId int
		expiresAt := time.Now().Add(24 * time.Hour)
		banTime := time.Now().Add(48 * time.Hour)

		createdUser := user.User{
			Name:         "User1",
			Password:     "hash1",
			RefreshToken: "token123",
			ExpiresAt:    expiresAt,
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		_, err = db.Exec(`UPDATE Users SET avatar_path = '/path/to/avatar', ban_reason = 'testban', ban_expiration = $1 WHERE name='User1'`, banTime)
		err = db.QueryRow(`SELECT id FROM Users WHERE name='User1'`).Scan(&userId)
		require.NoError(t, err)

		name, access, banTimeOut, banReason, avatarPath, err := pg.GetUserById(userId)
		require.NoError(t, err)
		assert.Equal(t, createdUser.Name, name)
		assert.Equal(t, int(createdUser.Access), access)
		assert.WithinDuration(t, banTime, banTimeOut, time.Hour*4)
		assert.Equal(t, "testban", banReason)
		assert.True(t, avatarPath.Valid)
		assert.Equal(t, "/path/to/avatar", avatarPath.String)
	})

	t.Run("user not found", func(t *testing.T) {
		_, _, _, _, _, err := pg.GetUserById(999999)
		fmt.Println(err)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrUserNotFound, err.Error())
	})
}

func TestCreateUserComplaint(t *testing.T) {
	pg := repository.NewUserActionsPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("successfully create user complaint", func(t *testing.T) {
		createdUser := user.User{
			Name:         "UserComplaintTarget",
			Password:     "password1",
			RefreshToken: "token1",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		targetId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		createdAuthor := user.User{
			Name:         "UserComplaintAuthor",
			Password:     "password2",
			RefreshToken: "token2",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		authorId, _, _, err := userRepo.CreateUser(createdAuthor)
		require.NoError(t, err)

		complaint := complaints.UserComplaint{
			UserId:       targetId,
			AuthorId:     authorId,
			CreationTime: time.Now(),
			AssignedTo:   -1,
			Reason:       "cheating",
			Message:      "This user was cheating in a multiplayer game",
		}

		err = pg.CreateUserComplaint(complaint)
		require.NoError(t, err)

		var count int
		err = db.Get(&count, `SELECT COUNT(*) FROM UserComplaint WHERE user_id=$1 AND author=$2`, targetId, authorId)
		require.NoError(t, err)
		assert.Equal(t, 1, count)
	})
}

func TestCreateLevelComplaint(t *testing.T) {
	pg := repository.NewUserActionsPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("successfully create level complaint", func(t *testing.T) {
		author := user.User{
			Name:         "LevelComplaintAuthor",
			Password:     "levelpass",
			RefreshToken: "leveltoken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		authorId, _, _, err := userRepo.CreateUser(author)
		require.NoError(t, err)

		var levelId int
		err = db.QueryRow(`INSERT INTO Level (name, author, author_name, description, duration, language, type, preview_path, archive_path, is_banned, preview_type, difficulty, creation_time)
			VALUES ('Test Level', $1, 'LevelComplaintAuthor', 'A test level', 120, 'en', 'classic', '/preview', '/archive', false, 'image', 5, $2)
			RETURNING id`, authorId, time.Now()).Scan(&levelId)
		require.NoError(t, err)

		complaint := complaints.LevelComplaint{
			LevelId:      levelId,
			AuthorId:     authorId,
			CreationTime: time.Now(),
			AssignedTo:   -1,
			Reason:       "inappropriate",
			Message:      "This level contains inappropriate content",
		}

		err = pg.CreateLevelComplaint(complaint)
		require.NoError(t, err)

		var count int
		err = db.Get(&count, `SELECT COUNT(*) FROM LevelComplaint WHERE level_id=$1 AND author=$2`, levelId, authorId)
		require.NoError(t, err)
		assert.Equal(t, 1, count)
	})
}

func TestUpdateAvatarPath(t *testing.T) {
	pg := repository.NewUserActionsPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("successfully update avatar path", func(t *testing.T) {
		createdUser := user.User{
			Name:         "AvatarTestUser",
			Password:     "avatarpass",
			RefreshToken: "avatartoken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		newAvatarPath := "/new/path/to/avatar"
		oldAvatar, err := pg.UpdateAvatarPath(userId, newAvatarPath)
		require.NoError(t, err)

		var updatedPath sql.NullString
		err = db.QueryRow(`SELECT avatar_path FROM Users WHERE id = $1`, userId).Scan(&updatedPath)
		require.NoError(t, err)

		assert.True(t, updatedPath.Valid)
		assert.Equal(t, newAvatarPath, updatedPath.String)
		assert.Equal(t, "", oldAvatar)
	})

	t.Run("user not found", func(t *testing.T) {
		_, err := pg.UpdateAvatarPath(999999, "/path/that/will/not/be/set")
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrUserNotFound, err.Error())
	})
}
