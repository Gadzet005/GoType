package repository

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
)

const (
	maxmemoryPolicy = "allkeys-lru"
	maxmemory       = "512mb"
)

type RedisConfig struct {
	Host     string
	Port     string
	Password string
}

func NewRedisDB(cfg RedisConfig) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.Host, cfg.Port),
		Password: cfg.Password,
		DB:       0,
	})

	ping, err := client.Ping(context.Background()).Result()
	if err != nil || ping != "PONG" {
		return nil, err
	}

	err = client.ConfigSet(context.Background(), "maxmemory", maxmemory).Err()
	if err != nil {
		return nil, err
	}

	err = client.ConfigSet(context.Background(), "maxmemory-policy", maxmemoryPolicy).Err()
	if err != nil {
		return nil, err
	}

	return client, nil
}
