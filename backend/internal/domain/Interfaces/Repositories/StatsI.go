package Repositories

import statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"

type Stats interface {
	GetUserStats(id int) (statistics.PlayerStats, error)
	GetUsersTop(params map[string]interface{}) ([]statistics.PlayerStats, error)
}
