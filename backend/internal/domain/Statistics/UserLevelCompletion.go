package domain

import "time"

type UserLevelCompletionInfo struct {
	LevelId           int             `json:"level_id" binding:"required" db:"level_id" example:"1"`
	PlayerId          int             `json:"player_id" binding:"required" db:"player_id" example:"1"`
	PlayerName        string          `json:"player_name" binding:"required" db:"player_name" example:"Player"`
	Time              time.Time       `json:"-" binding:"required" db:"time"`
	NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-" example:"{\"A\":[10,4],\"B\":[30,23]}"`
	Accuracy          float64         `json:"accuracy" db:"accuracy" example:"0.4"`
	AverageVelocity   float32         `json:"average_velocity" db:"average_velocity" binding:"required" example:"0.5"`
	MaxCombo          int             `json:"max_combo" db:"max_combo" binding:"required" example:"100"`
	Placement         int             `json:"placement" db:"placement" binding:"required" example:"1"`
	Points            int             `json:"points" db:"points" binding:"required" example:"1000"`
}
