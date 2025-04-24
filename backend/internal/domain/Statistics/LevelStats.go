package domain

type LevelStats struct {
	NumPlayed              int     `json:"num_played" db:"num_played"`
	AverageAccuracy        float32 `json:"average_acc" db:"average_acc"`
	MaxCombo               int     `json:"max_combo" db:"max_combo"`
	MaxPoints              int     `json:"max_points" db:"max_points"`
	AveragePoints          float64 `json:"average_points" db:"average_points"`
	AverageAverageVelocity float64 `json:"average_average_velocity" db:"average_average_velocity"`
	MaxAverageVelocity     float64 `json:"max_average_velocity" db:"max_average_velocity"`
}
