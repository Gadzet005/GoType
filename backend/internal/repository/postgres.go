package repository

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

const (
	usersTable           = "Users"
	userComplaintsTable  = "UserComplaint"
	levelComplaintsTable = "LevelComplaint"
	levelTable           = "Level"
	statsTable           = "UserStatistic"
	levelCompleteTable   = "LevelComplete"
)

type PostgresConfig struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	SSLMode  string
}

func NewPostgresDB(cfg PostgresConfig) (*sqlx.DB, error) {
	db, err := sqlx.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.Username, cfg.Password, cfg.DBName, cfg.SSLMode))

	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}
