package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	levels "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/redis/go-redis/v9"
	"github.com/sirupsen/logrus"
	"golang.org/x/exp/slices"
	"strconv"
	"time"
)

const (
	getLevelUserTopPrefix = "GetLevelUserTop::"
	getLevelStatsPrefix   = "GetLevelStats::"
	levelUserTopTTL       = time.Duration(2 * time.Minute)
	levelStatsTTL         = time.Duration(2 * time.Minute)
)

// TODO: Finish sorting
type LevelPostgres struct {
	db     *sqlx.DB
	client *redis.Client
}

func NewLevelPostgres(db *sqlx.DB, client *redis.Client) *LevelPostgres {
	return &LevelPostgres{db: db, client: client}
}

func (lp *LevelPostgres) CreateLevel(level levels.Level) (string, string, int, error) {
	tx, err := lp.db.Beginx()

	var id int

	query := fmt.Sprintf("INSERT INTO %s (name, author, description, duration, language, type, preview_path, archive_path, is_banned, difficulty, preview_type, author_name, creation_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id", levelTable)
	row := tx.QueryRow(query, level.Name, level.Author, level.Description, level.Duration, level.Language, level.Type, ".", ".", 0, level.Difficulty, level.ImageType, level.AuthorName, time.Now().UTC())

	if err := row.Scan(&id); err != nil {
		_ = tx.Rollback()
		logrus.Printf("Error creating level: %s", err.Error())
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	err = lp.InsertTags(tx, id, level.Tags)

	if err != nil {
		logrus.Printf("Error inserting tags: %s", err.Error())
		_ = tx.Rollback()
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	query = fmt.Sprintf("UPDATE %s SET preview_path = $1, archive_path = $2 WHERE id = $3", levelTable)

	archivePath := levels.GenerateLevelPath(level.Name, level.Author, id)
	previewPath := levels.GeneratePreviewPath(id)

	row = tx.QueryRow(query, previewPath, archivePath, id)

	if err := row.Err(); err != nil {
		logrus.Printf("Error updating level: %s", err.Error())
		_ = tx.Rollback()
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	err = tx.Commit()

	if err != nil {
		logrus.Printf("Error commiting level: %s", err.Error())
		_ = tx.Rollback()
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	return levels.GeneratePreviewName(id), levels.GenerateLevelArchiveName(level.Name, level.Author, id), id, nil
}

func (lp *LevelPostgres) DeleteLevel(levelId int) error {
	tx, err := lp.db.Beginx()

	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	query := fmt.Sprintf("DELETE FROM LevelTag WHERE level_id = $1")
	_, err = tx.Exec(query, levelId)

	if err != nil {
		_ = tx.Rollback()
		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}

		return errors.New(gotype.ErrInternal)
	}

	query = fmt.Sprintf("DELETE FROM %s WHERE id = $1", levelTable)
	_, err = tx.Exec(query, levelId)

	if err != nil {
		fmt.Println(err)
		_ = tx.Rollback()

		if errors.Is(err, sql.ErrNoRows) {
			return nil
		}

		return errors.New(gotype.ErrInternal)
	}

	err = tx.Commit()

	if err != nil {
		_ = tx.Rollback()
		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (lp *LevelPostgres) UpdateLevel(levelInfo levels.LevelUpdateStruct) (string, string, int, error) {
	var id int

	tx, err := lp.db.Beginx()

	if err != nil {
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	fmt.Println("FROM REPO: ", levelInfo.Id)
	query := fmt.Sprintf("UPDATE %s SET name = $1, description = $2, duration = $3, language = $4, type = $5, archive_path = $6, author_name = $7 WHERE id = $8 RETURNING id", levelTable)
	row := tx.QueryRow(query, levelInfo.Name, levelInfo.Description, levelInfo.Duration, levelInfo.Language, levelInfo.Type, levels.GenerateLevelPath(levelInfo.Name, levelInfo.Author, levelInfo.Id), levelInfo.AuthorName, levelInfo.Id)

	archiveName := levels.GenerateLevelArchiveName(levelInfo.Name, levelInfo.Author, levelInfo.Id)
	previewName := levels.GeneratePreviewName(levelInfo.Id)

	if err := row.Scan(&id); err != nil {
		_ = tx.Rollback()

		if errors.Is(err, sql.ErrNoRows) {
			return "", "", -1, errors.New(gotype.ErrEntityNotFound)
		}

		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	query = fmt.Sprintf("DELETE FROM LevelTag WHERE level_id = $1")
	row = tx.QueryRow(query, levelInfo.Id)

	if err := row.Scan(); err != nil && !errors.Is(err, sql.ErrNoRows) {
		_ = tx.Rollback()
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	err = lp.InsertTags(tx, id, levelInfo.Tags)

	if err != nil {
		_ = tx.Rollback()
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	err = tx.Commit()

	if err != nil {
		_ = tx.Rollback()
		return "", "", -1, errors.New(gotype.ErrInternal)
	}

	return archiveName, previewName, id, nil
}

func (lp *LevelPostgres) GetLevelById(levelId int) (levels.Level, error) {
	var retLevel levels.Level

	query := fmt.Sprintf("SELECT id, name, author, description, duration, language, preview_type, type, difficulty, preview_path, author_name FROM %s WHERE id = $1 and is_banned = FALSE", levelTable)
	err := lp.db.Get(&retLevel, query, levelId)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return levels.Level{}, errors.New(gotype.ErrEntityNotFound)
		}

		return levels.Level{}, errors.New(gotype.ErrInternal)
	}

	levTags, err := lp.GetTagsByLevelID(levelId)

	if err != nil {
		return levels.Level{}, errors.New(gotype.ErrInternal)
	}

	for _, tag := range levTags {
		retLevel.Tags = append(retLevel.Tags, tag.Name)
	}

	return retLevel, nil
}

func (lp *LevelPostgres) GetPathsById(levelId int) (int, string, string, error) {
	var previewPath, archivePath string
	var authorId int

	query := fmt.Sprintf("SELECT author, preview_path, archive_path FROM %s WHERE id = $1 and is_banned = FALSE", levelTable)
	row := lp.db.QueryRow(query, levelId)

	if err := row.Scan(&authorId, &previewPath, &archivePath); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return -1, "", "", errors.New(gotype.ErrEntityNotFound)
		}
		logrus.Printf("Error querying level paths: %s", err.Error())
		return -1, "", "", errors.New(gotype.ErrInternal)
	}
	return authorId, previewPath, archivePath, nil
}

func (lp *LevelPostgres) FetchLevels(params map[string]interface{}) ([]levels.Level, error) {
	var curLevels []levels.Level

	params["tags"] = pq.Array(params["tags"])

	q := `SELECT l.id, l.name, l.author, l.description, l.duration, l.language, l.preview_type, l.type, l.difficulty, l.preview_path, l.author_name, COALESCE( (SELECT ARRAY_AGG(lt.tag_name) FROM LevelTag lt WHERE lt.level_id = l.id), '{}') AS tags FROM %s l WHERE l.is_banned = FALSE `

	if params["difficulty"].(int) >= 1 && params["difficulty"].(int) <= 10 {
		q += ` and l.difficulty =  ` + strconv.Itoa(params["difficulty"].(int)) + " "
	}

	if slices.Index(levels.AvailableLanguages, params["language"].(string)) != -1 {
		q += ` and l.language = '` + params["language"].(string) + `' `
	}

	if t := params["level_name"].(string); t != "" {
		q += ` and levenshtein(l.name,'` + t + `') < char_length(l.name) `
	}

	query := fmt.Sprintf(q+`ORDER BY CASE WHEN :sort_param = %s THEN EXTRACT(EPOCH FROM l.creation_time) ELSE l.num_played END %s LIMIT :page_size OFFSET (:page_num - 1) * :page_size;`, levelTable, "'creation_time'", params["sort_order"])

	query = lp.db.Rebind(query)
	rows, err := lp.db.NamedQuery(query, params)

	if err != nil {
		logrus.Printf("Error fetching levels: %s", err.Error())
		return nil, errors.New(gotype.ErrInternal)
	}
	defer rows.Close()

	for rows.Next() {
		var level levels.Level
		err := rows.Scan(
			&level.Id, &level.Name, &level.Author, &level.Description,
			&level.Duration, &level.Language, &level.ImageType,
			&level.Type, &level.Difficulty, &level.PreviewPath,
			&level.AuthorName, pq.Array(&level.Tags),
		)
		if err != nil {
			logrus.Printf("Error fetching levels: %s", err.Error())
			return nil, errors.New(gotype.ErrInternal)
		}
		curLevels = append(curLevels, level)
	}

	return curLevels, nil
}

func (lp *LevelPostgres) InsertTags(tx *sqlx.Tx, levelID int, tags []string) error {
	insertTagQuery := fmt.Sprintf("INSERT INTO Tag (name) SELECT unnest($1::text[]) ON CONFLICT (name) DO NOTHING;")

	_, err := tx.Exec(insertTagQuery, pq.Array(tags))
	if err != nil {
		_ = tx.Rollback()
		logrus.Printf("Error inserting tags: %v", err)
		return errors.New(gotype.ErrInternal)
	}

	insertLevelTagQuery := fmt.Sprintf("INSERT INTO LevelTag (level_id, tag_name) SELECT $1, name FROM Tag WHERE name = ANY($2) ON CONFLICT (level_id, tag_name) DO NOTHING;")
	_, err = tx.Exec(insertLevelTagQuery, levelID, pq.Array(tags))
	if err != nil {
		_ = tx.Rollback()
		logrus.Printf("Error inserting tags2: %v", err)
		return errors.New(gotype.ErrInternal)
	}

	return nil
}

func (lp *LevelPostgres) GetTagsByLevelID(levelID int) ([]levels.Tag, error) {
	var tags []levels.Tag
	query := fmt.Sprintf("SELECT t.name FROM LevelTag lt JOIN Tag t ON lt.tag_name = t.name WHERE lt.level_id = $1;")
	err := lp.db.Select(&tags, query, levelID)

	if err != nil {
		return nil, errors.New(gotype.ErrInternal)
	}

	return tags, nil
}

func (lp *LevelPostgres) GetLevelStats(levelId int) (statistics.LevelStats, error) {
	//Reading from cache
	cached, err := lp.GetLevelStatsFromCache(levelId)

	if err == nil {
		return cached, nil
	}

	var stats statistics.LevelStats

	query := fmt.Sprintf("SELECT COALESCE(count(*), 0) as num_played, COALESCE(AVG(accuracy), 0) as average_acc, COALESCE(MAX(max_combo), 0) as max_combo, COALESCE(MAX(points), 0) as max_points, COALESCE(AVG(points),0) as average_points, COALESCE(AVG(average_velocity),0) as average_average_velocity, COALESCE(MAX(average_velocity),0) as max_average_velocity FROM %s WHERE level_id = $1", levelCompleteTable)
	if err := lp.db.Get(&stats, query, levelId); err != nil {
		logrus.Printf("Error fetching levels: get level stats top %s", err.Error())
		return statistics.LevelStats{}, errors.New(gotype.ErrInternal)
	}

	//Saving result in cache
	_ = lp.SaveLevelStatsInCache(levelId, stats)
	return stats, nil
}

func (sp *LevelPostgres) GetLevelStatsFromCache(levelId int) (statistics.LevelStats, error) {
	key := getLevelStatsPrefix + strconv.Itoa(levelId)

	val, err := sp.client.Get(context.Background(), key).Result()

	if err != nil {
		return statistics.LevelStats{}, errors.New(gotype.ErrInternal)
	} else {
		var ret statistics.LevelStats
		err := json.Unmarshal([]byte(val), &ret)
		if err != nil {
			return statistics.LevelStats{}, errors.New(gotype.ErrInternal)
		} else {
			logrus.Printf("GetFromCache: {%s, %s}", key, val)
			return ret, nil
		}
	}

}

func (sp *LevelPostgres) SaveLevelStatsInCache(levelId int, result statistics.LevelStats) error {
	key := getLevelStatsPrefix + strconv.Itoa(levelId)

	val, err := json.Marshal(result)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	res := sp.client.Set(context.Background(), key, val, levelStatsTTL)
	logrus.Printf("Saving %s to cache. Error: %v", key, res.Err())

	return nil
}

func (lp *LevelPostgres) GetLevelUserTop(levelId int) ([]statistics.UserLevelCompletionInfo, error) {
	//Reading from cache
	cached, err := lp.GetLevelUserTopFromCache(levelId)

	if err == nil {
		return cached, nil
	}

	var ret []statistics.UserLevelCompletionInfo

	query := fmt.Sprintf(fmt.Sprintf("SELECT s.level_id,s.player_id,u.name as player_name,s.time,s.accuracy,s.average_velocity,s.max_combo,s.placement,s.points FROM (SELECT * FROM %s WHERE level_id = $1 ORDER BY points, time LIMIT 10) AS s JOIN %s AS u on s.player_id = u.id", levelCompleteTable, usersTable))
	if err := lp.db.Select(&ret, query, levelId); err != nil {
		logrus.Printf("Error fetching levels: get level user top %s", err.Error())
		return []statistics.UserLevelCompletionInfo{}, errors.New(gotype.ErrInternal)
	}

	//Saving result in cache
	_ = lp.SaveLevelUserTopInCache(levelId, ret)

	return ret, nil
}

func (sp *LevelPostgres) GetLevelUserTopFromCache(levelId int) ([]statistics.UserLevelCompletionInfo, error) {
	key := getLevelUserTopPrefix + strconv.Itoa(levelId)

	val, err := sp.client.Get(context.Background(), key).Result()

	if err != nil {
		return []statistics.UserLevelCompletionInfo{}, errors.New(gotype.ErrInternal)
	} else {
		var ret []statistics.UserLevelCompletionInfo
		err := json.Unmarshal([]byte(val), &ret)
		if err != nil {
			return []statistics.UserLevelCompletionInfo{}, errors.New(gotype.ErrInternal)
		} else {
			logrus.Printf("GetFromCache: {%s, %s}", key, val)
			return ret, nil
		}
	}

}

func (sp *LevelPostgres) SaveLevelUserTopInCache(levelId int, result []statistics.UserLevelCompletionInfo) error {
	key := getLevelUserTopPrefix + strconv.Itoa(levelId)

	val, err := json.Marshal(result)
	if err != nil {
		return errors.New(gotype.ErrInternal)
	}

	res := sp.client.Set(context.Background(), key, val, levelUserTopTTL)
	logrus.Printf("Saving %s to cache. Error: %v", key, res.Err())

	return nil
}
