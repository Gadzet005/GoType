package repository_test

import (
	"context"
	"fmt"
	"github.com/docker/go-connections/nat"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"log"
	"os"
	"testing"
	"time"
)

var (
	container      testcontainers.Container
	db             *sqlx.DB
	redisHost      string
	redisPort      nat.Port
	redisContainer testcontainers.Container
	redisClient    *redis.Client
)

func TestMain(m *testing.M) {
	req := testcontainers.ContainerRequest{
		Image:        "postgres:13",
		ExposedPorts: []string{"5432/tcp"},
		Env: map[string]string{
			"POSTGRES_USER":     "postgres",
			"POSTGRES_PASSWORD": "password",
			"POSTGRES_DB":       "testdb",
		},
		WaitingFor: wait.ForListeningPort("5432/tcp").
			WithStartupTimeout(60 * time.Second),
	}
	var err error

	container, err = testcontainers.GenericContainer(context.Background(), testcontainers.GenericContainerRequest{
		ContainerRequest: req,
		Started:          true,
	})

	if err != nil {
		log.Fatalf("failed to start container: %v", err)
	}

	host, _ := container.Host(context.Background())
	port, _ := container.MappedPort(context.Background(), "5432")

	dsn := fmt.Sprintf("host=%s port=%s user=postgres password=password dbname=testdb sslmode=disable", host, port.Port())

	db, err = sqlx.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	_, err = db.Exec(`create extension if not exists fuzzystrmatch;`)

	_, err = db.Exec(`CREATE TABLE Users (
                       id serial PRIMARY KEY,
                       name varchar(255) UNIQUE NOT NULL,
                       access int constraint available_level check (access >= 0 and access <= 4) default 1,
                       password_hash varchar(255) NOT NULL,
                       refresh_token varchar(255),
                       expires_at timestamp,
                       ban_expiration timestamp default '2000-01-01 00:00:00',
                       ban_reason text default 'no ban',
                       multiplayer_priority numeric,
                       avatar_path text
);`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE UserStatistic (
                               user_id int PRIMARY KEY not null,
                               num_press_err_by_char_by_lang JSONB DEFAULT '{}',
                               num_level_relax int DEFAULT 0,
                               num_level_classic int DEFAULT 0,
                               num_games_mult int DEFAULT 0,
                               num_chars_classic int DEFAULT 0,
                               num_chars_relax int DEFAULT 0,
                               average_accuracy_classic numeric DEFAULT 0,
                               average_accuracy_relax numeric DEFAULT 0,
                               win_percentage numeric DEFAULT 0,
                               average_delay numeric DEFAULT 1000,
                               num_classes_classic integer[] default '{0, 0, 0, 0, 0}',
                               sum_points int default 0
);`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE LevelComplete (
                               id serial PRIMARY KEY,
                               level_id int NOT NULL,
                               player_id int NOT NULL,
                               time timestamp NOT NULL,
                               num_press_err_by_char JSONB NOT NULL,
                               average_velocity numeric NOT NULL,
                               accuracy numeric NOT NULL,
                               max_combo int NOT NULL,
                               placement int NOT NULL,
                               points int NOT NULL
);
`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE Level (
                       id serial PRIMARY KEY,
                       name text NOT NULL,
                       author int NOT NULL,
                       author_name text NOT NULL,
                       description text NOT NULL,
                       duration int NOT NULL,
                       language text NOT NULL,
                       type text NOT NULL,
                       preview_path text NOT NULL,
                       archive_path text NOT NULL,
                       is_banned bool,
                       num_played int DEFAULT 0,
                       preview_type text NOT NULL,
                       difficulty int CONSTRAINT available_difficulty CHECK (difficulty >= 1 and difficulty <= 10) NOT NULL,
                       creation_time timestamp NOT NULL
);`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE UserComplaint (
                               id serial PRIMARY KEY,
                               user_id int NOT NULL,
                               author int NOT NULL,
                               time timestamp,
                               given_to int DEFAULT -1,
                               reason varchar(32),
                               message text
);
`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE LevelComplaint (
                                id serial PRIMARY KEY,
                                level_id int NOT NULL,
                                author int NOT NULL,
                                time timestamp,
                                given_to int DEFAULT -1,
                                reason varchar(32) NOT NULL,
                                message text
					);`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE Tag (
                     name varchar(100) PRIMARY KEY
);
`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE TABLE LevelTag (
                          level_id int,
                          tag_name varchar(100),
                          PRIMARY KEY (level_id, tag_name)
);`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	_, err = db.Exec(`CREATE UNIQUE INDEX ON Users (name, password_hash);

ALTER TABLE UserStatistic ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE LevelComplete ADD FOREIGN KEY (player_id) REFERENCES Users (id);

ALTER TABLE UserComplaint ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE LevelComplete ADD FOREIGN KEY (level_id) REFERENCES Level (id);

ALTER TABLE LevelComplaint ADD FOREIGN KEY (level_id) REFERENCES Level (id);

ALTER TABLE LevelTag ADD FOREIGN KEY (level_id) REFERENCES Level (id);

ALTER TABLE LevelTag ADD FOREIGN KEY (tag_name) REFERENCES Tag (name);

CREATE INDEX LevelCompleteOnLevelId ON LevelComplete (level_id);`)

	if err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	redisReq := testcontainers.ContainerRequest{
		Image:        "redis:7",
		ExposedPorts: []string{"6379/tcp"},
		WaitingFor:   wait.ForListeningPort("6379/tcp").WithStartupTimeout(30 * time.Second),
	}

	redisContainer, err = testcontainers.GenericContainer(context.Background(), testcontainers.GenericContainerRequest{
		ContainerRequest: redisReq,
		Started:          true,
	})
	if err != nil {
		log.Fatalf("failed to start Redis container: %v", err)
	}

	redisH, _ := redisContainer.Host(context.Background())
	redisP, _ := redisContainer.MappedPort(context.Background(), "6379")
	redisHost = redisH
	redisPort = redisP

	redisClient = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", redisHost, redisPort.Port()),
		DB:   0,
	})
	if err := redisClient.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("failed to ping Redis: %v", err)
	}

	code := m.Run()

	redisContainer.Terminate(context.Background())
	container.Terminate(context.Background())
	db.Close()

	os.Exit(code)
}
