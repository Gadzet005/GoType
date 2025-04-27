package domain

type UserSearchParams struct {
	Name     string `form:"name"`
	IsBanned bool   `form:"is_banned"`
	PageSize int    `form:"page_size" binding:"required,gte=1"`
	Offset   int    `form:"offset" binding:"required,gte=1"`
}
