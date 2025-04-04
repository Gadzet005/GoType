package domain

type CategoryParams struct {
	Category rune   `json:"category"`
	Pattern  string `json:"pattern"`
}

type CategoryParamsJSON struct {
	Category string `json:"category"`
	Pattern  string `json:"pattern"`
}
