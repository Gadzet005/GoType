package repository

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cast"
	"sort"
	"time"
)

const (
	ratingTTl = time.Minute * 2
)

type StatsPostgres struct {
	db     *sqlx.DB
	client *redis.Client
}

func NewStatsPostgres(db *sqlx.DB, client *redis.Client) *StatsPostgres {
	return &StatsPostgres{db, client}
}

func (sp *StatsPostgres) GetUserStats(id int) (statistics.PlayerStats, error) {
	var statsDB statistics.PlayerStatsDB

	var query = fmt.Sprintf("SELECT u.avatar_path, user_id,num_press_err_by_char_by_lang,num_level_relax,num_level_classic,num_games_mult,num_chars_classic,num_chars_relax,average_accuracy_classic,average_accuracy_relax,win_percentage,average_delay,num_classes_classic,sum_points,name as user_name FROM (SELECT *  FROM %s  WHERE user_id = $1) AS s JOIN (SELECT id, name, avatar_path  FROM %s WHERE id = $2) AS u ON s.user_id = u.id;", statsTable, usersTable)

	if err := sp.db.Get(&statsDB, query, id, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return statistics.PlayerStats{}, errors.New(gotype.ErrUserNotFound)
		}
		logrus.Printf(err.Error())
		return statistics.PlayerStats{}, errors.New(gotype.ErrInternal)
	}

	stats, err := sp.castToJSON(statsDB)

	if err != nil {
		return statistics.PlayerStats{}, errors.New(gotype.ErrInternal)
	}

	return stats, nil
}

func (sp *StatsPostgres) GetUsersTop(params map[string]interface{}) ([]statistics.PlayerStats, error) {
	//Reading from cache
	cached, err := sp.GetUserTopFromCache(params)

	if err == nil {
		return cached, nil
	}

	//if did not find value in cache, going to postgres
	var stats []statistics.PlayerStatsDB
	var ret []statistics.PlayerStats

	var query = fmt.Sprintf("%s ORDER BY ", statsTable)

	if params["sort_param"] == "sum_points" {
		query += fmt.Sprintf("sum_points %s", params["sort_order"])
	} else {
		query += fmt.Sprintf("num_classes_classic[%s]", params["sort_index"])
	}

	var limit = cast.ToString(params["page_size"])
	var offset = cast.ToString(params["page_size"].(int) * (params["page_num"].(int) - 1))
	query += fmt.Sprintf(" LIMIT %s OFFSET %s", limit, offset)

	var wholeQuery = fmt.Sprintf("SELECT s.user_id, u.avatar_path, s.num_press_err_by_char_by_lang, s.num_level_relax, s.num_level_classic, s.num_games_mult, s.num_chars_classic, s.num_chars_relax, s.average_accuracy_classic, s.average_accuracy_relax, s.win_percentage, s.average_delay, s.num_classes_classic, s.sum_points, u.name as user_name FROM (SELECT user_id,num_press_err_by_char_by_lang,num_level_relax,num_level_classic,num_games_mult,num_chars_classic,num_chars_relax,average_accuracy_classic,average_accuracy_relax,win_percentage,average_delay,num_classes_classic,sum_points FROM %s) AS s JOIN %s AS u ON s.user_id = u.id", query, usersTable)

	if err := sp.db.Select(&stats, wholeQuery); err != nil {
		logrus.Printf(err.Error())
		return nil, errors.New(gotype.ErrInternal)
	}

	for _, stat := range stats {
		newStats, err := sp.castToJSON(stat)

		if err != nil {
			return nil, errors.New(gotype.ErrInternal)
		}

		ret = append(ret, newStats)
	}

	_ = sp.SaveUserTopInCache(params, ret)

	return ret, nil
}

func (sp *StatsPostgres) GetUserTopFromCache(params map[string]interface{}) ([]statistics.PlayerStats, error) {
	key, err := MarshalDeterministic(params)
	if err != nil {
		return []statistics.PlayerStats{}, errors.New(gotype.ErrInternal)
	}

	val, err := sp.client.Get(context.Background(), key).Result()

	if err != nil {
		return []statistics.PlayerStats{}, errors.New(gotype.ErrInternal)
	} else {
		var ret []statistics.PlayerStats
		err := json.Unmarshal([]byte(val), &ret)
		if err != nil {
			return []statistics.PlayerStats{}, errors.New(gotype.ErrInternal)
		} else {
			logrus.Printf("GetFromCache: {%s, %s}", key, val)
			return ret, nil
		}
	}

}

func (sp *StatsPostgres) SaveUserTopInCache(params map[string]interface{}, result []statistics.PlayerStats) error {
	key, err := MarshalDeterministic(params)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	val, err := json.Marshal(result)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	res := sp.client.Set(context.Background(), key, val, ratingTTl)
	logrus.Printf("Saving %s to cache. Error: %v", key, res.Err())

	return nil
}

func (sp *StatsPostgres) castToJSON(statsDB statistics.PlayerStatsDB) (statistics.PlayerStats, error) {
	var numPressErrByCharByLang map[string]map[rune][2]int
	err := json.Unmarshal(statsDB.NumPressErrByCharByLang, &numPressErrByCharByLang)
	if err != nil {
		fmt.Printf("Error unmarshalling num_press_err_by_char_by_lang: %v\n", err)
		return statistics.PlayerStats{}, err
	}

	stats := statistics.PlayerStats{
		UserId:                  statsDB.UserId,
		UserName:                statsDB.UserName,
		AvatarPath:              statsDB.AvatarPath,
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

func MarshalDeterministic(m map[string]interface{}) (string, error) {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	buf := &bytes.Buffer{}
	buf.WriteString("{")
	for i, k := range keys {
		valBytes, err1 := json.Marshal(m[k])

		if err1 != nil {
			return "", err1
		}

		keyBytes, err2 := json.Marshal(k)

		if err2 != nil {
			return "", err2
		}

		if i > 0 {
			buf.WriteString(",")
		}
		buf.Write(keyBytes)
		buf.WriteString(":")
		buf.Write(valBytes)
	}
	buf.WriteString("}")
	return buf.String(), nil
}
