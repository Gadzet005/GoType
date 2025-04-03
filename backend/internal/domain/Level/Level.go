package domain

type Level struct {
	Id          int      `json:"id" db:"id"`
	AuthorName  string   `json:"author_name" db:"author_name" binding:"required"`
	Name        string   `json:"name" binding:"required" db:"name"`
	Author      int      `json:"author" binding:"required" db:"author"`
	Description string   `json:"description" binding:"required" db:"description"`
	Duration    int      `json:"duration" binding:"required" db:"duration"`
	Tags        []string `json:"tags" binding:"required" db:"tags"`
	Language    string   `json:"language" binding:"required" db:"language"`
	ImageType   string   `json:"image_type" binding:"required" db:"preview_type"`
	Type        string   `json:"type" binding:"required" db:"type"`
	Difficulty  int      `json:"difficulty" binding:"required" db:"difficulty"`
	PreviewPath string   `json:"preview_path" db:"preview_path"`
}

type LevelsList struct {
	Levels []Level `json:"levels"`
}

type LevelInfo struct {
	MainInfo Level `json:"level_info"`
}
