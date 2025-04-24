package repository_test

import (
	levels "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"testing"
	"time"
)

func TestLevelPostgres_CreateLevel(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)

	t.Run("successfully creates level", func(t *testing.T) {
		_, _ = db.Exec(`DELETE FROM LevelTag`)
		_, _ = db.Exec(`DELETE FROM Tag`)
		_, _ = db.Exec(`DELETE FROM Level`)
		_, _ = db.Exec(`DELETE FROM Users`)

		author := user.User{
			Name:         "LevelCreator",
			Password:     "secure",
			RefreshToken: "refresh_token",
			ExpiresAt:    time.Now().Add(time.Hour * 24),
			Access:       1,
		}
		userRepo := repository.NewAuthPostgres(db)
		authorID, _, _, err := userRepo.CreateUser(author)
		require.NoError(t, err)

		_, err = db.Exec(`INSERT INTO Tag (name) VALUES ($1), ($2)`, "speed", "classic")
		require.NoError(t, err)

		level := levels.Level{
			Name:        "Cool Level",
			Author:      authorID,
			AuthorName:  author.Name,
			Description: "Test level description",
			Duration:    120,
			Language:    "en",
			Type:        "classic",
			Tags:        []string{"speed", "classic"},
			Difficulty:  5,
			ImageType:   "jpeg",
		}

		previewName, archiveName, id, err := levelRepo.CreateLevel(level)
		require.NoError(t, err)
		assert.NotEmpty(t, previewName)
		assert.NotEmpty(t, archiveName)
		assert.True(t, id > 0)

		var count int
		err = db.Get(&count, `SELECT COUNT(*) FROM Level WHERE id = $1 AND name = $2`, id, level.Name)
		require.NoError(t, err)
		assert.Equal(t, 1, count)

		err = db.Get(&count, `SELECT COUNT(*) FROM LevelTag WHERE level_id = $1`, id)
		require.NoError(t, err)
		assert.Equal(t, len(level.Tags), count)
	})

	t.Run("no fail with invalid tag", func(t *testing.T) {
		level := levels.Level{
			Name:        "Invalid Tag Level",
			Author:      1,
			AuthorName:  "Fake",
			Description: "This should fail",
			Duration:    60,
			Language:    "ru",
			Type:        "relax",
			Tags:        []string{"nonexistent_tag"},
			Difficulty:  3,
			ImageType:   "png",
		}

		_, _, _, err := levelRepo.CreateLevel(level)
		assert.Nil(t, err)
	})
}

func TestDeleteLevel(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("successfully deletes level and related tags", func(t *testing.T) {
		_, _ = db.Exec(`DELETE FROM LevelTag`)
		_, _ = db.Exec(`DELETE FROM Tag`)
		_, _ = db.Exec(`DELETE FROM Level`)
		_, _ = db.Exec(`DELETE FROM Users`)

		testUser := user.User{
			Name:         "LevelOwner",
			Password:     "pass",
			RefreshToken: "refresh_token",
			ExpiresAt:    time.Now().Add(48 * time.Hour),
			Access:       1,
		}
		userId, _, _, err := userRepo.CreateUser(testUser)
		require.NoError(t, err)

		_, err = db.Exec(`INSERT INTO Tag (name) VALUES ('tag1'), ('tag2')`)
		require.NoError(t, err)

		level := levels.Level{
			Name:        "Cool Level",
			Author:      userId,
			AuthorName:  testUser.Name,
			Description: "Test level description",
			Duration:    120,
			Language:    "eng",
			Type:        "classic",
			Tags:        []string{"tag1", "tag2"},
			Difficulty:  5,
			ImageType:   "jpeg",
		}

		_, _, levelId, err := levelRepo.CreateLevel(level)
		require.NoError(t, err)

		err = levelRepo.DeleteLevel(levelId)
		require.NoError(t, err)

		var count int
		err = db.Get(&count, `SELECT COUNT(*) FROM Level WHERE id = $1`, levelId)
		require.NoError(t, err)
		assert.Equal(t, 0, count)

		err = db.Get(&count, `SELECT COUNT(*) FROM LevelTag WHERE level_id = $1`, levelId)
		require.NoError(t, err)
		assert.Equal(t, 0, count)
	})

	t.Run("returns nil if level does not exist", func(t *testing.T) {
		err := levelRepo.DeleteLevel(99999)
		assert.NoError(t, err)
	})
}

func TestLevelPostgres_UpdateLevel(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)

	t.Run("successfully updates existing level", func(t *testing.T) {
		initialLevel := levels.Level{
			Name:        "Old Level",
			Author:      1,
			Description: "Initial Desc",
			Duration:    120,
			Language:    "EN",
			Type:        "classic",
			Tags:        []string{"tag1", "tag2"},
			Difficulty:  3,
			ImageType:   "png",
			AuthorName:  "Author",
		}

		_, _, levelId, err := levelRepo.CreateLevel(initialLevel)
		require.NoError(t, err)

		updatedInfo := levels.LevelUpdateStruct{
			Id:          levelId,
			Name:        "Updated Level",
			Description: "Updated Desc",
			Duration:    150,
			Language:    "RU",
			Type:        "relax",
			Tags:        []string{"tag3", "tag4"},
			Author:      1,
			AuthorName:  "UpdatedAuthor",
		}

		_, _, id, err := levelRepo.UpdateLevel(updatedInfo)

		require.NoError(t, err)
		assert.Equal(t, levelId, id)

		var name, desc, lang, typ, authorName string
		err = db.QueryRow(`SELECT name, description, language, type, author_name FROM Level WHERE id = $1`, id).
			Scan(&name, &desc, &lang, &typ, &authorName)
		require.NoError(t, err)

		assert.Equal(t, "Updated Level", name)
		assert.Equal(t, "Updated Desc", desc)
		assert.Equal(t, "RU", lang)
		assert.Equal(t, "relax", typ)
		assert.Equal(t, "UpdatedAuthor", authorName)
	})

	t.Run("returns ErrEntityNotFound if level does not exist", func(t *testing.T) {
		nonExistentLevel := levels.LevelUpdateStruct{
			Id:          9999,
			Name:        "DoesNotExist",
			Description: "Nope",
			Duration:    100,
			Language:    "EN",
			Type:        "classic",
			Tags:        []string{"tag1"},
			Author:      1,
			AuthorName:  "Ghost",
		}

		_, _, _, err := levelRepo.UpdateLevel(nonExistentLevel)
		require.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestLevelPostgres_GetLevelById(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)

	t.Run("successfully retrieves existing level", func(t *testing.T) {
		testLevel := levels.Level{
			Name:        "TestGetLevel",
			Author:      1,
			Description: "Level for GetLevelById",
			Duration:    100,
			Language:    "EN",
			Type:        "classic",
			Tags:        []string{"tag1", "tag2"},
			Difficulty:  2,
			ImageType:   "jpeg",
			AuthorName:  "TestAuthor",
		}

		_, _, levelId, err := levelRepo.CreateLevel(testLevel)
		require.NoError(t, err)

		retrievedLevel, err := levelRepo.GetLevelById(levelId)
		require.NoError(t, err)

		assert.Equal(t, testLevel.Name, retrievedLevel.Name)
		assert.Equal(t, testLevel.Description, retrievedLevel.Description)
		assert.Equal(t, testLevel.Language, retrievedLevel.Language)
		assert.ElementsMatch(t, testLevel.Tags, retrievedLevel.Tags)
		assert.Equal(t, testLevel.Author, retrievedLevel.Author)
	})

	t.Run("returns ErrEntityNotFound for non-existent level", func(t *testing.T) {
		_, err := levelRepo.GetLevelById(999999)
		require.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestLevelPostgres_GetPathsById(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)

	t.Run("successfully retrieves paths and authorId", func(t *testing.T) {
		testLevel := levels.Level{
			Name:        "TestPathLevel",
			Author:      2,
			Description: "Level for path test",
			Duration:    60,
			Language:    "RU",
			Type:        "speedrun",
			Tags:        []string{"path", "test"},
			Difficulty:  1,
			ImageType:   "png",
			AuthorName:  "PathAuthor",
		}

		_, _, levelId, err := levelRepo.CreateLevel(testLevel)
		require.NoError(t, err)

		authorId, _, _, err := levelRepo.GetPathsById(levelId)
		require.NoError(t, err)

		assert.Equal(t, testLevel.Author, authorId)
	})

	t.Run("returns ErrEntityNotFound for missing level", func(t *testing.T) {
		_, _, _, err := levelRepo.GetPathsById(888888)
		require.Error(t, err)
		assert.Equal(t, gotype.ErrEntityNotFound, err.Error())
	})
}

func TestLevelPostgres_FetchLevels(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)

	t.Run("successfully fetches levels by filters", func(t *testing.T) {
		testLevel := levels.Level{
			Name:        "SearchableLevel",
			Author:      10,
			Description: "A level for fetch test",
			Duration:    120,
			Language:    "EN",
			Type:        "adventure",
			Tags:        []string{"fetch_tag"},
			Difficulty:  4,
			ImageType:   "png",
			AuthorName:  "Fetcher",
		}
		_, _, levelId, err := levelRepo.CreateLevel(testLevel)
		require.NoError(t, err)

		params := map[string]interface{}{
			"tags":       []string{"fetch_tag"},
			"language":   "EN",
			"difficulty": 4,
			"level_name": "SearchableLevel",
			"sort_param": "creation_time",
			"sort_order": "DESC",
			"page_size":  10,
			"page_num":   1,
		}

		levels, err := levelRepo.FetchLevels(params)
		require.NoError(t, err)
		require.NotEmpty(t, levels)

		found := false
		for _, level := range levels {
			if level.Id == levelId {
				found = true
				assert.Contains(t, level.Tags, "fetch_tag")
				assert.Equal(t, "EN", level.Language)
				break
			}
		}
		assert.True(t, found, "Expected level not found in result")
	})

	t.Run("returns empty result when filters don't match", func(t *testing.T) {
		params := map[string]interface{}{
			"tags":       []string{"nonexistent_tag"},
			"language":   "RU",
			"difficulty": 10,
			"level_name": "NonMatchingName",
			"sort_param": "creation_time",
			"sort_order": "DESC",
			"page_size":  10,
			"page_num":   1,
		}

		level, err := levelRepo.FetchLevels(params)
		require.NoError(t, err)
		assert.Empty(t, level)
	})
}

func TestGetLevelStats(t *testing.T) {
	levelRepo := repository.NewLevelPostgres(db, redisClient)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("returns stats from db and caches them", func(t *testing.T) {
		_, _ = db.Exec(`DELETE FROM LevelTag`)
		_, _ = db.Exec(`DELETE FROM Tag`)
		_, _ = db.Exec(`DELETE FROM Level`)
		_, _ = db.Exec(`DELETE FROM Users`)

		testLevel := levels.Level{
			Name:        "StatsLevel",
			Author:      42,
			Description: "Level for stats",
			Duration:    90,
			Language:    "EN",
			Type:        "stats",
			Tags:        []string{"stat_test"},
			Difficulty:  3,
			ImageType:   "png",
			AuthorName:  "StatGuy",
		}
		_, _, levelId, err := levelRepo.CreateLevel(testLevel)
		require.NoError(t, err)

		testUser := user.User{
			Name:         "TestGetLevelStats",
			Password:     "pass",
			RefreshToken: "refresh_token",
			ExpiresAt:    time.Now().Add(48 * time.Hour),
			Access:       1,
		}
		userId, _, _, err := userRepo.CreateUser(testUser)
		require.NoError(t, err)

		_, err = db.Exec(`INSERT INTO LevelComplete (player_id, level_id, accuracy, max_combo, points, average_velocity, placement, num_press_err_by_char, time) VALUES 
			($1, $2, 95.5, 120, 9500, 3.2, 1, '{}', '2025-04-23 14:30:00'),
			($1, $2, 88.0, 100, 8700, 3.0, 1, '{}', '2025-04-23 14:30:00')`, userId, levelId)
		require.NoError(t, err)

		stats, err := levelRepo.GetLevelStats(levelId)
		require.NoError(t, err)

		assert.Equal(t, 2, stats.NumPlayed)
		assert.InDelta(t, 91.75, stats.AverageAccuracy, 0.01)
		assert.Equal(t, 120, stats.MaxCombo)
		assert.Equal(t, 9500, stats.MaxPoints)
		assert.InDelta(t, 9100, stats.AveragePoints, 1)
		assert.InDelta(t, 3.1, stats.AverageAverageVelocity, 0.01)
		assert.Equal(t, 3.2, stats.MaxAverageVelocity)
	})

	t.Run("returns stats from cache if present", func(t *testing.T) {
		expected := statistics.LevelStats{
			NumPlayed:              5,
			AverageAccuracy:        85.5,
			MaxCombo:               200,
			MaxPoints:              10000,
			AveragePoints:          8500,
			AverageAverageVelocity: 2,
			MaxAverageVelocity:     3.0,
		}
		levelId := 777
		err := levelRepo.SaveLevelStatsInCache(levelId, expected)
		require.NoError(t, err)

		actual, err := levelRepo.GetLevelStats(levelId)
		require.NoError(t, err)

		assert.Equal(t, expected, actual)
	})
}

func TestLevelPostgres_GetLevelUserTop(t *testing.T) {
	lp := repository.NewLevelPostgres(db, redisClient)
	userRepo := repository.NewAuthPostgres(db)

	t.Run("returns top 10 users for level by points", func(t *testing.T) {
		_, _ = db.Exec("DELETE FROM LevelComplete")
		_, _ = db.Exec("DELETE FROM Users")
		_, _ = db.Exec(`DELETE FROM Tag`)
		_, _ = db.Exec(`DELETE FROM Level`)

		testUser := user.User{
			Name:         "TopLevelUser",
			Password:     "123",
			RefreshToken: "refresh",
			ExpiresAt:    time.Now().Add(24 * time.Hour),
			Access:       1,
		}
		userId, _, _, err := userRepo.CreateUser(testUser)
		require.NoError(t, err)

		testLevel := levels.Level{
			Name:        "TopLevel",
			Author:      userId,
			Description: "Test level for user top",
			Duration:    120,
			Language:    "en",
			Type:        "normal",
			Difficulty:  5,
			ImageType:   "png",
			AuthorName:  "TopLevelUser",
		}
		_, _, levelId, err := lp.CreateLevel(testLevel)
		require.NoError(t, err)

		_, err = db.Exec(`INSERT INTO LevelComplete (player_id, level_id, accuracy, max_combo, points, average_velocity, placement, num_press_err_by_char, time) VALUES ($1, $2, 95.0, 120, 10000, 1.2, 1, '{}', '2025-04-23 14:30:00')`, userId, levelId)
		require.NoError(t, err)

		topUsers, err := lp.GetLevelUserTop(levelId)
		require.NoError(t, err)
		require.NotEmpty(t, topUsers)

		assert.Equal(t, userId, topUsers[0].PlayerId)
		assert.Equal(t, "TopLevelUser", topUsers[0].PlayerName)
	})

	t.Run("returns empty slice if no completions", func(t *testing.T) {
		_, err := db.Exec("DELETE FROM LevelComplete")
		require.NoError(t, err)

		topUsers, err := lp.GetLevelUserTop(999999)
		require.NoError(t, err)
		assert.Empty(t, topUsers)
	})
}
