package domain

type Level struct {
	Id          int      `json:"id" db:"id" example:"0"`
	AuthorName  string   `json:"author_name" db:"author_name" binding:"required" example:"John Doe"`
	Name        string   `json:"name" binding:"required" db:"name" example:"Level"`
	Author      int      `json:"author" binding:"required" db:"author" example:"1"`
	Description string   `json:"description" binding:"required" db:"description" example:"Description"`
	Duration    int      `json:"duration" binding:"required" db:"duration" example:"100"`
	Tags        []string `json:"tags" binding:"required" db:"tags"`
	Language    string   `json:"language" binding:"required" db:"language" example:"eng"`
	ImageType   string   `json:"image_type" binding:"required" db:"preview_type" example:"png"`
	Type        string   `json:"type" binding:"required" db:"type" example:"classic"`
	Difficulty  int      `json:"difficulty" binding:"required" db:"difficulty" example:"9"`
	PreviewPath string   `json:"preview_path" db:"preview_path" example:"path"`
}

type LevelsList struct {
	Levels []Level `json:"levels"`
}

type LevelInfo struct {
	MainInfo Level `json:"level_info"`
}
