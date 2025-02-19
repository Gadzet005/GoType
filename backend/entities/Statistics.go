package entities

import "github.com/lib/pq"

var AvailableClasses = []rune{'S', 'A', 'B', 'C', 'D'}

func GetClassIndexByAccuracy(accuracy float64) int {
	if accuracy > 0.95 {
		return 0
	} else if accuracy > 0.9 {
		return 1
	} else if accuracy > 0.8 {
		return 2
	} else if accuracy > 0.7 {
		return 3
	} else {
		return 4
	}
}

type LevelCompleteJSON struct {
	LevelId  int   `json:"level_id" binding:"required" db:"level_id"`
	PlayerId int   `json:"player_id" binding:"required" db:"player_id"`
	Time     int64 `json:"-" db:"time"`
	//NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	NumPressErrByChar map[string][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	Accuracy          float64           `json:"-" db:"accuracy"`
	AverageVelocity   float32           `json:"average_velocity" db:"average_velocity" binding:"required"`
	MaxCombo          int               `json:"max_combo" db:"max_combo" binding:"required"`
	Placement         int               `json:"placement" db:"placement" binding:"required"`
	Points            int               `json:"points" db:"points" binding:"required"`
}

type LevelComplete struct {
	LevelId  int   `json:"level_id" binding:"required" db:"level_id"`
	PlayerId int   `json:"player_id" binding:"required" db:"player_id"`
	Time     int64 `json:"-" db:"time"`
	//NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	Accuracy          float64         `json:"-" db:"accuracy"`
	AverageVelocity   float32         `json:"average_velocity" db:"average_velocity" binding:"required"`
	MaxCombo          int             `json:"max_combo" db:"max_combo" binding:"required"`
	Placement         int             `json:"placement" db:"placement" binding:"required"`
	Points            int             `json:"points" db:"points" binding:"required"`
}

type UserLevelCompletionInfo struct {
	LevelId           int             `json:"level_id" binding:"required" db:"level_id"`
	PlayerId          int             `json:"player_id" binding:"required" db:"player_id"`
	PlayerName        string          `json:"player_name" binding:"required" db:"player_name"`
	Time              int64           `json:"-" binding:"required" db:"time"`
	NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	Accuracy          float64         `json:"accuracy" db:"accuracy"`
	AverageVelocity   float32         `json:"average_velocity" db:"average_velocity" binding:"required"`
	MaxCombo          int             `json:"max_combo" db:"max_combo" binding:"required"`
	Placement         int             `json:"placement" db:"placement" binding:"required"`
	Points            int             `json:"points" db:"points" binding:"required"`
}

type LevelStats struct {
	NumPlayed              int     `json:"num_played" db:"num_played"`
	AverageAccuracy        float32 `json:"average_acc" db:"average_acc"`
	MaxCombo               int     `json:"max_combo" db:"max_combo"`
	MaxPoints              int     `json:"max_points" db:"max_points"`
	AveragePoints          int     `json:"average_points" db:"average_points"`
	AverageAverageVelocity int     `json:"average_average_velocity" db:"average_average_velocity"`
	MaxAverageVelocity     int     `json:"max_average_velocity" db:"max_average_velocity"`
}

type PlayerStats struct {
	UserId   int    `json:"user_id" db:"user_id"`     //
	UserName string `json:"user_name" db:"user_name"` //
	//NumPressErrByCharByLang map[string]interface{} `json:"num_press_err_by_char_by_lang" db:"num_press_err_by_char_by_lang" binding:"required"`
	NumPressErrByCharByLang map[string]map[rune][2]int `json:"num_press_err_by_char_by_lang" db:"num_press_err_by_char_by_lang" binding:"required"`
	NumLevelRelax           int                        `json:"num_level_relax" db:"num_level_relax"`                   //
	NumLevelClassic         int                        `json:"num_level_classic" db:"num_level_classic"`               //
	NumGamesMult            int                        `json:"num_games_mult" db:"num_games_mult"`                     //
	NumCharsClassic         int                        `json:"num_chars_classic" db:"num_chars_classic"`               //
	NumCharsRelax           int                        `json:"num_chars_relax" db:"num_chars_relax"`                   //
	AverageAccuracyClassic  float64                    `json:"average_accuracy_classic" db:"average_accuracy_classic"` //
	AverageAccuracyRelax    float64                    `json:"average_accuracy_relax" db:"average_accuracy_relax"`     //
	WinPercentage           float64                    `json:"win_percentage" db:"win_percentage"`                     //
	AverageDelay            float64                    `json:"average_delay" db:"average_delay"`                       //
	NumClassesClassic       [5]int32                   `json:"num_classes_classic" db:"num_classes_classic"`
	SumPoints               int                        `json:"sum_points" db:"sum_points"` //
}

type PlayerStatsDB struct {
	UserId                  int           `json:"user_id" db:"user_id"`
	UserName                string        `json:"user_name" db:"user_name"`
	NumPressErrByCharByLang []byte        `json:"num_press_err_by_char_by_lang" db:"num_press_err_by_char_by_lang" binding:"required"`
	NumLevelRelax           int           `json:"num_level_relax" db:"num_level_relax"`
	NumLevelClassic         int           `json:"num_level_classic" db:"num_level_classic"`
	NumGamesMult            int           `json:"num_games_mult" db:"num_games_mult"`
	NumCharsClassic         int           `json:"num_chars_classic" db:"num_chars_classic"`
	NumCharsRelax           int           `json:"num_chars_relax" db:"num_chars_relax"`
	AverageAccuracyClassic  float64       `json:"average_accuracy_classic" db:"average_accuracy_classic"`
	AverageAccuracyRelax    float64       `json:"average_accuracy_relax" db:"average_accuracy_relax"`
	WinPercentage           float64       `json:"win_percentage" db:"win_percentage"`
	AverageDelay            float64       `json:"average_delay" db:"average_delay"`
	NumClassesClassic       pq.Int32Array `json:"num_classes_classic" db:"num_classes_classic"`
	SumPoints               int           `json:"sum_points" db:"sum_points"`
}

type CategoryParams struct {
	Category rune   `json:"category"`
	Pattern  string `json:"pattern"`
}

type CategoryParamsJSON struct {
	Category string `json:"category"`
	Pattern  string `json:"pattern"`
}

type StatSortFilterParams struct {
	Points         string         `json:"points" binding:"omitempty"`
	CategoryParams CategoryParams `json:"category_params" binding:"omitempty"`
	PageInfo       PageInfo       `json:"page_info" binding:"required"`
}

type StatSortFilterParamsJSON struct {
	Points         string             `json:"points" binding:"omitempty"`
	CategoryParams CategoryParamsJSON `json:"category_params" binding:"omitempty"`
	PageInfo       PageInfo           `json:"page_info" binding:"required"`
}

type GetUserStatsRes struct {
	Res PlayerStats `json:"user_stats"`
}

type GetUsersTop struct {
	Res []PlayerStats `json:"users"`
}
