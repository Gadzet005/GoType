package domain

type UserSearchParams struct {
	Name     string `form:"name" binding:"required"`
	IsBanned *bool  `form:"is_banned" binding:"required"`
	PageSize int    `form:"page_size" binding:"required"`
	Offset   int    `form:"offset" binding:"required"`
}
