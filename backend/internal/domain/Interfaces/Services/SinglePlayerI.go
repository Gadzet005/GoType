package Services

import statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"

type SinglePlayer interface {
	SendResults(senderID int, lc statistics.LevelComplete) error
}
