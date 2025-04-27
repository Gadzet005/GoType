package domain

type StatSortFilterParams struct {
	Points         string         `json:"points" binding:"omitempty" example:"asc"`
	CategoryParams CategoryParams `json:"category_params" binding:"omitempty"`
	PageInfo       PageInfo       `json:"page_info" binding:"required"`
}

type StatSortFilterParamsJSON struct {
	Points         string             `json:"points" binding:"omitempty" example:"asc"`
	CategoryParams CategoryParamsJSON `json:"category_params" binding:"omitempty"`
	PageInfo       PageInfo           `json:"page_info" binding:"required"`
}

type PageInfo struct {
	PageSize int `json:"page_size" binding:"required,gte=1" example:"10"`
	Offset   int `json:"offset" binding:"required,gte=1" example:"1"`
}
