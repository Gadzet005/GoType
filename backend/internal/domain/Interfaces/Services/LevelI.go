package Services

import (
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"mime/multipart"
)

type Level interface {
	CreateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error)
	UpdateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error)
	DeleteLevel(levelId int) error
	GetLevelById(levelId int) (level.Level, error)
	GetLevelList(fetchStruct level.FetchLevelStruct) ([]level.Level, error)
	CheckLevelExists(levId int) (string, error)
	GetLevelStats(levelId int) (statistics.LevelStats, error)
	GetLevelUserTop(levelId int) ([]statistics.UserLevelCompletionInfo, error)
}
