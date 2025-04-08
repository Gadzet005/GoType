package repository

import (
	"database/sql"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/jmoiron/sqlx"
	"strings"
	"time"
)

type AuthPostgres struct {
	db *sqlx.DB
}

func NewAuthPostgres(db *sqlx.DB) *AuthPostgres {
	return &AuthPostgres{db: db}
}

func (s *AuthPostgres) CreateSeniorAdmin(name string, password string) error {
	var id int

	tx, err := s.db.Begin()
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	query := fmt.Sprintf("INSERT INTO %s (name, password_hash, refresh_token, expires_at, access) VALUES ($1, $2, $3, $4, $5) RETURNING id", usersTable)
	row := tx.QueryRow(query, name, password, "token", time.Now().UTC(), user.SeniorAdmin)

	if err := row.Scan(&id); err != nil {
		tx.Rollback()
		if strings.HasPrefix(err.Error(), "pq: duplicate key value violates unique constraint") {
			return errors.New(gotype.ErrUserExists)
		}

		return errors.New(gotype.ErrInternal)
	}

	if err = s.CreateStats(tx, id); err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit(); err != nil {
		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AuthPostgres) CreateUser(user user.User) (int, int, string, error) {
	var id int
	var access int
	var rToken string

	tx, err := s.db.Begin()

	if err != nil {
		return -1, -1, "", errors.New(gotype.ErrInternal)
	}

	query := fmt.Sprintf("INSERT INTO %s (name, password_hash, refresh_token, expires_at) VALUES ($1, $2, $3, $4) RETURNING id, access, refresh_token", usersTable)
	row := tx.QueryRow(query, user.Name, user.Password, user.RefreshToken, user.ExpiresAt)

	if err := row.Scan(&id, &access, &rToken); err != nil {
		tx.Rollback()
		if strings.HasPrefix(err.Error(), "pq: duplicate key value violates unique constraint") {
			return -1, -1, "", errors.New(gotype.ErrUserExists)
		}

		return -1, -1, "", errors.New(gotype.ErrInternal)
	}

	if err := s.CreateStats(tx, id); err != nil {
		tx.Rollback()
		return -1, -1, "", err
	}

	if err := tx.Commit(); err != nil {
		return -1, -1, "", errors.New(gotype.ErrInternal)
	}

	return id, access, rToken, nil
}

func (s *AuthPostgres) GetUser(username, password string) (user.User, error) {
	var retUser user.User
	query := fmt.Sprintf("SELECT id, access FROM %s WHERE name = $1 AND password_hash = $2", usersTable)

	err := s.db.Get(&retUser, query, username, password)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return user.User{}, errors.New(gotype.ErrUserNotFound)
		}

		return user.User{}, errors.New(gotype.ErrInternal)
	}

	return retUser, nil
}

func (s *AuthPostgres) GetUserById(id int) (user.User, error) {
	var retUser user.User
	query := fmt.Sprintf("SELECT id, access, refresh_token, expires_at FROM %s WHERE id = $1", usersTable)

	err := s.db.Get(&retUser, query, id)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return user.User{}, errors.New(gotype.ErrUserNotFound)
		}

		return user.User{}, errors.New(gotype.ErrInternal)
	}

	return retUser, nil
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

func (s *AuthPostgres) CreateStats(tx *sql.Tx, userId int) error {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (user_id) VALUES ($1) RETURNING user_id", statsTable)
	row := tx.QueryRow(query, userId)

	if err := row.Scan(&id); err != nil {
		return errors.New(gotype.ErrInternal)
	}

	return nil
}
