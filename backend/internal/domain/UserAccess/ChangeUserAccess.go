package domain

type ChangeUserAccess struct {
	Id        int `json:"id" binding:"required"`
	NewAccess int `json:"new_access" binding:"required"`
}
