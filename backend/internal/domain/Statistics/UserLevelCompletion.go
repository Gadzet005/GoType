package domain

import "time"

type UserLevelCompletionInfo struct {
	LevelId           int             `json:"level_id" binding:"required" db:"level_id"`
	PlayerId          int             `json:"player_id" binding:"required" db:"player_id"`
	PlayerName        string          `json:"player_name" binding:"required" db:"player_name"`
	Time              time.Time       `json:"-" binding:"required" db:"time"`
	NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	Accuracy          float64         `json:"accuracy" db:"accuracy"`
	AverageVelocity   float32         `json:"average_velocity" db:"average_velocity" binding:"required"`
	MaxCombo          int             `json:"max_combo" db:"max_combo" binding:"required"`
	Placement         int             `json:"placement" db:"placement" binding:"required"`
	Points            int             `json:"points" db:"points" binding:"required"`
}
