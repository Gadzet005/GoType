package repository

import (
	"database/sql"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cast"
	"time"
)

type AdminPostgres struct {
	db     *sqlx.DB
	client *redis.Client
}

func NewAdminPostgres(db *sqlx.DB, client *redis.Client) *AdminPostgres {
	return &AdminPostgres{db: db, client: client}
}

func (s *AdminPostgres) GetUserAccess(id int) (int, error) {
	var retAccess int
	query := fmt.Sprintf("SELECT access FROM %s WHERE id = $1", usersTable)

	row := s.db.QueryRow(query, id)
	if err := row.Scan(&retAccess); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return -1, errors.New(gotype.ErrUserNotFound)
		}

		return -1, errors.New(gotype.ErrInternal)
	}

	return retAccess, nil
}

func (s *AdminPostgres) BanUser(userId int, expirationTime time.Time, reason string) error {
	var retId int
	query := fmt.Sprintf("UPDATE %s SET ban_expiration = $1, ban_reason = $2 WHERE id = $3 RETURNING id", usersTable)

	row := s.db.QueryRow(query, expirationTime, reason, userId)
	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrUserNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) UnbanUser(userId int) error {
	var retId int

	newTime := time.Now().UTC()
	newReason := "no ban"

	query := fmt.Sprintf("UPDATE %s SET ban_expiration = $1, ban_reason = $2 WHERE id = $3 RETURNING id", usersTable)

	row := s.db.QueryRow(query, newTime, newReason, userId)
	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrUserNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) BanLevel(levelId int) error {
	var retId int
	query := fmt.Sprintf("UPDATE %s SET is_banned = $1 WHERE id = $2 RETURNING id", levelTable)

	row := s.db.QueryRow(query, true, levelId)
	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrEntityNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) UnbanLevel(levelId int) error {
	var retId int

	query := fmt.Sprintf("UPDATE %s SET is_banned = $1 WHERE id = $2 RETURNING id", levelTable)

	row := s.db.QueryRow(query, false, levelId)
	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrEntityNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) ChangeUserAccess(userId int, newAccess int) error {
	var retId int
	query := fmt.Sprintf("UPDATE %s SET access = $1 WHERE id = $3 RETURNING id", usersTable)

	row := s.db.QueryRow(query, newAccess, userId)
	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrUserNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) GetUserComplaints(moderatorId int) ([]entities.UserComplaint, error) {
	var ret []entities.UserComplaint
	query := fmt.Sprintf("WITH raw AS (SELECT * FROM %s WHERE given_to = -1 ORDER BY time LIMIT 10 - (SELECT count(*) FROM %s WHERE given_to = $1)) UPDATE %s SET given_to = $2 FROM raw where raw.id = %s.id;", userComplaintsTable, userComplaintsTable, userComplaintsTable, userComplaintsTable)

	row := s.db.QueryRow(query, moderatorId, moderatorId)
	if err := row.Scan(&ret); err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New(gotype.ErrInternal)
		}
	}

	query = fmt.Sprintf("SELECT * FROM %s WHERE given_to = %s", userComplaintsTable, cast.ToString(moderatorId))
	if err := s.db.Select(&ret, query); err != nil {
		logrus.Printf(err.Error())
		return nil, errors.New(gotype.ErrInternal)
	}

	return ret, nil
}

func (s *AdminPostgres) GetLevelComplaints(moderatorId int) ([]entities.LevelComplaint, error) {
	var ret []entities.LevelComplaint
	query := fmt.Sprintf("WITH raw AS (SELECT * FROM %s WHERE given_to = -1 ORDER BY time LIMIT 10 - (SELECT count(*) FROM %s WHERE given_to = $1)) UPDATE %s SET given_to = $2 FROM raw where raw.id = %s.id;", levelComplaintsTable, levelComplaintsTable, levelComplaintsTable, levelComplaintsTable)

	row := s.db.QueryRow(query, moderatorId, moderatorId)
	if err := row.Err(); err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New(gotype.ErrInternal)
		}
	}

	query = fmt.Sprintf("SELECT * FROM %s WHERE given_to = %s", levelComplaintsTable, cast.ToString(moderatorId))
	if err := s.db.Select(&ret, query); err != nil {
		logrus.Printf(err.Error())
		return nil, errors.New(gotype.ErrInternal)
	}

	return ret, nil
}

func (s *AdminPostgres) DeleteUserComplaint(moderatorId int, complaintId int) error {
	var retId int

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 and given_to = $2 RETURNING id", userComplaintsTable)

	row := s.db.QueryRow(query, complaintId, moderatorId)

	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrEntityNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) DeleteLevelComplaint(moderatorId int, complaintId int) error {
	var retId int

	query := fmt.Sprintf("DELETE FROM %s WHERE id = $1 and given_to = $2 RETURNING id", levelComplaintsTable)

	row := s.db.QueryRow(query, complaintId, moderatorId)

	if err := row.Scan(&retId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrEntityNotFound)
		}

		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *AdminPostgres) GetUsers(params entities.UserSearchParams) ([]entities.UserInfo, error) {
	var users []entities.UserInfo

	extensionQuery := fmt.Sprintf("CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;")
	row := s.db.QueryRow(extensionQuery)

	if err := row.Err(); err != nil {
		return nil, errors.New(gotype.ErrInternal)
	}
	//TODO: injection
	query := fmt.Sprintf("SELECT id, name, access, ban_reason FROM %s ", usersTable)

	if *params.IsBanned {
		query += fmt.Sprintf("WHERE ban_expiration > NOW() + INTERVAL '1 second' ")
	}

	query += fmt.Sprintf("ORDER BY levenshtein(name, %s) LIMIT %s OFFSET %s", "'"+params.Name+"'", cast.ToString(params.PageSize), cast.ToString(params.PageSize*(params.Offset-1)))
	logrus.Printf(query)
	if err := s.db.Select(&users, query); err != nil {
		logrus.Printf(err.Error())
		return nil, errors.New(gotype.ErrInternal)
	}
	logrus.Printf(cast.ToString(len(users)))
	return users, nil
}
