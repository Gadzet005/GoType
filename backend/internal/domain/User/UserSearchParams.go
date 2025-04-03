package domain

type UserSearchParams struct {
	Name     string `json:"name" binding:"required"`
	IsBanned *bool  `json:"is_banned" binding:"required"`
	PageSize int    `json:"page_size" binding:"required"`
	Offset   int    `json:"offset" binding:"required"`
}
