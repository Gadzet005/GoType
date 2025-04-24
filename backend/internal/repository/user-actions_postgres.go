package repository

import (
	"database/sql"
	"errors"
	"fmt"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
	"time"
)

type UserActionsPostgres struct {
	db *sqlx.DB
}

func NewUserActionsPostgres(db *sqlx.DB) *UserActionsPostgres {
	return &UserActionsPostgres{db: db}
}

func (s *UserActionsPostgres) DropRefreshToken(id int, newTime time.Time) (int, error) {
	var retId int

	query := fmt.Sprintf("UPDATE %s SET expires_at = $1 WHERE id = $2 RETURNING id", usersTable)

	row := s.db.QueryRow(query, newTime, id)
	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return -1, errors.New(gotype.ErrUserNotFound)
		}

		return -1, errors.New(gotype.ErrInternal)
	}

	return retId, nil
}

func (s *UserActionsPostgres) GetUserById(id int) (string, int, time.Time, string, sql.NullString, error) {
	var name, banReason string
	var avatarPath sql.NullString
	var banTime time.Time
	var access int

	query := fmt.Sprintf("SELECT name, access, ban_expiration, ban_reason, avatar_path FROM %s WHERE id = $1", usersTable)

	row := s.db.QueryRow(query, id)

	if err := row.Scan(&name, &access, &banTime, &banReason, &avatarPath); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", -1, banTime, banReason, sql.NullString{String: ""}, errors.New(gotype.ErrUserNotFound)
		}

		return "", -1, time.Now(), "", sql.NullString{String: ""}, errors.New(gotype.ErrInternal)
	}

	return name, access, banTime, banReason, avatarPath, nil
}

func (s *UserActionsPostgres) CreateUserComplaint(complaint complaints.UserComplaint) error {
	var id int

	query := fmt.Sprintf("INSERT INTO %s (user_id, author, time, given_to, reason, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", userComplaintsTable)

	row := s.db.QueryRow(query, complaint.UserId, complaint.AuthorId, complaint.CreationTime, complaint.AssignedTo, complaint.Reason, complaint.Message)

	if err := row.Scan(&id); err != nil {
		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *UserActionsPostgres) CreateLevelComplaint(complaint complaints.LevelComplaint) error {
	var id int

	query := fmt.Sprintf("INSERT INTO %s (level_id, author, time, given_to, reason, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", levelComplaintsTable)

	row := s.db.QueryRow(query, complaint.LevelId, complaint.AuthorId, complaint.CreationTime, complaint.AssignedTo, complaint.Reason, complaint.Message)

	if err := row.Scan(&id); err != nil {
		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *UserActionsPostgres) UpdateAvatarPath(id int, newPath string) (string, error) {
	var curId int
	var avatarPath string
	var preStr sql.NullString

	tx, err := s.db.Beginx()

	if err != nil {
		return "", errors.New(gotype.ErrInternal)
	}

	q := fmt.Sprintf("SELECT avatar_path FROM %s WHERE id = $1;", usersTable)

	row := tx.QueryRow(q, id)
	if err := row.Scan(&preStr); err != nil {
		_ = tx.Rollback()

		if errors.Is(err, sql.ErrNoRows) {
			return "", errors.New(gotype.ErrUserNotFound)
		}
		logrus.Errorf("Error getting avatar path: %s", err.Error())
		return "", errors.New(gotype.ErrInternal)
	}

	if preStr.Valid {
		avatarPath = preStr.String
	} else {
		avatarPath = ""
	}

	query := fmt.Sprintf("UPDATE %s SET avatar_path = $1 WHERE id = $2 RETURNING id", usersTable)

	row = tx.QueryRow(query, newPath, id)

	if err := row.Scan(&curId); err != nil {
		_ = tx.Rollback()

		if errors.Is(err, sql.ErrNoRows) {
			return "", errors.New(gotype.ErrUserNotFound)
		}

		return "", errors.New(gotype.ErrInternal)
	}

	err = tx.Commit()

	if err != nil {
		_ = tx.Rollback()
		return "", errors.New(gotype.ErrInternal)
	}

	return avatarPath, nil
}
