package domain

import (
	"fmt"
	"github.com/Gadzet005/GoType/backend/pkg"
)

func GenerateLevelArchiveName(levelName string, authorID int, levelID int) string {
	return fmt.Sprintf("%s-%d-%d", levelName, authorID, levelID)
}

func GeneratePreviewName(levelID int) string {
	return fmt.Sprintf("preview_%d", levelID)
}

func GenerateLevelPath(levelName string, authorID int, levelID int) string {
	return fmt.Sprintf("%s/%s", gotype.LevelDirName, GenerateLevelArchiveName(levelName, authorID, levelID))
}

func GeneratePreviewPath(levelID int) string {
	return fmt.Sprintf("%s/%s", gotype.PreviewDirName, GeneratePreviewName(levelID))
}
