package domain

import (
	"fmt"
	"github.com/Gadzet005/GoType/backend/pkg"
)

func GenerateAvatarName(userID int) string {
	return fmt.Sprintf("avatar_%d", userID)
}

func GenerateAvatarPath(userID int) string {
	return fmt.Sprintf("%s/%s", gotype.AvatarDirName, GenerateAvatarName(userID))
}
