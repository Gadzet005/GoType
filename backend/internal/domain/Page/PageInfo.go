package domain

type PageInfo struct {
	PageSize int `json:"page_size" binding:"required"`
	Offset   int `json:"offset" binding:"required"`
}
