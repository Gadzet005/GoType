package domain

import (
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
)

func GenerateAvatarName(userID int) string {
	return fmt.Sprintf("avatar_%d", userID)
}

func GenerateAvatarPath(userID int) string {
	return fmt.Sprintf("%s/%s", gotype.AvatarDirName, GenerateAvatarName(userID))
}
