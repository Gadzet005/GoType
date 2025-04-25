package repository_test

import (
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestGetUserStats(t *testing.T) {
	statsRepo := repository.NewStatsPostgresMock(db, redisClient)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("returns correct stats for existing user", func(t *testing.T) {

		testUser := user.User{
			Name:         "TestStatsUser",
			Password:     "secret",
			RefreshToken: "token",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       1,
		}
		userId, _, _, err := userRepo.CreateUser(testUser)
		require.NoError(t, err)

		stats, err := statsRepo.GetUserStats(userId)
		require.NoError(t, err)
		assert.Equal(t, userId, stats.UserId)
		assert.Equal(t, "TestStatsUser", stats.UserName)
		assert.Equal(t, 0, stats.NumLevelClassic)
		assert.Equal(t, 0, stats.SumPoints)
	})

	t.Run("returns error for non-existing user", func(t *testing.T) {
		stats, err := statsRepo.GetUserStats(99999999)
		assert.Error(t, err)
		assert.Equal(t, statistics.PlayerStats{}, stats)
	})
}

func TestStatsPostgres_GetUsersTop(t *testing.T) {
	statsRepo := repository.NewStatsPostgresMock(db, redisClient)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("returns top users by sum_points", func(t *testing.T) {
		_, _ = db.Exec(`DELETE FROM UserStatistic`)
		_, _ = db.Exec(`DELETE FROM Users`)

		testUser := user.User{
			Name:         "TopStatsUser",
			Password:     "123",
			RefreshToken: "refresh",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       1,
		}
		userId, _, _, err := userRepo.CreateUser(testUser)
		require.NoError(t, err)

		params := map[string]interface{}{
			"sort_param": "sum_points",
			"sort_order": "DESC",
			"page_size":  10,
			"page_num":   1,
		}

		topUsers, err := statsRepo.GetUsersTop(params)
		require.NoError(t, err)
		require.NotEmpty(t, topUsers)

		found := false
		for _, u := range topUsers {
			if u.UserId == userId {
				found = true
				break
			}
		}
		assert.True(t, found, "Top user should be in result")
	})

	t.Run("returns empty list when no stats", func(t *testing.T) {
		params := map[string]interface{}{
			"sort_param": "sum_points",
			"sort_order": "DESC",
			"page_size":  10,
			"page_num":   10,
		}
		topUsers, err := statsRepo.GetUsersTop(params)
		require.NoError(t, err)
		assert.Len(t, topUsers, 0)
	})
}
