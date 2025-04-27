package domain

type LevelCompleteJSON struct {
	LevelId           int               `json:"level_id" binding:"required" db:"level_id"`
	PlayerId          int               `json:"player_id" binding:"required" db:"player_id"`
	Time              int64             `json:"time" db:"time"`
	NumPressErrByChar map[string][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	Accuracy          float64           `json:"accuracy" db:"accuracy" example:"0.4"`
	AverageVelocity   float32           `json:"average_velocity" db:"average_velocity" binding:"required" example:"0.01"`
	MaxCombo          int               `json:"max_combo" db:"max_combo" binding:"required" example:"180"`
	Placement         int               `json:"placement" db:"placement" binding:"required" example:"1"`
	Points            int               `json:"points" db:"points" binding:"required" example:"10000"`
}

type LevelComplete struct {
	LevelId           int             `json:"level_id" binding:"required" db:"level_id"`
	PlayerId          int             `json:"player_id" binding:"required" db:"player_id"`
	Time              int64           `json:"-" db:"time"`
	NumPressErrByChar map[rune][2]int `json:"num_press_err_by_char" binding:"required" db:"-"`
	Accuracy          float64         `json:"-" db:"accuracy" example:"0.4"`
	AverageVelocity   float32         `json:"average_velocity" db:"average_velocity" binding:"required" example:"0.01"`
	MaxCombo          int             `json:"max_combo" db:"max_combo" binding:"required" example:"180"`
	Placement         int             `json:"placement" db:"placement" binding:"required" example:"1"`
	Points            int             `json:"points" db:"points" binding:"required" example:"10000"`
}
