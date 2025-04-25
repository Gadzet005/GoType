package domain

type UserUnban struct {
	Id int `json:"id" binding:"required"`
}
