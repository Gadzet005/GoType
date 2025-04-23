package repository

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cast"
	"log"
	"math"
)

type SinglePlayerGamePostgres struct {
	db *sqlx.DB
}

func NewSinglePlayerGamePostgres(db *sqlx.DB) *SinglePlayerGamePostgres {
	return &SinglePlayerGamePostgres{db: db}
}

// TODO: Тут возможно стоит разбить на две функции (get, set) и перенести бизнес-логику в сервисы.Но это будет громоздко
func (s *SinglePlayerGamePostgres) SendResults(lc statistics.LevelComplete, totalPush int, totalErr int) error {
	//TODO: ADD transaction

	query := "INSERT INTO LevelComplete (level_id, player_id, time, num_press_err_by_char, accuracy, average_velocity, max_combo, placement, points) VALUES (:level_id, :player_id, to_timestamp(:time), :num_press_err_by_char, :accuracy, :average_velocity, :max_combo, :placement, :points)"

	numPressErrJson, err := json.Marshal(lc.NumPressErrByChar)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	params := map[string]interface{}{
		"level_id":              lc.LevelId,
		"player_id":             lc.PlayerId,
		"time":                  lc.Time,
		"num_press_err_by_char": numPressErrJson,
		"accuracy":              lc.Accuracy,
		"average_velocity":      lc.AverageVelocity,
		"max_combo":             lc.MaxCombo,
		"placement":             lc.Placement,
		"points":                lc.Points,
	}

	_, err = s.db.NamedExec(query, params)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	//Get current stats
	var statsDB statistics.PlayerStatsDB

	query = fmt.Sprintf("SELECT user_id,num_press_err_by_char_by_lang,num_level_relax,num_level_classic,num_games_mult,num_chars_classic,num_chars_relax,average_accuracy_classic,average_accuracy_relax,win_percentage,average_delay,num_classes_classic,sum_points,name as user_name FROM (SELECT *  FROM %s  WHERE user_id = $1) AS s JOIN (SELECT id , name  FROM %s WHERE id = $2) AS u ON s.user_id = u.id;", statsTable, usersTable)

	if err := s.db.Get(&statsDB, query, lc.PlayerId, lc.PlayerId); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New(gotype.ErrUserNotFound)
		}
		logrus.Printf(err.Error())
		return errors.New(gotype.ErrInternal)
	}

	stats, err := s.castToJSON1(statsDB)

	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	levelInfo, err := s.getLevel(lc.LevelId)

	if err != nil {
		logrus.Printf("Error executing query get: %v", err)
		return errors.New(gotype.ErrInternal)
	}

	if levelInfo.Type == "classic" {
		stats.SumPoints += lc.Points
		var curTotalDelay = cast.ToFloat64(stats.AverageDelay)*cast.ToFloat64(stats.NumCharsClassic) + cast.ToFloat64(lc.Time)
		var curErr = cast.ToInt(math.Floor(stats.AverageAccuracyClassic*cast.ToFloat64(stats.NumCharsClassic))) + totalErr
		stats.NumCharsClassic += totalPush
		stats.AverageAccuracyClassic = 1.0 - (cast.ToFloat64(curErr) / cast.ToFloat64(stats.NumCharsClassic))
		stats.NumLevelClassic += 1
		stats.AverageDelay = cast.ToFloat64(curTotalDelay) / cast.ToFloat64(stats.NumCharsClassic)
		stats.NumClassesClassic[statistics.GetClassIndexByAccuracy(lc.Accuracy)] += 1
	} else if levelInfo.Type == "relax" {
		var curErr = cast.ToInt(math.Floor(stats.AverageAccuracyRelax*cast.ToFloat64(stats.NumCharsRelax))) + totalErr
		stats.NumCharsRelax += totalPush
		stats.AverageAccuracyRelax = 1.0 - (cast.ToFloat64(curErr) / cast.ToFloat64(stats.NumCharsRelax))
		stats.NumLevelRelax += 1
	}

	if stats.NumPressErrByCharByLang[levelInfo.Language] == nil {
		stats.NumPressErrByCharByLang[levelInfo.Language] = map[rune][2]int{}
	}

	for char, curStats := range lc.NumPressErrByChar {
		logrus.Printf(cast.ToString(char), curStats)
		var ret = stats.NumPressErrByCharByLang[levelInfo.Language][char]
		stats.NumPressErrByCharByLang[levelInfo.Language][char] = [2]int{ret[0] + curStats[0], ret[1] + curStats[1]}
	}

	query = "UPDATE UserStatistic SET num_press_err_by_char_by_lang = :num_press_err_by_char_by_lang, num_level_relax = :num_level_relax, num_level_classic = :num_level_classic, num_games_mult = :num_games_mult, num_chars_classic = :num_chars_classic, num_chars_relax = :num_chars_relax, average_accuracy_classic = :average_accuracy_classic, average_accuracy_relax = :average_accuracy_relax, win_percentage = :win_percentage, average_delay = :average_delay, num_classes_classic = :num_classes_classic, sum_points = :sum_points WHERE user_id = :user_id"

	numPressErrJson, err = json.Marshal(stats.NumPressErrByCharByLang)
	if err != nil {
		log.Fatalf("Error marshalling NumPressErrByCharByLang: %v", err)
	}

	numClassesClassic := pq.Array(stats.NumClassesClassic[:])

	params = map[string]interface{}{
		"user_id":                       stats.UserId,
		"num_press_err_by_char_by_lang": numPressErrJson,
		"num_level_relax":               stats.NumLevelRelax,
		"num_level_classic":             stats.NumLevelClassic,
		"num_games_mult":                stats.NumGamesMult,
		"num_chars_classic":             stats.NumCharsClassic,
		"num_chars_relax":               stats.NumCharsRelax,
		"average_accuracy_classic":      stats.AverageAccuracyClassic,
		"average_accuracy_relax":        stats.AverageAccuracyRelax,
		"win_percentage":                stats.WinPercentage,
		"average_delay":                 stats.AverageDelay,
		"num_classes_classic":           numClassesClassic,
		"sum_points":                    stats.SumPoints,
	}

	_, err = s.db.NamedExec(query, params)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (s *SinglePlayerGamePostgres) getLevel(levelID int) (level.Level, error) {
	var result level.Level

	query := fmt.Sprintf("SELECT id, name, author, description, duration, language, preview_type, type, difficulty, preview_path, author_name FROM %s WHERE id = $1 and is_banned = FALSE", levelTable)

	if err := s.db.Get(&result, query, levelID); err != nil {
		return level.Level{}, errors.New(gotype.ErrInternal)
	}

	return result, nil
}

func (s *SinglePlayerGamePostgres) castToJSON1(statsDB statistics.PlayerStatsDB) (statistics.PlayerStats, error) {
	var numPressErrByCharByLang map[string]map[rune][2]int
	err := json.Unmarshal(statsDB.NumPressErrByCharByLang, &numPressErrByCharByLang)
	if err != nil {
		return statistics.PlayerStats{}, err
	}

	stats := statistics.PlayerStats{
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
