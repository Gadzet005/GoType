package domain

type LevelUpdateStruct struct {
	Id          int      `json:"id" binding:"required"`
	AuthorName  string   `json:"author_name" db:"author_name" binding:"required"`
	Name        string   `json:"name" binding:"required"`
	Author      int      `json:"author" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Duration    int      `json:"duration" binding:"required"`
	Tags        []string `json:"tags" binding:"required"`
	Language    string   `json:"language" binding:"required"`
	ImageType   string   `json:"image_type" binding:"required"`
	Type        string   `json:"type" binding:"required"`
	Difficulty  int      `json:"difficulty" binding:"required"`
}
