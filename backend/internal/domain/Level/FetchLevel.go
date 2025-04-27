package domain

var AvailableLanguages = []string{"eng", "rus"}
var AvailableTypes = []string{"classic", "relax"}

type LevelSortParams struct {
	Popularity string `json:"popularity" example:"desc"`
	Date       string `json:"date" example:"asc"`
}

type LevelFilterParams struct {
	Difficulty int    `json:"difficulty,gte=0" example:"5"`
	Language   string `json:"language" example:"eng"`
	LevelName  string `json:"level_name" example:"Best level"`
}

type FetchLevelStruct struct {
	SortParams   LevelSortParams   `json:"sort_params" binding:"required"`
	FilterParams LevelFilterParams `json:"filter_params"  binding:"required"`
	Tags         []string          `json:"tags" binding:"omitempty"`
	PageInfo     PageInfo          `json:"page_info" binding:"required"`
}

type PageInfo struct {
	PageSize int `json:"page_size" binding:"required,gte=1" example:"10"`
	Offset   int `json:"offset" binding:"required,gte=0" example:"1"`
}
