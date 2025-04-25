package Repositories

import (
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
)

type Level interface {
	CreateLevel(level level.Level) (string, string, int, error)
	DeleteLevel(levelId int) error
	UpdateLevel(levelInfo level.LevelUpdateStruct) (string, string, int, error)
	GetLevelById(levelId int) (level.Level, error)
	FetchLevels(map[string]interface{}) ([]level.Level, error)
	GetPathsById(levelId int) (int, string, string, error)
	GetLevelStats(levelId int) (statistics.LevelStats, error)
	GetLevelUserTop(levelId int) ([]statistics.UserLevelCompletionInfo, error)
}
