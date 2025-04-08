package domain

type Tag struct {
	Name string `db:"name"`
}

type LevelTag struct {
	LevelID int    `db:"level_id"`
	TagName string `db:"tag_name"`
}
