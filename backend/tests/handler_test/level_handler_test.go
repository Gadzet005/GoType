package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	stat "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	//level "github.com/Gadzet005/GoType/backend/internal/domain/level"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
)

func TestCreateLevel(t *testing.T) {
	type mockBehavior func(s *mocks.Level, userID int, level, info, preview *multipart.FileHeader)

	testCases := []struct {
		name         string
		mockBehavior mockBehavior
		prepareForm  func(*multipart.Writer)
		setUserID    bool
		expectedCode int
		expectedBody string
	}{
		{
			name: "missing user ID",
			prepareForm: func(w *multipart.Writer) {
				w.CreateFormFile("level", "level.txt")
				w.CreateFormFile("info", "info.json")
				w.CreateFormFile("preview", "preview.png")
			},
			setUserID:    false,
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:      "success",
			setUserID: true,
			prepareForm: func(w *multipart.Writer) {
				w.CreateFormFile("level", "level.txt")
				w.CreateFormFile("info", "info.json")
				w.CreateFormFile("preview", "preview.png")
			},
			mockBehavior: func(s *mocks.Level, userID int, level, info, preview *multipart.FileHeader) {
				s.On("CreateLevel", userID, mock.Anything, mock.Anything, mock.Anything).Return(42, nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{"id":42}`,
		},
		{
			name:      "service error",
			setUserID: true,
			prepareForm: func(w *multipart.Writer) {
				w.CreateFormFile("level", "level.txt")
				w.CreateFormFile("info", "info.json")
				w.CreateFormFile("preview", "preview.png")
			},
			mockBehavior: func(s *mocks.Level, userID int, level, info, preview *multipart.FileHeader) {
				s.On("CreateLevel", userID, mock.Anything, mock.Anything, mock.Anything).Return(0, errors.New("ERR_INTERNAL")).Once()
			},
			expectedCode: http.StatusInternalServerError,
			expectedBody: `{"message":"ERR_INTERNAL"}`,
		},
		{
			name:      "missing level file",
			setUserID: true,
			prepareForm: func(w *multipart.Writer) {
				w.CreateFormFile("info", "info.json")
				w.CreateFormFile("preview", "preview.png")
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:      "missing info file",
			setUserID: true,
			prepareForm: func(w *multipart.Writer) {
				w.CreateFormFile("level", "level.txt")
				w.CreateFormFile("preview", "preview.png")
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:      "missing preview file",
			setUserID: true,
			prepareForm: func(w *multipart.Writer) {
				w.CreateFormFile("level", "level.txt")
				w.CreateFormFile("info", "info.json")
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:      "error parsing form",
			setUserID: true,
			prepareForm: func(w *multipart.Writer) {
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			service := mocks.NewMockLevel(t)
			h := handler.NewLevel(service)

			r := gin.New()
			r.POST("/create", func(c *gin.Context) {
				if tc.setUserID {
					c.Set("id", 1)
				}
				h.CreateLevel(c)
			})

			body := &strings.Builder{}
			writer := multipart.NewWriter(body)
			tc.prepareForm(writer)
			writer.Close()

			req := httptest.NewRequest(http.MethodPost, "/create", strings.NewReader(body.String()))
			req.Header.Set("Content-Type", writer.FormDataContentType())
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil {
				tc.mockBehavior(service, 1, nil, nil, nil)
			}

			r.ServeHTTP(w, req)
			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestGetLevel(t *testing.T) {
	type mockBehavior func(s *mocks.Level, levelId int)

	testCases := []struct {
		name          string
		param         string
		mockBehavior  mockBehavior
		expectedCode  int
		expectedError string
	}{
		{
			name:          "invalid param",
			param:         "abc",
			expectedCode:  http.StatusBadRequest,
			expectedError: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:  "not found",
			param: "10",
			mockBehavior: func(s *mocks.Level, levelId int) {
				s.On("CheckLevelExists", levelId).Return("", errors.New("ERR_ENTITY_NOT_FOUND")).Once()
			},
			expectedCode:  http.StatusBadRequest,
			expectedError: `{"message":"ERR_ENTITY_NOT_FOUND"}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			service := new(mocks.Level)
			h := handler.NewLevel(service)

			r := gin.New()
			r.GET("/level/:id", func(c *gin.Context) {
				fmt.Println("Handler called with id:", c.Param("id"))
				h.GetLevel(c)
			})
			req := httptest.NewRequest(http.MethodGet, "/level/"+tc.param, nil)
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil {
				id, _ := strconv.Atoi(tc.param)
				fmt.Println("Calling mock with:", id)
				tc.mockBehavior(service, id)
			}

			r.ServeHTTP(w, req)

			fmt.Println(w.Body.String(), w.Code)

			assert.Equal(t, tc.expectedCode, w.Code)
			if tc.expectedError != "" {
				assert.JSONEq(t, tc.expectedError, w.Body.String())
			} else if tc.expectedCode == http.StatusOK {
				assert.Contains(t, w.Header().Get("Content-Disposition"), "attachment")
			}
		})
	}
}

func TestGetLevelInfoById(t *testing.T) {
	type mockBehavior func(s *mocks.Level, levId int)

	testCases := []struct {
		name         string
		mockBehavior mockBehavior
		levelId      string
		expectedCode int
		expectedBody string
	}{
		{
			name:    "invalid level ID",
			levelId: "invalid_id",
			mockBehavior: func(s *mocks.Level, levId int) {
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:    "level info error",
			levelId: "1",
			mockBehavior: func(s *mocks.Level, levId int) {
				s.On("GetLevelById", levId).Return(level.Level{}, errors.New("ERR_ENTITY_NOT_FOUND")).Once()
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ENTITY_NOT_FOUND"}`,
		},
		{
			name:    "level stats error",
			levelId: "1",
			mockBehavior: func(s *mocks.Level, levId int) {
				s.On("GetLevelById", levId).Return(level.Level{}, nil).Once()
				s.On("GetLevelStats", levId).Return(stat.LevelStats{}, errors.New("ERR_ENTITY_NOT_FOUND")).Once()
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ENTITY_NOT_FOUND"}`,
		},
		{
			name:    "level user top error",
			levelId: "1",
			mockBehavior: func(s *mocks.Level, levId int) {
				s.On("GetLevelById", levId).Return(level.Level{}, nil).Once()
				s.On("GetLevelStats", levId).Return(stat.LevelStats{}, nil).Once()
				s.On("GetLevelUserTop", levId).Return([]stat.UserLevelCompletionInfo{}, errors.New("ERR_ENTITY_NOT_FOUND")).Once()
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ENTITY_NOT_FOUND"}`,
		},
		{
			name:    "success",
			levelId: "1",
			mockBehavior: func(s *mocks.Level, levId int) {
				s.On("GetLevelById", levId).Return(level.Level{}, nil).Once()
				s.On("GetLevelStats", levId).Return(stat.LevelStats{}, nil).Once()
				s.On("GetLevelUserTop", levId).Return([]stat.UserLevelCompletionInfo{}, nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{
  "levelInfo": {
    "author": 0,
    "author_name": "",
    "description": "",
    "difficulty": 0,
    "duration": 0,
    "id": 0,
    "image_type": "",
    "language": "",
    "name": "",
    "preview_path": "",
    "tags": null,
    "type": ""
  },
  "levelStats": {
    "average_acc": 0,
    "average_average_velocity": 0,
    "average_points": 0,
    "max_average_velocity": 0,
    "max_combo": 0,
    "max_points": 0,
    "num_played": 0
  },
  "levelUserTop": []
}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			service := mocks.NewMockLevel(t)
			h := handler.NewLevel(service)

			r := gin.New()
			r.GET("/level/:id", func(c *gin.Context) {
				h.GetLevelInfoById(c)
			})

			req := httptest.NewRequest(http.MethodGet, "/level/"+tc.levelId, nil)
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil {
				id, _ := strconv.Atoi(tc.levelId)
				tc.mockBehavior(service, id)
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestGetLevelList(t *testing.T) {
	type mockBehavior func(s *mocks.Level, fetch level.FetchLevelStruct)

	testCases := []struct {
		name         string
		inputBody    string
		mockBehavior mockBehavior
		expectedCode int
		expectedBody string
	}{
		{
			name:         "invalid json body",
			inputBody:    `invalid_json`,
			mockBehavior: func(s *mocks.Level, fetch level.FetchLevelStruct) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name: "service error",
			inputBody: `{
							"filter_params": {
								"difficulty": 6,
								"language": "",
								"level_name": ""
							},
							"sort_params": {},
							"page_info": {
								"offset": 1,
								"page_size": 12
							},
							"tags": []
						}`,
			mockBehavior: func(s *mocks.Level, fetch level.FetchLevelStruct) {
				s.On("GetLevelList", fetch).Return(nil, errors.New("ERR_INTERNAL")).Once()
			},
			expectedCode: http.StatusInternalServerError,
			expectedBody: `{"message":"ERR_INTERNAL"}`,
		},
		{
			name: "success",
			inputBody: `{
							"filter_params": {
								"difficulty": 6,
								"language": "",
								"level_name": ""
							},
							"sort_params": {},
							"page_info": {
								"offset": 1,
								"page_size": 12
							},
							"tags": []
						}`,
			mockBehavior: func(s *mocks.Level, fetch level.FetchLevelStruct) {
				s.On("GetLevelList", fetch).Return([]level.Level{
					{Id: 1, Name: "Level 1"},
					{Id: 2, Name: "Level 2"},
				}, nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{
							  "levels": [
								{
								  "author": 0,
								  "author_name": "",
								  "description": "",
								  "difficulty": 0,
								  "duration": 0,
								  "id": 1,
								  "image_type": "",
								  "language": "",
								  "name": "Level 1",
								  "preview_path": "",
								  "tags": null,
								  "type": ""
								},
								{
								  "author": 0,
								  "author_name": "",
								  "description": "",
								  "difficulty": 0,
								  "duration": 0,
								  "id": 2,
								  "image_type": "",
								  "language": "",
								  "name": "Level 2",
								  "preview_path": "",
								  "tags": null,
								  "type": ""
								}
							  ]
							}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			service := mocks.NewMockLevel(t)
			h := handler.NewLevel(service)

			router := gin.New()
			router.POST("/levels", func(c *gin.Context) {
				h.GetLevelList(c)
			})

			if tc.mockBehavior != nil {
				var fetch level.FetchLevelStruct
				_ = json.Unmarshal([]byte(tc.inputBody), &fetch)
				tc.mockBehavior(service, fetch)
			}

			req := httptest.NewRequest(http.MethodPost, "/levels", strings.NewReader(tc.inputBody))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestUpdateLevel(t *testing.T) {
	type mockBehavior func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader)

	testCases := []struct {
		name         string
		setupContext func(c *gin.Context)
		mockBehavior mockBehavior
		expectedCode int
		expectedBody string
		skipFiles    bool
	}{
		{
			name: "missing files",
			setupContext: func(c *gin.Context) {
				c.Set("userId", 1)
			},
			mockBehavior: func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
			skipFiles:    true,
		},
		{
			name:         "missing userId in context",
			setupContext: func(c *gin.Context) {},
			mockBehavior: func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "service error",
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader) {
				s.On("UpdateLevel", userId, mock.Anything, mock.Anything, mock.Anything).Return(0, errors.New("ERR_INTERNAL")).Once()
			},
			expectedCode: http.StatusInternalServerError,
			expectedBody: `{"message":"ERR_INTERNAL"}`,
		},
		{
			name: "success",
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader) {
				s.On("UpdateLevel", userId, mock.Anything, mock.Anything, mock.Anything).Return(42, nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{"id": 42}`,
		},
		{
			name: "missing info file",
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
			skipFiles:    false,
		},
		{
			name: "missing preview file",
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.Level, userId int, level, info, preview *multipart.FileHeader) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
			skipFiles:    false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			service := mocks.NewMockLevel(t)
			h := handler.NewLevel(service)

			router := gin.New()
			router.POST("/update", func(c *gin.Context) {
				tc.setupContext(c)
				h.UpdateLevel(c)
			})

			body := &bytes.Buffer{}
			writer := multipart.NewWriter(body)

			if !tc.skipFiles {
				if tc.name != "missing info file" {
					writer.CreateFormFile("info", "info.json")
				}
				if tc.name != "missing preview file" {
					writer.CreateFormFile("preview", "preview.png")
				}
				if tc.name != "missing info file" && tc.name != "missing preview file" {
					writer.CreateFormFile("level", "level.dat")
				}
			}
			writer.Close()

			req := httptest.NewRequest(http.MethodPost, "/update", body)
			req.Header.Set("Content-Type", writer.FormDataContentType())
			w := httptest.NewRecorder()

			tc.mockBehavior(service, 1, nil, nil, nil) // you can pass `mock.Anything` or keep `nil` depending on use

			router.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}
