package domain

type LevelStats struct {
	NumPlayed              int     `json:"num_played" db:"num_played"`
	AverageAccuracy        float32 `json:"average_acc" db:"average_acc"`
	MaxCombo               int     `json:"max_combo" db:"max_combo"`
	MaxPoints              int     `json:"max_points" db:"max_points"`
	AveragePoints          int     `json:"average_points" db:"average_points"`
	AverageAverageVelocity int     `json:"average_average_velocity" db:"average_average_velocity"`
	MaxAverageVelocity     int     `json:"max_average_velocity" db:"max_average_velocity"`
}
