package repository_test

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"log"
	"os"
	"testing"
	"time"
)

var (
	container testcontainers.Container
	db        *sqlx.DB
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

	//_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(50))`)
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

	code := m.Run()

	container.Terminate(context.Background())
	db.Close()
	os.Exit(code)
}
