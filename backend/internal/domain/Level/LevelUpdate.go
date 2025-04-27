package domain

type LevelUpdateStruct struct {
	Id          int      `json:"id" binding:"required" example:"1"`
	AuthorName  string   `json:"author_name" db:"author_name" binding:"required" example:"John Doe"`
	Name        string   `json:"name" binding:"required" example:"Best level"`
	Author      int      `json:"author" binding:"required" example:"3"`
	Description string   `json:"description" binding:"required" example:"This is a description"`
	Duration    int      `json:"duration" binding:"required" example:"100"`
	Tags        []string `json:"tags" binding:"required" example:"tag1,tag2"`
	Language    string   `json:"language" binding:"required" example:"eng"`
	ImageType   string   `json:"image_type" binding:"required" example:"png"`
	Type        string   `json:"type" binding:"required" example:"classic"`
	Difficulty  int      `json:"difficulty" binding:"required" example:"7"`
}
