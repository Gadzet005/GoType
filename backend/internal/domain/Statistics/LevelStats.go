package domain

type LevelStats struct {
	NumPlayed              int     `json:"num_played" db:"num_played" example:"100"`
	AverageAccuracy        float32 `json:"average_acc" db:"average_acc" example:"0.5"`
	MaxCombo               int     `json:"max_combo" db:"max_combo" example:"100"`
	MaxPoints              int     `json:"max_points" db:"max_points" example:"10000"`
	AveragePoints          float64 `json:"average_points" db:"average_points" example:"109.5"`
	AverageAverageVelocity float64 `json:"average_average_velocity" db:"average_average_velocity" example:"19.5"`
	MaxAverageVelocity     float64 `json:"max_average_velocity" db:"max_average_velocity" example:"19.5"`
}
