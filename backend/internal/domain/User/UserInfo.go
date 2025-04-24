package domain

import (
	"database/sql"
	"time"
)

type UserInfo struct {
	Id        int         `json:"id" db:"id"`
	Name      string      `json:"name" binding:"required" db:"name"`
	Access    AccessLevel `json:"access" db:"access"`
	BanReason string      `json:"ban_reason" binding:"required" db:"ban_reason"`
}

type GetUserInfoStruct struct {
	Id         int            `json:"id"`
	Name       string         `json:"username"`
	Access     int            `json:"access"`
	BanTime    time.Time      `json:"ban_time"`
	BanReason  string         `json:"ban_reason"`
	AvatarPath sql.NullString `json:"avatar_path" swaggerignore:"true"`
}
