package domain

type UserSearchParams struct {
	Name     string `form:"name" binding:"required"`
	IsBanned bool   `form:"is_banned"`
	PageSize int    `form:"page_size" binding:"required"`
	Offset   int    `form:"offset"`
}
