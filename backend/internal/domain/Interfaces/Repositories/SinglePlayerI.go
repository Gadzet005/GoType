package Repositories

import statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"

type SinglePlayerGame interface {
	SendResults(lc statistics.LevelComplete, totalPush int, totalErr int) error
}
