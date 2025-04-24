package service

import (
	"encoding/json"
	"errors"
	"github.com/Gadzet005/GoType/backend/internal/domain"
	repository "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Repositories"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	pkg "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/sirupsen/logrus"
	"golang.org/x/exp/slices"
	"io"
	"mime/multipart"
	"os"
)

type LevelService struct {
	repo        repository.Level
	fileStorage repository.Files
}

func NewLevelService(repo repository.Level, fileStorage repository.Files) *LevelService {
	return &LevelService{repo: repo, fileStorage: fileStorage}
}

func (s *LevelService) CreateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error) {
	jsonFile, _ := infoFile.Open()
	defer jsonFile.Close()
	fileBytes, err := io.ReadAll(jsonFile)
	if err != nil {
		return -1, errors.New(pkg.ErrInternal)
	}

	var levelInfo level.Level
	if err := json.Unmarshal(fileBytes, &levelInfo); err != nil {
		return -1, errors.New(pkg.ErrInvalidInput)
	}

	if userId != levelInfo.Author {
		return -1, errors.New(pkg.ErrPermissionDenied)
	}

	if slices.Index(level.AvailableLanguages, levelInfo.Language) == -1 ||
		slices.Index(level.AvailableTypes, levelInfo.Type) == -1 {
		return -1, errors.New(pkg.ErrInvalidInput)
	}

	previewName, archiveName, id, err := s.repo.CreateLevel(levelInfo)
	if err != nil {
		return -1, errors.New(pkg.ErrInternal)
	}

	levelFile.Filename = archiveName
	if err := s.fileStorage.SaveFile(levelFile, pkg.LevelDirName+"/"+levelFile.Filename); err != nil {
		_ = s.DeleteLevel(levelInfo.Id)
		return -1, errors.New(pkg.ErrInternal)
	}

	previewFile.Filename = previewName
	if err := s.fileStorage.SaveFile(previewFile, pkg.PreviewDirName+"/"+previewFile.Filename); err != nil {
		_ = s.DeleteLevel(levelInfo.Id)
		_ = s.fileStorage.DeleteFile(pkg.LevelDirName + "/" + levelFile.Filename)
		return -1, errors.New(pkg.ErrInternal)
	}

	return id, nil
}

func (s *LevelService) UpdateLevel(userId int, levelFile, infoFile, previewFile *multipart.FileHeader) (int, error) {
	jsonFile, _ := infoFile.Open()
	defer jsonFile.Close()

	fileBytes, err := io.ReadAll(jsonFile)
	if err != nil {
		logrus.Printf("Error reading json: %v", err)
		return -1, errors.New(pkg.ErrInternal)
	}

	var levelInfo level.LevelUpdateStruct
	if err := json.Unmarshal(fileBytes, &levelInfo); err != nil {
		return -1, errors.New(pkg.ErrInvalidInput)
	}

	realAuthorId, _, oldArchivePath, err := s.repo.GetPathsById(levelInfo.Id)
	if err != nil {
		logrus.Printf("Error getting paths: %v", err)
		return -1, err
	}

	if realAuthorId != userId || realAuthorId != levelInfo.Author {
		return -1, errors.New(pkg.ErrPermissionDenied)
	}

	newArchiveName, previewName, _, err := s.repo.UpdateLevel(levelInfo)
	if err != nil {
		logrus.Printf("Error updating level: %v", err)
		return -1, err
	}

	if err := s.fileStorage.DeleteFile(oldArchivePath); err != nil {
		logrus.Printf("Failed to remove old archive: %v", err)
		return -1, errors.New(pkg.ErrInternal)
	}

	levelFile.Filename = newArchiveName
	if err := s.fileStorage.SaveFile(levelFile, pkg.LevelDirName+"/"+levelFile.Filename); err != nil {
		_ = s.DeleteLevel(levelInfo.Id)
		_ = s.fileStorage.DeleteFile(pkg.PreviewDirName + "/" + previewName)
		return -1, errors.New(pkg.ErrInternal)
	}

	if err := s.fileStorage.DeleteFile(pkg.PreviewDirName + "/" + previewName); err != nil {
		logrus.Printf("Failed to delete preview: %v", err)
		return -1, errors.New(pkg.ErrInternal)
	}

	previewFile.Filename = previewName
	if err := s.fileStorage.SaveFile(previewFile, pkg.PreviewDirName+"/"+previewFile.Filename); err != nil {
		_ = s.DeleteLevel(levelInfo.Id)
		_ = s.fileStorage.DeleteFile(pkg.LevelDirName + "/" + levelFile.Filename)
		return -1, errors.New(pkg.ErrInternal)
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
		return "", errors.New(pkg.ErrEntityNotFound)
	}

	return filePath, nil
}
