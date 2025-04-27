package domain

type PageInfo struct {
	PageSize int `json:"page_size" binding:"required,gte=1" example:"10"`
	Offset   int `json:"offset" binding:"required,gte=0" example:"1"`
}
