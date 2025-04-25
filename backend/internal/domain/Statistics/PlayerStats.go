package domain

import (
	"database/sql"
	"github.com/lib/pq"
)

type PlayerStats struct {
	UserId                  int                        `json:"user_id" db:"user_id"`
	UserName                string                     `json:"user_name" db:"user_name"`
	AvatarPath              sql.NullString             `json:"avatar_path" db:"avatar_path" swaggerignore:"true"`
	NumPressErrByCharByLang map[string]map[rune][2]int `json:"num_press_err_by_char_by_lang" db:"num_press_err_by_char_by_lang" binding:"required"`
	NumLevelRelax           int                        `json:"num_level_relax" db:"num_level_relax"`
	NumLevelClassic         int                        `json:"num_level_classic" db:"num_level_classic"`
	NumGamesMult            int                        `json:"num_games_mult" db:"num_games_mult"`
	NumCharsClassic         int                        `json:"num_chars_classic" db:"num_chars_classic"`
	NumCharsRelax           int                        `json:"num_chars_relax" db:"num_chars_relax"`
	AverageAccuracyClassic  float64                    `json:"average_accuracy_classic" db:"average_accuracy_classic"`
	AverageAccuracyRelax    float64                    `json:"average_accuracy_relax" db:"average_accuracy_relax"`
	WinPercentage           float64                    `json:"win_percentage" db:"win_percentage"`
	AverageDelay            float64                    `json:"average_delay" db:"average_delay"`
	NumClassesClassic       [5]int32                   `json:"num_classes_classic" db:"num_classes_classic"`
	SumPoints               int                        `json:"sum_points" db:"sum_points"`
}

type PlayerStatsDB struct {
	UserId                  int            `json:"user_id" db:"user_id"`
	UserName                string         `json:"user_name" db:"user_name"`
	AvatarPath              sql.NullString `json:"avatar_path" db:"avatar_path"`
	NumPressErrByCharByLang []byte         `json:"num_press_err_by_char_by_lang" db:"num_press_err_by_char_by_lang" binding:"required"`
	NumLevelRelax           int            `json:"num_level_relax" db:"num_level_relax"`
	NumLevelClassic         int            `json:"num_level_classic" db:"num_level_classic"`
	NumGamesMult            int            `json:"num_games_mult" db:"num_games_mult"`
	NumCharsClassic         int            `json:"num_chars_classic" db:"num_chars_classic"`
	NumCharsRelax           int            `json:"num_chars_relax" db:"num_chars_relax"`
	AverageAccuracyClassic  float64        `json:"average_accuracy_classic" db:"average_accuracy_classic"`
	AverageAccuracyRelax    float64        `json:"average_accuracy_relax" db:"average_accuracy_relax"`
	WinPercentage           float64        `json:"win_percentage" db:"win_percentage"`
	AverageDelay            float64        `json:"average_delay" db:"average_delay"`
	NumClassesClassic       pq.Int32Array  `json:"num_classes_classic" db:"num_classes_classic"`
	SumPoints               int            `json:"sum_points" db:"sum_points"`
	Nc                      int            `json:"-" db:"nc"`
}
