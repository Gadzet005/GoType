package repository_test

import (
	"context"
	repo "github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestNewPostgresDB_InvalidConfig(t *testing.T) {
	cfg := repo.PostgresConfig{
		Host:     "invalidhost",
		Port:     "9999",
		Username: "wrong",
		Password: "wrong",
		DBName:   "nonexistent",
		SSLMode:  "disable",
	}

	db, err := repo.NewPostgresDB(cfg)

	assert.Error(t, err)
	assert.Nil(t, db)
}

func TestNewRedisDB(t *testing.T) {
	validCfg := repo.RedisConfig{
		Host:         redisHost,
		Port:         redisPort.Port(),
		Password:     "",
		Maxmemory:    "512mb",
		MaxMemPolicy: "allkeys-lru",
	}

	invalidCfg := repo.RedisConfig{
		Host:         "invalidhost",
		Port:         "1234",
		Password:     "wrong",
		Maxmemory:    "512mb",
		MaxMemPolicy: "allkeys-lru",
	}

	tests := []struct {
		name        string
		cfg         repo.RedisConfig
		expectError bool
	}{
		{
			name:        "Valid connection",
			cfg:         validCfg,
			expectError: false,
		},
		{
			name:        "Invalid host",
			cfg:         invalidCfg,
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client, err := repo.NewRedisDB(tt.cfg)

			if tt.expectError {
				assert.Error(t, err)
				assert.Nil(t, client)
				return
			}

			assert.NoError(t, err)
			assert.NotNil(t, client)

			result, err := client.Ping(context.Background()).Result()
			assert.NoError(t, err)
			assert.Equal(t, "PONG", result)

			_ = client.FlushDB(context.Background()).Err()
			_ = client.Close()
		})
	}
}

func TestNewRepo(t *testing.T) {
	r := repo.NewRepository(nil, nil, 1, 1, 1)
	assert.NotNil(t, r)
}
