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

func TestSendResults(t *testing.T) {
	userRepo := repository.NewAuthPostgres(db)
	repo := repository.NewSinglePlayerGamePostgres(db)

	createdUser := user.User{
		Name:         "Author1",
		Password:     "pass",
		RefreshToken: "token123",
		ExpiresAt:    time.Now().Add(time.Hour),
		Access:       user.AccessLevel(1),
	}
	userId, _, _, err := userRepo.CreateUser(createdUser)
	require.NoError(t, err)

	_, err = db.Exec(`INSERT INTO Level (id, name, author, description, duration, language, preview_type, type, difficulty, preview_path, author_name, is_banned, archive_path, creation_time)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		100, "Level 100", userId, "Test level", 120, "eng", "png", "classic", 3, "path", "Author Name", false, "path", "2025-04-23 14:30:00")
	require.NoError(t, err)

	_, err = db.Exec(`INSERT INTO Level (id, name, author, description, duration, language, preview_type, type, difficulty, preview_path, author_name, is_banned, archive_path, creation_time)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		101, "Level 100", userId, "Test level relax", 120, "eng", "png", "relax", 3, "path", "Author Name", false, "path", "2025-04-23 14:30:00")
	require.NoError(t, err)

	tests := []struct {
		name      string
		lc        statistics.LevelComplete
		totalPush int
		totalErr  int
		expectErr bool
	}{
		{
			name: "Valid input classic",
			lc: statistics.LevelComplete{
				LevelId:           100,
				PlayerId:          1,
				Time:              time.Now().Unix(),
				NumPressErrByChar: map[rune][2]int{'a': {2, 5}},
				Accuracy:          0.96,
				AverageVelocity:   320,
				MaxCombo:          50,
				Placement:         1,
				Points:            150,
			},
			totalPush: 100,
			totalErr:  4,
			expectErr: false,
		},
		{
			name: "Valid input relax",
			lc: statistics.LevelComplete{
				LevelId:           101,
				PlayerId:          1,
				Time:              time.Now().Unix(),
				NumPressErrByChar: map[rune][2]int{'a': {2, 5}},
				Accuracy:          0.96,
				AverageVelocity:   320,
				MaxCombo:          50,
				Placement:         1,
				Points:            150,
			},
			totalPush: 100,
			totalErr:  4,
			expectErr: false,
		},
		{
			name: "Nonexistent user",
			lc: statistics.LevelComplete{
				LevelId:  100,
				PlayerId: 999,
				Time:     time.Now().Unix(),
			},
			totalPush: 10,
			totalErr:  1,
			expectErr: true,
		},
		{
			name: "Nonexistent level",
			lc: statistics.LevelComplete{
				LevelId:  999,
				PlayerId: 1,
				Time:     time.Now().Unix(),
			},
			totalPush: 10,
			totalErr:  1,
			expectErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := repo.SendResults(tt.lc, tt.totalPush, tt.totalErr)

			if tt.expectErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}
