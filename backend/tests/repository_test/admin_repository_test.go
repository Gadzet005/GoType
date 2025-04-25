package repository_test

import (
	"fmt"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestGetUserAccess(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("access level found", func(t *testing.T) {
		createdUser := user.User{
			Name:         "AccessUser",
			Password:     "accesshash",
			RefreshToken: "accessToken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(2),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		_, err = db.Exec(`UPDATE Users SET access = 2 WHERE name='AccessUser'`)
		require.NoError(t, err)

		access, err := pg.GetUserAccess(userId)
		require.NoError(t, err)
		assert.Equal(t, 2, access)
	})

	t.Run("user not found", func(t *testing.T) {
		access, err := pg.GetUserAccess(999999)
		assert.Error(t, err)
		assert.Equal(t, -1, access)
		assert.Equal(t, gotype.ErrUserNotFound, err.Error())
	})
}

func TestBanUser(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("ban user successfully", func(t *testing.T) {
		createdUser := user.User{
			Name:         "BannedUser",
			Password:     "banpass",
			RefreshToken: "banToken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		expiration := time.Now().Add(48 * time.Hour)
		reason := "violation of rules"
		err = pg.BanUser(userId, expiration, reason)
		require.NoError(t, err)

		var banTime time.Time
		var banReason string
		err = db.QueryRow(`SELECT ban_expiration, ban_reason FROM Users WHERE id = $1`, userId).Scan(&banTime, &banReason)
		require.NoError(t, err)
		assert.WithinDuration(t, expiration, banTime, time.Second+time.Hour*3)
		assert.Equal(t, reason, banReason)
	})

	t.Run("user not found", func(t *testing.T) {
		err := pg.BanUser(999999, time.Now().Add(24*time.Hour), "fake reason")
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrUserNotFound, err.Error())
	})
}

func TestUnbanUser(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("unban user successfully", func(t *testing.T) {
		createdUser := user.User{
			Name:         "UnbanUser",
			Password:     "unbanpass",
			RefreshToken: "unbanToken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		expiration := time.Now().Add(48 * time.Hour)
		reason := "bad behavior"
		err = pg.BanUser(userId, expiration, reason)
		require.NoError(t, err)

		err = pg.UnbanUser(userId)
		require.NoError(t, err)

		var banTime time.Time
		var banReason string
		err = db.QueryRow(`SELECT ban_expiration, ban_reason FROM Users WHERE id = $1`, userId).Scan(&banTime, &banReason)
		require.NoError(t, err)

		assert.WithinDuration(t, time.Now().UTC(), banTime, time.Second*5)
		assert.Equal(t, "no ban", banReason)
	})

	t.Run("user not found", func(t *testing.T) {
		err := pg.UnbanUser(999999)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrUserNotFound, err.Error())
	})
}

func TestBanLevel(t *testing.T) {
	pg := repository.NewAdminPostgres(db)

	t.Run("ban level successfully", func(t *testing.T) {
		var levelId int
		err := db.QueryRow(`INSERT INTO Level (name, author, author_name, description, duration, language, type, preview_path, archive_path, preview_type, difficulty, creation_time, is_banned) VALUES ('Test Level', 1, 'Author', 'desc', 60, 'en', 'classic', '/preview.png', '/archive.zip', 'image', 3, $1, false) RETURNING id`, time.Now()).Scan(&levelId)
		require.NoError(t, err)

		err = pg.BanLevel(levelId)
		require.NoError(t, err)

		var isBanned bool
		err = db.QueryRow(`SELECT is_banned FROM Level WHERE id = $1`, levelId).Scan(&isBanned)
		require.NoError(t, err)
		assert.True(t, isBanned)
	})

	t.Run("level not found", func(t *testing.T) {
		err := pg.BanLevel(999999)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestUnbanLevel(t *testing.T) {
	pg := repository.NewAdminPostgres(db)

	t.Run("unban level successfully", func(t *testing.T) {
		var levelId int
		err := db.QueryRow(`INSERT INTO Level (name, author, author_name, description, duration, language, type, preview_path, archive_path, preview_type, difficulty, creation_time, is_banned) VALUES ('LevelToUnban', 1, 'Author', 'desc', 60, 'en', 'classic', '/preview.png', '/archive.zip', 'image', 3, $1, true) RETURNING id`, time.Now()).Scan(&levelId)
		require.NoError(t, err)

		err = pg.UnbanLevel(levelId)
		require.NoError(t, err)

		var isBanned bool
		err = db.QueryRow(`SELECT is_banned FROM Level WHERE id = $1`, levelId).Scan(&isBanned)
		require.NoError(t, err)
		assert.False(t, isBanned)
	})

	t.Run("level not found", func(t *testing.T) {
		err := pg.UnbanLevel(999999)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestChangeUserAccess(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("change user access successfully", func(t *testing.T) {
		createdUser := user.User{
			Name:         "TestChangeUserAccessUser",
			Password:     "accesshash",
			RefreshToken: "accessToken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		newAccess := 3
		err = pg.ChangeUserAccess(userId, newAccess)
		require.NoError(t, err)

		var access int
		err = db.QueryRow(`SELECT access FROM Users WHERE id = $1`, userId).Scan(&access)
		require.NoError(t, err)
		assert.Equal(t, newAccess, access)
	})

	t.Run("user not found", func(t *testing.T) {
		err := pg.ChangeUserAccess(999999, 2)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrUserNotFound, err.Error())
	})
}

func TestGetUserComplaints(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("returns and assigns user complaints", func(t *testing.T) {
		createdUser := user.User{
			Name:         "TestGetUserComplaintsUser",
			Password:     "accesshash",
			RefreshToken: "accessToken",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		moderatorId := 123456
		for i := 0; i < 3; i++ {
			_, err := db.Exec(`INSERT INTO UserComplaint (user_id, author, time, given_to, reason, message) VALUES ($1, 2, $2, -1, 'reason', 'message')`, userId, time.Now())
			require.NoError(t, err)
		}

		complaints, err := pg.GetUserComplaints(moderatorId)
		require.NoError(t, err)
		assert.NotEmpty(t, complaints)
		for _, c := range complaints {
			assert.Equal(t, moderatorId, c.AssignedTo)
		}
	})

	t.Run("no unassigned complaints", func(t *testing.T) {
		moderatorId := 888888
		complaints, err := pg.GetUserComplaints(moderatorId)
		require.NoError(t, err)
		assert.Len(t, complaints, 0)
	})
}

func TestGetLevelComplaints(t *testing.T) {
	pg := repository.NewAdminPostgres(db)

	t.Run("returns and assigns level complaints", func(t *testing.T) {
		moderatorId := 654321

		createdLevel := level.Level{
			Name:       "TestGetUserComplaintsLevel",
			Difficulty: 1,
		}

		var createdLevelId int
		query := fmt.Sprintf("INSERT INTO %s (name, author, description, duration, language, type, preview_path, archive_path, is_banned, difficulty, preview_type, author_name, creation_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id", "Level")
		err := db.QueryRow(query, createdLevel.Name, createdLevel.Author, createdLevel.Description, createdLevel.Duration, createdLevel.Language, createdLevel.Type, ".", ".", 0, createdLevel.Difficulty, createdLevel.ImageType, createdLevel.AuthorName, time.Now().UTC()).Scan(&createdLevelId)
		require.NoError(t, err)

		for i := 0; i < 2; i++ {
			_, err = db.Exec(`INSERT INTO LevelComplaint (level_id, author, time, given_to, reason, message) VALUES (1, 2, $1, -1, 'bad level', 'too hard')`, time.Now())
			require.NoError(t, err)
		}

		complaints, err := pg.GetLevelComplaints(moderatorId)
		require.NoError(t, err)
		assert.NotEmpty(t, complaints)
		for _, c := range complaints {
			assert.Equal(t, moderatorId, c.AssignedTo)
		}
	})

	t.Run("no unassigned complaints", func(t *testing.T) {
		moderatorId := 777777
		complaints, err := pg.GetLevelComplaints(moderatorId)
		require.NoError(t, err)
		assert.Len(t, complaints, 0)
	})
}

func TestDeleteUserComplaint(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("successfully deletes user complaint", func(t *testing.T) {
		createdUser := user.User{
			Name:         "DeleteUserComplaintTest",
			Password:     "test",
			RefreshToken: "refresh",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       user.AccessLevel(1),
		}
		userId, _, _, err := userRepo.CreateUser(createdUser)
		require.NoError(t, err)

		moderatorId := 3001
		var complaintId int
		err = db.QueryRow(`INSERT INTO UserComplaint (user_id, author, time, given_to, reason, message)
			VALUES ($1, $2, $3, $4, 'reason', 'message') RETURNING id`,
			userId, 2, time.Now(), moderatorId).Scan(&complaintId)
		require.NoError(t, err)

		err = pg.DeleteUserComplaint(moderatorId, complaintId)
		assert.NoError(t, err)

		var count int
		err = db.QueryRow(`SELECT COUNT(*) FROM UserComplaint WHERE id = $1`, complaintId).Scan(&count)
		require.NoError(t, err)
		assert.Equal(t, 0, count)
	})

	t.Run("non-existent complaint", func(t *testing.T) {
		err := pg.DeleteUserComplaint(9999, 12345678)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestDeleteLevelComplaint(t *testing.T) {
	pg := repository.NewAdminPostgres(db)

	t.Run("successfully deletes level complaint", func(t *testing.T) {
		levelName := "DeleteLevelComplaintLevel"
		var levelId int
		err := db.QueryRow(`INSERT INTO Level (name, author, description, duration, language, type, preview_path, archive_path, is_banned, difficulty, preview_type, author_name, creation_time)
			VALUES ($1, 1, 'desc', 100, 'EN', 'type', '.', '.', false, 1, 'image', 'author', $2) RETURNING id`,
			levelName, time.Now()).Scan(&levelId)
		require.NoError(t, err)

		moderatorId := 4002
		var complaintId int
		err = db.QueryRow(`INSERT INTO LevelComplaint (level_id, author, time, given_to, reason, message)
			VALUES ($1, 3, $2, $3, 'too hard', 'fix please') RETURNING id`,
			levelId, time.Now(), moderatorId).Scan(&complaintId)
		require.NoError(t, err)

		err = pg.DeleteLevelComplaint(moderatorId, complaintId)
		assert.NoError(t, err)

		var count int
		err = db.QueryRow(`SELECT COUNT(*) FROM LevelComplaint WHERE id = $1`, complaintId).Scan(&count)
		require.NoError(t, err)
		assert.Equal(t, 0, count)
	})

	t.Run("non-existent complaint", func(t *testing.T) {
		err := pg.DeleteLevelComplaint(9999, 9876543)
		assert.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestGetUsers(t *testing.T) {
	pg := repository.NewAdminPostgres(db)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("returns users filtered by name similarity and ban status", func(t *testing.T) {
		_, _ = db.Exec(`DELETE FROM Users`)

		user1 := user.User{
			Name:         "TestGetUsersAliceWonder",
			Password:     "pass1",
			RefreshToken: "ref1",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       1,
		}
		user2 := user.User{
			Name:         "TestGetUsersBobBuilder",
			Password:     "pass2",
			RefreshToken: "ref2",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       1,
		}
		user3 := user.User{
			Name:         "TestGetUsersBannedBob",
			Password:     "pass3",
			RefreshToken: "ref3",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       1,
		}

		_, _, _, err := userRepo.CreateUser(user1)
		require.NoError(t, err)
		_, _, _, err = userRepo.CreateUser(user2)
		require.NoError(t, err)
		id3, _, _, err := userRepo.CreateUser(user3)
		require.NoError(t, err)

		banQuery := fmt.Sprintf("UPDATE %s SET ban_expiration = $1, ban_reason = $2 WHERE id = $3", "Users")
		_, err = db.Exec(banQuery, time.Now().Add(24*time.Hour), "violation", id3)
		require.NoError(t, err)

		params := user.UserSearchParams{
			Name:     "",
			IsBanned: false,
			PageSize: 10,
			Offset:   1,
		}

		users, err := pg.GetUsers(params)
		require.NoError(t, err)
		assert.NotEmpty(t, users)
		for _, u := range users {
			assert.NotEqual(t, "BannedBob", u.Name, "Banned users should not appear when IsBanned is false")
		}

		params.IsBanned = true
		users, err = pg.GetUsers(params)
		require.NoError(t, err)
		require.NotEmpty(t, users)

		fmt.Println(users)
		foundNotBanned := false
		for _, u := range users {
			if u.Name == "TestGetUsersBobBuilder" || u.Name == "TestGetUsersAliceWonder" {
				foundNotBanned = true
				break
			}
		}
		assert.False(t, foundNotBanned, "Should return banned user when IsBanned is true")
	})

}
