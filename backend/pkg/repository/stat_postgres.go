package repository

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cast"
)

type StatsPostgres struct {
	db *sqlx.DB
}

func NewStatsPostgres(db *sqlx.DB) *StatsPostgres {
	return &StatsPostgres{db}
}

func (sp *StatsPostgres) GetUserStats(id int) (entities.PlayerStats, error) {
	var statsDB entities.PlayerStatsDB

	var query = fmt.Sprintf("SELECT user_id,num_press_err_by_char_by_lang,num_level_relax,num_level_classic,num_games_mult,num_chars_classic,num_chars_relax,average_accuracy_classic,average_accuracy_relax,win_percentage,average_delay,num_classes_classic,sum_points,name as user_name FROM (SELECT *  FROM %s  WHERE user_id = $1) AS s JOIN (SELECT id , name  FROM %s WHERE id = $2) AS u ON s.user_id = u.id;", statsTable, usersTable)

	if err := sp.db.Get(&statsDB, query, id, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return entities.PlayerStats{}, errors.New(gotype.ErrUserNotFound)
		}
		logrus.Printf(err.Error())
		return entities.PlayerStats{}, errors.New(gotype.ErrInternal)
	}

	stats, err := sp.castToJSON(statsDB)

	if err != nil {
		return entities.PlayerStats{}, errors.New(gotype.ErrInternal)
	}

	return stats, nil
}

func (sp *StatsPostgres) GetUsersTop(params map[string]interface{}) ([]entities.PlayerStats, error) {
	var stats []entities.PlayerStatsDB
	var ret []entities.PlayerStats

	var query = fmt.Sprintf("%s ORDER BY ", statsTable)

	if params["sort_param"] == "sum_points" {
		query += fmt.Sprintf("sum_points %s", params["sort_order"])
	} else {
		query += fmt.Sprintf("num_classes_classic[%s]", params["sort_index"])
	}

	var limit = cast.ToString(params["page_size"])
	var offset = cast.ToString(params["page_size"].(int) * (params["page_num"].(int) - 1))
	query += fmt.Sprintf(" LIMIT %s OFFSET %s", limit, offset)

	var wholeQuery = fmt.Sprintf("SELECT s.user_id, s.num_press_err_by_char_by_lang, s.num_level_relax, s.num_level_classic, s.num_games_mult, s.num_chars_classic, s.num_chars_relax, s.average_accuracy_classic, s.average_accuracy_relax, s.win_percentage, s.average_delay, s.num_classes_classic, s.sum_points, u.name as user_name FROM (SELECT user_id,num_press_err_by_char_by_lang,num_level_relax,num_level_classic,num_games_mult,num_chars_classic,num_chars_relax,average_accuracy_classic,average_accuracy_relax,win_percentage,average_delay,num_classes_classic,sum_points FROM %s) AS s JOIN %s AS u ON s.user_id = u.id", query, usersTable)

	if err := sp.db.Select(&stats, wholeQuery); err != nil {
		logrus.Printf(err.Error())
		return nil, errors.New(gotype.ErrInternal)
	}

	logrus.Println(wholeQuery)

	for _, stat := range stats {
		newStats, err := sp.castToJSON(stat)

		if err != nil {
			return nil, errors.New(gotype.ErrInternal)
		}

		ret = append(ret, newStats)
	}

	return ret, nil
}

func (sp *StatsPostgres) castToJSON(statsDB entities.PlayerStatsDB) (entities.PlayerStats, error) {
	var numPressErrByCharByLang map[string]map[rune][2]int
	//var numPressErrByCharByLang map[string]interface{}
	err := json.Unmarshal(statsDB.NumPressErrByCharByLang, &numPressErrByCharByLang)
	if err != nil {
		fmt.Printf("Error unmarshalling num_press_err_by_char_by_lang: %v\n", err)
		return entities.PlayerStats{}, err
	}

	stats := entities.PlayerStats{
		UserId:                  statsDB.UserId,
		UserName:                statsDB.UserName,
		NumPressErrByCharByLang: numPressErrByCharByLang,
		NumLevelRelax:           statsDB.NumLevelRelax,
		NumLevelClassic:         statsDB.NumLevelClassic,
		NumGamesMult:            statsDB.NumGamesMult,
		NumCharsClassic:         statsDB.NumCharsClassic,
		NumCharsRelax:           statsDB.NumCharsRelax,
		AverageAccuracyClassic:  statsDB.AverageAccuracyClassic,
		AverageAccuracyRelax:    statsDB.AverageAccuracyRelax,
		WinPercentage:           statsDB.WinPercentage,
		AverageDelay:            statsDB.AverageDelay,
		NumClassesClassic:       [5]int32{1, 1, 1, 1, 1},
		SumPoints:               statsDB.SumPoints,
	}

	copy(stats.NumClassesClassic[:], statsDB.NumClassesClassic)

	return stats, nil
}
