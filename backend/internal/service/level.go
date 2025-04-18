package service

import (
	"encoding/json"
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/internal/domain"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"golang.org/x/exp/slices"
	"io"
	"mime/multipart"
	"os"
)

type LevelService struct {
	repo repository.Level
}

func NewLevelService(repo repository.Level) *LevelService {
	return &LevelService{repo: repo}
}

func (s *LevelService) CreateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error) {
	jsonFile, _ := infoFile.Open()

	defer jsonFile.Close()

	fileBytes, err := io.ReadAll(jsonFile)
	if err != nil {
		return -1, errors.New(gotype.ErrInternal)
	}

	var levelInfo level.Level
	err = json.Unmarshal(fileBytes, &levelInfo)
	if err != nil {
		return -1, errors.New(gotype.ErrInvalidInput)
	}

	if userId != levelInfo.Author {
		return -1, errors.New(gotype.ErrPermissionDenied)
	}

	if slices.Index(level.AvailableLanguages, levelInfo.Language) == -1 {
		return -1, errors.New(gotype.ErrInvalidInput)
	}

	if slices.Index(level.AvailableTypes, levelInfo.Type) == -1 {
		return -1, errors.New(gotype.ErrInvalidInput)
	}

	previewName, archiveName, id, err := s.repo.CreateLevel(levelInfo)

	levelFile.Filename = archiveName
	err = saveFile(levelFile, gotype.LevelDirName+"/"+levelFile.Filename)
	if err != nil {
		_ = s.DeleteLevel(levelInfo.Id)
		return -1, errors.New(gotype.ErrInternal)
	}

	previewFile.Filename = previewName
	err = saveFile(previewFile, gotype.PreviewDirName+"/"+previewFile.Filename)
	if err != nil {
		_ = s.DeleteLevel(levelInfo.Id)
		_ = os.Remove(gotype.LevelDirName + "/" + levelFile.Filename)
		return -1, errors.New(gotype.ErrInternal)
	}

	return id, nil
}

func (s *LevelService) UpdateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error) {
	jsonFile, _ := infoFile.Open()

	defer jsonFile.Close()

	fileBytes, err := io.ReadAll(jsonFile)
	if err != nil {
		logrus.Printf("Error reading json: %v", err)
		return -1, errors.New(gotype.ErrInternal)
	}

	var levelInfo level.LevelUpdateStruct
	err = json.Unmarshal(fileBytes, &levelInfo)
	if err != nil {
		return -1, errors.New(gotype.ErrInvalidInput)
	}
	fmt.Println(levelInfo)

	realAuthorId, _, oldArchivePath, err := s.repo.GetPathsById(levelInfo.Id)

	if err != nil {
		logrus.Printf("Error paths: %v", err)
		return -1, err
	}

	if realAuthorId != userId || realAuthorId != levelInfo.Author {
		return -1, errors.New(gotype.ErrPermissionDenied)
	}

	newArchiveName, previewName, _, err := s.repo.UpdateLevel(levelInfo)

	if err != nil {
		logrus.Printf("level update error: %v", err)
		return -1, err
	}

	err = os.Remove(oldArchivePath)
	if err != nil {
		logrus.Printf("Failed to remove old archive %s", oldArchivePath)
		return -1, errors.New(gotype.ErrInternal)
	}

	levelFile.Filename = newArchiveName

	err = saveFile(levelFile, gotype.LevelDirName+"/"+levelFile.Filename)
	if err != nil {
		logrus.Printf("Failed to save new archive %s", oldArchivePath)
		_ = s.DeleteLevel(levelInfo.Id)
		_ = os.Remove(gotype.PreviewDirName + "/" + previewName)
		return -1, errors.New(gotype.ErrInternal)
	}

	err = os.Remove(gotype.PreviewDirName + "/" + previewName)
	if err != nil {
		logrus.Printf("Failed to remove preview %s", previewName)
		return -1, errors.New(gotype.ErrInternal)
	}

	previewFile.Filename = previewName
	err = saveFile(previewFile, gotype.PreviewDirName+"/"+previewFile.Filename)
	if err != nil {

		logrus.Printf("Failed to save new preview %s", oldArchivePath)
		_ = s.DeleteLevel(levelInfo.Id)
		_ = os.Remove(gotype.LevelDirName + "/" + levelFile.Filename)
		return -1, errors.New(gotype.ErrInternal)
	}

	return levelInfo.Id, nil
}

func (s *LevelService) DeleteLevel(levelId int) error {
	err := s.repo.DeleteLevel(levelId)

	if err != nil {
		return err
	}

	return nil
}

func (s *LevelService) GetLevelById(levelId int) (level.Level, error) {
	curLevel, err := s.repo.GetLevelById(levelId)

	if err != nil {
		return level.Level{}, err
	}

	return curLevel, nil
}

func (s *LevelService) GetLevelUserTop(levelId int) ([]statistics.UserLevelCompletionInfo, error) {
	levelCompInfo, err := s.repo.GetLevelUserTop(levelId)

	if err != nil {
		return []statistics.UserLevelCompletionInfo{}, err
	}

	return levelCompInfo, nil
}

func (s *LevelService) GetLevelList(fetchStruct level.FetchLevelStruct) ([]level.Level, error) {
	sortOrder, sortParam := "desc", "num_played"

	if slices.Index(domain.SortingValues, fetchStruct.SortParams.Date) != -1 {
		sortOrder = fetchStruct.SortParams.Date
		sortParam = "creation_time"
	}

	if slices.Index(domain.SortingValues, fetchStruct.SortParams.Popularity) != -1 {
		sortOrder = fetchStruct.SortParams.Popularity
		sortParam = "num_played"
	}

	params := map[string]interface{}{
		"sort_order": sortOrder,
		"sort_param": sortParam,
		"difficulty": fetchStruct.FilterParams.Difficulty,
		"language":   fetchStruct.FilterParams.Language,
		"level_name": fetchStruct.FilterParams.LevelName,
		"page_size":  fetchStruct.PageInfo.PageSize,
		"page_num":   fetchStruct.PageInfo.Offset,
		"tags":       fetchStruct.Tags,
	}

	levels, err := s.repo.FetchLevels(params)

	if err != nil {
		return nil, err
	}

	return levels, nil
}

func (s *LevelService) GetLevelStats(levelId int) (statistics.LevelStats, error) {
	levelStats, err := s.repo.GetLevelStats(levelId)

	if err != nil {
		return statistics.LevelStats{}, err
	}

	return levelStats, nil
}

func (s *LevelService) CheckLevelExists(levId int) (string, error) {
	_, _, filePath, err := s.repo.GetPathsById(levId)

	if err != nil {
		return "", err
	}

	_, err = os.Open(filePath)
	if err != nil {
		return "", errors.New(gotype.ErrEntityNotFound)
	}

	return filePath, nil
}

func saveFile(file *multipart.FileHeader, path string) error {
	s := &gin.Context{}
	return s.SaveUploadedFile(file, path)
}
