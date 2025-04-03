package domain

type StatSortFilterParams struct {
	Points         string         `json:"points" binding:"omitempty"`
	CategoryParams CategoryParams `json:"category_params" binding:"omitempty"`
	PageInfo       PageInfo       `json:"page_info" binding:"required"`
}

type StatSortFilterParamsJSON struct {
	Points         string             `json:"points" binding:"omitempty"`
	CategoryParams CategoryParamsJSON `json:"category_params" binding:"omitempty"`
	PageInfo       PageInfo           `json:"page_info" binding:"required"`
}

type PageInfo struct {
	PageSize int `json:"page_size" binding:"required"`
	Offset   int `json:"offset" binding:"required"`
}
