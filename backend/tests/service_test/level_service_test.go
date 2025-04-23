package service

import (
	"bytes"
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"reflect"
	"testing"
)

func TestDeleteLevel(t *testing.T) {
	mockRepo := new(mocks.Level)
	fileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, fileStorage)

	tests := map[string]struct {
		levelID       int
		mockErr       error
		expectedError error
	}{
		"success": {
			levelID:       1,
			mockErr:       nil,
			expectedError: nil,
		},
		"repository error": {
			levelID:       2,
			mockErr:       errors.New("db error"),
			expectedError: errors.New("db error"),
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			mockRepo.On("DeleteLevel", tt.levelID).Return(tt.mockErr).Once()

			err := service.DeleteLevel(tt.levelID)

			if (err == nil && tt.expectedError != nil) || (err != nil && tt.expectedError == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tt.expectedError)
			}
			if err != nil && tt.expectedError != nil && err.Error() != tt.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tt.expectedError.Error())
			}
		})
	}
}

func TestGetLevelById(t *testing.T) {
	mockRepo := new(mocks.Level)
	fileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, fileStorage)

	tests := map[string]struct {
		levelID       int
		mockLevel     level.Level
		mockErr       error
		expectedLevel level.Level
		expectedErr   error
	}{
		"success": {
			levelID:       1,
			mockLevel:     level.Level{Id: 1, Author: 1, Name: "Level 1"},
			mockErr:       nil,
			expectedLevel: level.Level{Id: 1, Author: 1, Name: "Level 1"},
			expectedErr:   nil,
		},
		"repository error": {
			levelID:       2,
			mockLevel:     level.Level{},
			mockErr:       errors.New("not found"),
			expectedLevel: level.Level{},
			expectedErr:   errors.New("not found"),
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			mockRepo.On("GetLevelById", tt.levelID).Return(tt.mockLevel, tt.mockErr).Once()

			levelResult, err := service.GetLevelById(tt.levelID)

			if !reflect.DeepEqual(levelResult, tt.expectedLevel) {
				t.Errorf("unexpected result: got %v, want %v", levelResult, tt.expectedLevel)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tt.expectedErr.Error())
			}
		})
	}
}

func TestGetLevelUserTop(t *testing.T) {
	mockRepo := new(mocks.Level)
	fileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, fileStorage)

	tests := map[string]struct {
		levelID     int
		mockResult  []statistics.UserLevelCompletionInfo
		mockErr     error
		expectedRes []statistics.UserLevelCompletionInfo
		expectedErr error
	}{
		"success": {
			levelID:     1,
			mockResult:  []statistics.UserLevelCompletionInfo{{PlayerId: 1}},
			mockErr:     nil,
			expectedRes: []statistics.UserLevelCompletionInfo{{PlayerId: 1}},
			expectedErr: nil,
		},
		"repository error": {
			levelID:     2,
			mockResult:  nil,
			mockErr:     errors.New("db error"),
			expectedRes: []statistics.UserLevelCompletionInfo{},
			expectedErr: errors.New("db error"),
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			mockRepo.On("GetLevelUserTop", tt.levelID).Return(tt.mockResult, tt.mockErr).Once()

			result, err := service.GetLevelUserTop(tt.levelID)

			if !reflect.DeepEqual(result, tt.expectedRes) {
				t.Errorf("unexpected result: got %v, want %v", result, tt.expectedRes)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tt.expectedErr.Error())
			}
		})
	}
}

func TestGetLevelStats(t *testing.T) {
	mockRepo := new(mocks.Level)
	fileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, fileStorage)

	tests := map[string]struct {
		levelID      int
		mockStats    statistics.LevelStats
		mockErr      error
		expectedStat statistics.LevelStats
		expectedErr  error
	}{
		"success": {
			levelID:      1,
			mockStats:    statistics.LevelStats{NumPlayed: 1, AverageAccuracy: 97.5},
			mockErr:      nil,
			expectedStat: statistics.LevelStats{NumPlayed: 1, AverageAccuracy: 97.5},
			expectedErr:  nil,
		},
		"repository error": {
			levelID:      2,
			mockStats:    statistics.LevelStats{},
			mockErr:      errors.New("db error"),
			expectedStat: statistics.LevelStats{},
			expectedErr:  errors.New("db error"),
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			mockRepo.On("GetLevelStats", tt.levelID).Return(tt.mockStats, tt.mockErr).Once()

			stats, err := service.GetLevelStats(tt.levelID)

			if !reflect.DeepEqual(stats, tt.expectedStat) {
				t.Errorf("unexpected stats: got %v, want %v", stats, tt.expectedStat)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tt.expectedErr.Error())
			}
		})
	}
}

func TestCheckLevelExists(t *testing.T) {
	mockRepo := new(mocks.Level)
	fileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, fileStorage)

	tempFile, err := os.CreateTemp("", "test_level_file")
	require.NoError(t, err)
	defer os.Remove(tempFile.Name())

	tests := map[string]struct {
		levID        int
		mockPath     string
		mockErr      error
		expectedPath string
		expectedErr  error
		setupFile    bool
	}{
		"success": {
			levID:        1,
			mockPath:     tempFile.Name(),
			mockErr:      nil,
			expectedPath: tempFile.Name(),
			expectedErr:  nil,
			setupFile:    true,
		},
		"repo error": {
			levID:        2,
			mockPath:     "",
			mockErr:      errors.New("db error"),
			expectedPath: "",
			expectedErr:  errors.New("db error"),
			setupFile:    false,
		},
		"file not found": {
			levID:        3,
			mockPath:     "/non/existing/path.zip",
			mockErr:      nil,
			expectedPath: "",
			expectedErr:  errors.New(gotype.ErrEntityNotFound),
			setupFile:    false,
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			mockRepo.On("GetPathsById", tt.levID).Return(0, "", tt.mockPath, tt.mockErr).Once()

			path, err := service.CheckLevelExists(tt.levID)

			if path != tt.expectedPath {
				t.Errorf("unexpected path: got %v, want %v", path, tt.expectedPath)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tt.expectedErr.Error())
			}
		})
	}
}

func TestGetLevelList(t *testing.T) {
	mockRepo := new(mocks.Level)
	fileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, fileStorage)

	tests := map[string]struct {
		fetchStruct  level.FetchLevelStruct
		expectedSort string
		expectedBy   string
		mockLevels   []level.Level
		mockErr      error
		expectedErr  error
	}{
		"default sort": {
			fetchStruct: level.FetchLevelStruct{
				SortParams: level.LevelSortParams{},
				FilterParams: level.LevelFilterParams{
					Difficulty: 2,
					Language:   "Go",
					LevelName:  "test",
				},
				PageInfo: level.PageInfo{PageSize: 10, Offset: 1},
				Tags:     []string{"fun"},
			},
			expectedSort: "desc",
			expectedBy:   "num_played",
			mockLevels:   []level.Level{{Id: 1, Name: "Level1"}},
			mockErr:      nil,
			expectedErr:  nil,
		},
		"sort by date": {
			fetchStruct: level.FetchLevelStruct{
				SortParams: level.LevelSortParams{Date: "asc"},
				FilterParams: level.LevelFilterParams{
					Difficulty: 1,
					Language:   "Python",
					LevelName:  "challenge",
				},
				PageInfo: level.PageInfo{PageSize: 5, Offset: 0},
				Tags:     []string{},
			},
			expectedSort: "asc",
			expectedBy:   "creation_time",
			mockLevels:   []level.Level{{Id: 2, Name: "Level2"}},
			mockErr:      nil,
			expectedErr:  nil,
		},
		"sort by popularity": {
			fetchStruct: level.FetchLevelStruct{
				SortParams: level.LevelSortParams{Popularity: "asc"},
				FilterParams: level.LevelFilterParams{
					Difficulty: 3,
					Language:   "Rust",
					LevelName:  "hardcore",
				},
				PageInfo: level.PageInfo{PageSize: 7, Offset: 2},
				Tags:     []string{"performance"},
			},
			expectedSort: "asc",
			expectedBy:   "num_played",
			mockLevels:   []level.Level{{Id: 3, Name: "Level3"}},
			mockErr:      nil,
			expectedErr:  nil,
		},
		"repository error": {
			fetchStruct: level.FetchLevelStruct{
				SortParams: level.LevelSortParams{},
				FilterParams: level.LevelFilterParams{
					Difficulty: 0,
					Language:   "",
					LevelName:  "",
				},
				PageInfo: level.PageInfo{PageSize: 3, Offset: 1},
				Tags:     []string{},
			},
			expectedSort: "desc",
			expectedBy:   "num_played",
			mockLevels:   nil,
			mockErr:      errors.New("db error"),
			expectedErr:  errors.New("db error"),
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			expectedParams := map[string]interface{}{
				"sort_order": tt.expectedSort,
				"sort_param": tt.expectedBy,
				"difficulty": tt.fetchStruct.FilterParams.Difficulty,
				"language":   tt.fetchStruct.FilterParams.Language,
				"level_name": tt.fetchStruct.FilterParams.LevelName,
				"page_size":  tt.fetchStruct.PageInfo.PageSize,
				"page_num":   tt.fetchStruct.PageInfo.Offset,
				"tags":       tt.fetchStruct.Tags,
			}

			mockRepo.On("FetchLevels", expectedParams).Return(tt.mockLevels, tt.mockErr).Once()

			levels, err := service.GetLevelList(tt.fetchStruct)

			if !reflect.DeepEqual(levels, tt.mockLevels) {
				t.Errorf("unexpected levels: got %v, want %v", levels, tt.mockLevels)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, want %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, want %v", err.Error(), tt.expectedErr.Error())
			}
		})
	}
}

func createMultipartFile(t *testing.T, filename string, content []byte) *multipart.FileHeader {
	t.Helper()

	var b bytes.Buffer
	writer := multipart.NewWriter(&b)
	part, err := writer.CreateFormFile("file", filename)
	require.NoError(t, err)

	_, err = part.Write(content)
	require.NoError(t, err)

	writer.Close()

	req := httptest.NewRequest(http.MethodPost, "/", &b)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	_, fileHeader, err := req.FormFile("file")
	require.NoError(t, err)

	return fileHeader
}
func TestCreateLevel(t *testing.T) {
	mockRepo := new(mocks.Level)
	mockFileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, mockFileStorage)

	infoJSON := `{
    "name": "cool level",
    "description": "hello",
    "author": 1,
    "author_name": "Gadzet11",
    "duration": 100,
    "tags": ["tag1", "tag2", "tag3"],
    "language": "rus",
    "type": "classic",
    "difficulty": 5,
    "image_type": "jpg"
}`
	infoFile := createMultipartFile(t, "info.json", []byte(infoJSON))

	tests := map[string]struct {
		userId            int
		levelFile         *multipart.FileHeader
		infoFile          *multipart.FileHeader
		previewFile       *multipart.FileHeader
		levelInfo         level.Level
		mockLevel         level.Level
		mockErr           error
		mockCreateErr     error
		expectedErr       error
		expectedId        int
		doCallCreateLevel bool
		doSaveLevel       bool
		doSavePreview     bool
		savePrevErr       error
		saveLevelErr      error
	}{
		"success": {
			userId:      1,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    infoFile,
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			levelInfo: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "rus",
				Type:        "classic",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockLevel: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "rus",
				Type:        "classic",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockErr:           nil,
			mockCreateErr:     nil,
			expectedErr:       nil,
			expectedId:        0,
			doCallCreateLevel: true,
			doSaveLevel:       true,
			doSavePreview:     true,
			savePrevErr:       nil,
			saveLevelErr:      nil,
		},
		"invalid json in info file": {
			userId:            1,
			levelFile:         &multipart.FileHeader{Filename: "level.zip"},
			infoFile:          createMultipartFile(t, "info.json", []byte("invalid json")),
			previewFile:       &multipart.FileHeader{Filename: "preview.png"},
			mockErr:           nil,
			mockCreateErr:     nil,
			expectedErr:       errors.New(gotype.ErrInvalidInput),
			expectedId:        -1,
			doCallCreateLevel: false,
		},
		"permission denied": {
			userId:      2,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    infoFile,
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			levelInfo: level.Level{
				Author:   1,
				Language: "Go",
				Type:     "Puzzle",
			},
			mockErr:           errors.New(gotype.ErrPermissionDenied),
			expectedErr:       errors.New(gotype.ErrPermissionDenied),
			expectedId:        -1,
			doCallCreateLevel: false,
		},
		"invalid language": {
			userId:      1,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    createMultipartFile(t, "info.json", []byte(`{\n    \"name\": \"cool level\",\n    \"description\": \"hello\",\n    \"author\": 1,\n    \"author_name\": \"Gadzet11\",\n    \"duration\": 100,\n    \"tags\": [\"tag1\", \"tag2\", \"tag3\"],\n    \"language\": \"lol\",\n    \"type\": \"classic\",\n    \"difficulty\": 5,\n    \"image_type\": \"jpg\"\n}`)),
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			levelInfo: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "lol",
				Type:        "classic",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockErr:           nil,
			mockCreateErr:     nil,
			expectedErr:       errors.New(gotype.ErrInvalidInput),
			expectedId:        -1,
			doCallCreateLevel: false,
		},
		"invalid type": {
			userId:      1,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    createMultipartFile(t, "info.json", []byte(`{\n    \"name\": \"cool level\",\n    \"description\": \"hello\",\n    \"author\": 1,\n    \"author_name\": \"Gadzet11\",\n    \"duration\": 100,\n    \"tags\": [\"tag1\", \"tag2\", \"tag3\"],\n    \"language\": \"rus\",\n    \"type\": \"lol\",\n    \"difficulty\": 5,\n    \"image_type\": \"jpg\"\n}`)),
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			levelInfo: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "rus",
				Type:        "lol",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockErr:           nil,
			mockCreateErr:     nil,
			expectedErr:       errors.New(gotype.ErrInvalidInput),
			expectedId:        -1,
			doCallCreateLevel: false,
		},
		"repository error when creating level": {
			userId:      1,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    infoFile,
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			levelInfo: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "rus",
				Type:        "classic",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockErr:           errors.New(gotype.ErrInternal),
			mockCreateErr:     errors.New("db error"),
			expectedErr:       errors.New(gotype.ErrInternal),
			expectedId:        -1,
			doCallCreateLevel: true,
		},
		"error saving level file": {
			userId:      1,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    infoFile,
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			mockLevel: level.Level{
				Author:   1,
				Language: "Go",
				Type:     "Puzzle",
			},
			levelInfo: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "rus",
				Type:        "classic",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockCreateErr:     nil,
			mockErr:           nil,
			expectedErr:       errors.New(gotype.ErrInternal),
			expectedId:        -1,
			saveLevelErr:      errors.New(gotype.ErrInternal),
			doCallCreateLevel: true,
			doSaveLevel:       true,
		},
		"error saving preview file": {
			userId:      1,
			levelFile:   &multipart.FileHeader{Filename: "level.zip"},
			infoFile:    infoFile,
			previewFile: &multipart.FileHeader{Filename: "preview.png"},
			mockLevel: level.Level{
				Author:   1,
				Language: "Go",
				Type:     "Puzzle",
			},
			levelInfo: level.Level{
				Name:        "cool level",
				Description: "hello",
				Author:      1,
				AuthorName:  "Gadzet11",
				Duration:    100,
				Tags:        []string{"tag1", "tag2", "tag3"},
				Language:    "rus",
				Type:        "classic",
				Difficulty:  5,
				ImageType:   "jpg",
			},
			mockCreateErr:     nil,
			mockErr:           nil,
			expectedErr:       errors.New(gotype.ErrInternal),
			expectedId:        -1,
			doCallCreateLevel: true,
			doSaveLevel:       true,
			doSavePreview:     true,
			savePrevErr:       errors.New(gotype.ErrInternal),
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			if tt.doCallCreateLevel {
				mockRepo.On("CreateLevel", tt.levelInfo).Return(tt.previewFile.Filename, tt.levelFile.Filename, tt.mockLevel.Id, tt.mockCreateErr).Once()
			}

			if tt.doSaveLevel {
				mockFileStorage.On("SaveFile", tt.levelFile, gotype.LevelDirName+"/"+tt.levelFile.Filename).Return(tt.saveLevelErr).Once()
			}

			if tt.doSavePreview {
				mockFileStorage.On("SaveFile", tt.previewFile, gotype.PreviewDirName+"/"+tt.previewFile.Filename).Return(tt.savePrevErr).Once()
			}

			if tt.saveLevelErr != nil {
				mockRepo.On("DeleteLevel", mock.Anything).Return(nil).Once()
			}
			if tt.savePrevErr != nil {
				mockRepo.On("DeleteLevel", mock.Anything).Return(nil).Once()
				mockFileStorage.On("DeleteFile", mock.Anything).Return(nil).Once()
			}

			levelId, err := service.CreateLevel(tt.userId, tt.levelFile, tt.infoFile, tt.previewFile)

			if !reflect.DeepEqual(levelId, tt.expectedId) {
				t.Errorf("unexpected levelId: got %v, want %v", levelId, tt.expectedId)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, want %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, want %v", err.Error(), tt.expectedErr.Error())
			}

			mockRepo.AssertExpectations(t)
			mockFileStorage.AssertExpectations(t)
		})
	}
}

func TestUpdateLevel(t *testing.T) {
	mockRepo := new(mocks.Level)
	mockFileStorage := new(mocks.MockFileStorage)
	service := service2.NewLevelService(mockRepo, mockFileStorage)

	infoJSON := `{
		"id": 42,
		"name": "cool level",
		"description": "hello",
		"author": 1
	}`
	infoFile := createMultipartFile(t, "info.json", []byte(infoJSON))
	levelFile := &multipart.FileHeader{Filename: "level.zip"}
	previewFile := &multipart.FileHeader{Filename: "preview.jpg"}

	tests := map[string]struct {
		userId           int
		infoFile         *multipart.FileHeader
		levelFile        *multipart.FileHeader
		previewFile      *multipart.FileHeader
		levelInfo        level.LevelUpdateStruct
		mockGetPathsErr  error
		mockUpdateErr    error
		mockDeleteOldErr error
		saveLevelErr     error
		deletePreviewErr error
		savePreviewErr   error
		expectedErr      error
		expectedId       int
		setupMocks       func()
	}{
		"success": {
			userId:      1,
			infoFile:    infoFile,
			levelFile:   levelFile,
			previewFile: previewFile,
			levelInfo: level.LevelUpdateStruct{
				Id:     42,
				Author: 1,
			},
			expectedErr: nil,
			expectedId:  42,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
				mockRepo.On("UpdateLevel", mock.Anything).Return("level_new.zip", "preview_new.jpg", 42, nil).Once()
				mockFileStorage.On("DeleteFile", "old/path.zip").Return(nil).Once()
				mockFileStorage.On("SaveFile", levelFile, gotype.LevelDirName+"/level_new.zip").Return(nil).Once()
				mockFileStorage.On("DeleteFile", gotype.PreviewDirName+"/preview_new.jpg").Return(nil).Once()
				mockFileStorage.On("SaveFile", previewFile, gotype.PreviewDirName+"/preview_new.jpg").Return(nil).Once()
			},
		},
		"invalid json": {
			userId:      1,
			infoFile:    createMultipartFile(t, "info.json", []byte("invalid")),
			levelFile:   levelFile,
			previewFile: previewFile,
			expectedErr: errors.New(gotype.ErrInvalidInput),
			expectedId:  -1,
		},
		"unauthorized": {
			userId:      2,
			infoFile:    infoFile,
			levelFile:   levelFile,
			previewFile: previewFile,
			levelInfo: level.LevelUpdateStruct{
				Id:     42,
				Author: 1,
			},
			mockGetPathsErr: nil,
			expectedErr:     errors.New(gotype.ErrPermissionDenied),
			expectedId:      -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
			},
		},
		"error getting paths": {
			userId:          1,
			infoFile:        infoFile,
			levelFile:       levelFile,
			previewFile:     previewFile,
			mockGetPathsErr: errors.New("db error"),
			expectedErr:     errors.New("db error"),
			expectedId:      -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(0, "", "", errors.New("db error")).Once()
			},
		},
		"error saving level file": {
			userId:       1,
			infoFile:     infoFile,
			levelFile:    levelFile,
			previewFile:  previewFile,
			saveLevelErr: errors.New(gotype.ErrInternal),
			expectedErr:  errors.New(gotype.ErrInternal),
			expectedId:   -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
				mockRepo.On("UpdateLevel", mock.Anything).Return("level_new.zip", "preview_new.jpg", 42, nil).Once()
				mockFileStorage.On("DeleteFile", "old/path.zip").Return(nil).Once()
				mockFileStorage.On("SaveFile", levelFile, gotype.LevelDirName+"/level_new.zip").Return(errors.New(gotype.ErrInternal)).Once()
				mockRepo.On("DeleteLevel", 42).Return(nil).Once()
				mockFileStorage.On("DeleteFile", gotype.PreviewDirName+"/preview_new.jpg").Return(nil).Once()
			},
		},
		"error saving preview": {
			userId:         1,
			infoFile:       infoFile,
			levelFile:      levelFile,
			previewFile:    previewFile,
			savePreviewErr: errors.New(gotype.ErrInternal),
			expectedErr:    errors.New(gotype.ErrInternal),
			expectedId:     -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
				mockRepo.On("UpdateLevel", mock.Anything).Return("level_new.zip", "preview_new.jpg", 42, nil).Once()
				mockFileStorage.On("DeleteFile", "old/path.zip").Return(nil).Once()
				mockFileStorage.On("SaveFile", levelFile, gotype.LevelDirName+"/level_new.zip").Return(nil).Once()
				mockFileStorage.On("DeleteFile", gotype.PreviewDirName+"/preview_new.jpg").Return(nil).Once()
				mockFileStorage.On("SaveFile", previewFile, gotype.PreviewDirName+"/preview_new.jpg").Return(errors.New(gotype.ErrInternal)).Once()
				mockRepo.On("DeleteLevel", 42).Return(nil).Once()
				mockFileStorage.On("DeleteFile", gotype.LevelDirName+"/level_new.zip").Return(nil).Once()
			},
		},
		"author mismatch": {
			userId:      2,
			infoFile:    infoFile,
			levelFile:   levelFile,
			previewFile: previewFile,
			levelInfo: level.LevelUpdateStruct{
				Id:     42,
				Author: 2,
			},
			expectedErr: errors.New(gotype.ErrPermissionDenied),
			expectedId:  -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
			},
		},

		"error deleting old archive": {
			userId:      1,
			infoFile:    infoFile,
			levelFile:   levelFile,
			previewFile: previewFile,
			expectedErr: errors.New(gotype.ErrInternal),
			expectedId:  -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
				mockRepo.On("UpdateLevel", mock.Anything).Return("level_new.zip", "preview_new.jpg", 42, nil).Once()
				mockFileStorage.On("DeleteFile", "old/path.zip").Return(errors.New("delete error")).Once()
			},
		},

		"error deleting old preview": {
			userId:      1,
			infoFile:    infoFile,
			levelFile:   levelFile,
			previewFile: previewFile,
			expectedErr: errors.New(gotype.ErrInternal),
			expectedId:  -1,
			setupMocks: func() {
				mockRepo.On("GetPathsById", 42).Return(1, "", "old/path.zip", nil).Once()
				mockRepo.On("UpdateLevel", mock.Anything).Return("level_new.zip", "preview_new.jpg", 42, nil).Once()
				mockFileStorage.On("DeleteFile", "old/path.zip").Return(nil).Once()
				mockFileStorage.On("SaveFile", levelFile, gotype.LevelDirName+"/level_new.zip").Return(nil).Once()
				mockFileStorage.On("DeleteFile", gotype.PreviewDirName+"/preview_new.jpg").Return(errors.New("preview delete error")).Once()
			},
		},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			if tt.setupMocks != nil {
				tt.setupMocks()
			}

			id, err := service.UpdateLevel(tt.userId, tt.levelFile, tt.infoFile, tt.previewFile)

			if id != tt.expectedId {
				t.Errorf("expected id %d, got %d", tt.expectedId, id)
			}
			if (err == nil && tt.expectedErr != nil) || (err != nil && tt.expectedErr == nil) {
				t.Errorf("unexpected error: got %v, want %v", err, tt.expectedErr)
			}
			if err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error() {
				t.Errorf("error mismatch: got %v, want %v", err, tt.expectedErr)
			}

			mockRepo.AssertExpectations(t)
			mockFileStorage.AssertExpectations(t)
		})
	}
}
