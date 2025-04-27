package domain

type CategoryParams struct {
	Category rune   `json:"category"`
	Pattern  string `json:"pattern" example:"asc"`
}

type CategoryParamsJSON struct {
	Category string `json:"category" example:"S"`
	Pattern  string `json:"pattern" example:"asc"`
}
