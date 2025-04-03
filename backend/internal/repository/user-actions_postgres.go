package repository

import (
	"database/sql"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
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

func (s *UserActionsPostgres) GetUserById(id int) (string, int, time.Time, string, string, error) {
	var name, banReason, avatarPath string
	var banTime time.Time
	var access int

	query := fmt.Sprintf("SELECT name, access, ban_expiration, ban_reason, avatar_path FROM %s WHERE id = $1", usersTable)

	row := s.db.QueryRow(query, id)

	if err := row.Scan(&name, &access, &banTime, &banReason, &avatarPath); err != nil {
		logrus.Fatalf("Error getting user by id: %s", err.Error())
		if errors.Is(err, sql.ErrNoRows) {
			return "", -1, banTime, banReason, "", errors.New(gotype.ErrUserNotFound)
		}

		return "", -1, time.Now(), "", "", errors.New(gotype.ErrInternal)
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

	tx, err := s.db.Beginx()

	if err != nil {
		return "", errors.New(gotype.ErrInternal)
	}

	query := fmt.Sprintf("UPDATE %s SET avatar_path = $1 WHERE id = $2 RETURNING id, avatar_path", usersTable)

	row := tx.QueryRow(query, newPath, id)

	if err := row.Scan(&curId, &avatarPath); err != nil {
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
