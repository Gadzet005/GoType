package domain

var AvailableLanguages = []string{"eng", "rus"}
var AvailableTypes = []string{"classic", "relax"}

type LevelSortParams struct {
	Popularity string `json:"popularity"`
	Date       string `json:"date"`
}

type LevelFilterParams struct {
	Difficulty int    `json:"difficulty"`
	Language   string `json:"language"`
	LevelName  string `json:"level_name"`
}

type FetchLevelStruct struct {
	SortParams   LevelSortParams   `json:"sort_params" binding:"required"`
	FilterParams LevelFilterParams `json:"filter_params"  binding:"required"`
	Tags         []string          `json:"tags" binding:"required"`
	PageInfo     PageInfo          `json:"page_info" binding:"required"`
}

type PageInfo struct {
	PageSize int `json:"page_size" binding:"required"`
	Offset   int `json:"offset" binding:"required"`
}
