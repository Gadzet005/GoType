package entities

import "time"

type AccessLevel int

const (
	Banned = iota
	Authorized
	Moderator
	Admin
	SeniorAdmin
)

type User struct {
	Id           int         `json:"-" db:"id"`
	Name         string      `json:"name" binding:"required" db:"name"`
	Password     string      `json:"password" binding:"required" db:"password_hash"` //hash
	RefreshToken string      `json:"-" db:"refresh_token"`
	ExpiresAt    time.Time   `json:"-" db:"expires_at"`
	Access       AccessLevel `json:"-" db:"access"`
}

type UserInfo struct {
	Id        int         `json:"-" db:"id"`
	Name      string      `json:"name" binding:"required" db:"name"`
	Access    AccessLevel `json:"access" db:"access"`
	BanReason string      `json:"ban_reason" binding:"required" db:"ban_reason"`
}

type Users struct {
	UserInfo []User `json:"users"`
}

type UserID struct {
	Id int `json:"id" binding:"required"`
}

type UserSearchParams struct {
	Name     string `json:"name" binding:"required"`
	IsBanned *bool  `json:"is_banned" binding:"required"`
	PageSize int    `json:"page_size" binding:"required"`
	Offset   int    `json:"offset" binding:"required"`
}
