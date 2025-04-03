package domain

type UserID struct {
	Id int `json:"id" binding:"required"`
}
