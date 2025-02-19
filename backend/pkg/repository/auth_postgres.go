package repository

import (
	"database/sql"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"strings"
	"time"
)

type AuthPostgres struct {
	db     *sqlx.DB
	client *redis.Client
}

func NewAuthPostgres(db *sqlx.DB, client *redis.Client) *AuthPostgres {
	return &AuthPostgres{db: db, client: client}
}

func (s *AuthPostgres) CreateSeniorAdmin(name string, password string) error {
	var id int
	//TODO: Transaction! Required
	query := fmt.Sprintf("INSERT INTO %s (name, password_hash, refresh_token, expires_at, access) VALUES ($1, $2, $3, $4, $5) RETURNING id", usersTable)

	row := s.db.QueryRow(query, name, password, "token", time.Now().UTC(), entities.SeniorAdmin)

	if err := row.Scan(&id); err != nil {
		if strings.HasPrefix(err.Error(), "pq: duplicate key value violates unique constraint") {
			return errors.New(gotype.ErrUserExists)
		}

		return errors.New(gotype.ErrInternal)
	}

	err := s.CreateStats(id)

	if err != nil {
		return err
	}

	return nil
}

func (s *AuthPostgres) CreateUser(user entities.User) (int, int, string, error) {
	var id int
	var access int
	var rToken string
	//TODO: Transaction! Required
	query := fmt.Sprintf("INSERT INTO %s (name, password_hash, refresh_token, expires_at) VALUES ($1, $2, $3, $4) RETURNING id, access, refresh_token", usersTable)

	row := s.db.QueryRow(query, user.Name, user.Password, user.RefreshToken, user.ExpiresAt)

	if err := row.Scan(&id, &access, &rToken); err != nil {
		if strings.HasPrefix(err.Error(), "pq: duplicate key value violates unique constraint") {
			return -1, -1, "", errors.New(gotype.ErrUserExists)
		}

		return -1, -1, "", errors.New(gotype.ErrInternal)
	}

	err := s.CreateStats(id)

	if err != nil {
		return -1, -1, "", err
	}

	return id, access, rToken, nil
}

func (s *AuthPostgres) GetUser(username, password string) (entities.User, error) {
	var user entities.User
	query := fmt.Sprintf("SELECT id, access FROM %s WHERE name = $1 AND password_hash = $2", usersTable)

	err := s.db.Get(&user, query, username, password)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return entities.User{}, errors.New(gotype.ErrUserNotFound)
		}

		return entities.User{}, errors.New(gotype.ErrInternal)
	}

	return user, nil
}

func (s *AuthPostgres) GetUserById(id int) (entities.User, error) {
	var user entities.User
	query := fmt.Sprintf("SELECT id, access, refresh_token, expires_at FROM %s WHERE id = $1", usersTable)

	err := s.db.Get(&user, query, id)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return entities.User{}, errors.New(gotype.ErrUserNotFound)
		}

		return entities.User{}, errors.New(gotype.ErrInternal)
	}

	return user, nil
}

func (s *AuthPostgres) SetUserRefreshToken(id int, refreshToken string, expiresAt time.Time) (int, int, string, error) {
	var retId int
	var access int
	var rToken string

	query := fmt.Sprintf("UPDATE %s SET refresh_token = $1, expires_at = $2 WHERE id = $3 RETURNING refresh_token, id, access", usersTable)

	row := s.db.QueryRow(query, refreshToken, expiresAt, id)
	if err := row.Scan(&rToken, &retId, &access); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return -1, -1, "", errors.New(gotype.ErrUserNotFound)
		}

		return -1, -1, "", errors.New(gotype.ErrInternal)
	}

	return retId, access, rToken, nil
}

func (s *AuthPostgres) CreateStats(userId int) error {
	var id int

	query := fmt.Sprintf("INSERT INTO %s (user_id) VALUES ($1) RETURNING user_id", statsTable)

	row := s.db.QueryRow(query, userId)

	if err := row.Scan(&id); err != nil {
		return errors.New(gotype.ErrInternal)
	}

	return nil
}
