package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	bans "github.com/Gadzet005/GoType/backend/internal/domain/Bans"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	useraccess "github.com/Gadzet005/GoType/backend/internal/domain/UserAccess"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strconv"
	"testing"
)

func TestBanUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	type mockBehavior func(s *mocks.Admin, access int, input bans.UserBan)

	tests := []struct {
		name         string
		access       interface{}
		setupContext func(c *gin.Context)
		mockBehavior mockBehavior
		input        bans.UserBan
		expectedCode int
		expectedBody string
	}{
		{
			name:         "no access in context",
			access:       nil,
			setupContext: func(c *gin.Context) {},
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserBan) {},
			input:        bans.UserBan{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid json",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1) },
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserBan) {},
			input:        bans.UserBan{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:         "service error",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1) },
			input:        bans.UserBan{Id: 2, BanReason: "cheating", BanTime: "1"},
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserBan) {
				s.On("TryBanUser", access, input).Return(errors.New(gotype.ErrPermissionDenied)).Once()
			},
			expectedCode: http.StatusForbidden,
			expectedBody: `{"message":"ERR_PERMISSION_DENIED"}`,
		},
		{
			name:         "success",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.UserBan{Id: 2, BanReason: "cheating", BanTime: "1"},
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserBan) {
				s.On("TryBanUser", access, input).Return(nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)
			r := gin.New()

			r.POST("/ban", func(c *gin.Context) {
				if tc.setupContext != nil {
					tc.setupContext(c)
				}
				h.BanUser(c)
			})

			var reqBody []byte
			if tc.name == "invalid json" {
				reqBody = []byte(`{"broken":`)
			} else {
				reqBody, _ = json.Marshal(tc.input)
			}

			req, _ := http.NewRequest(http.MethodPost, "/ban", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil && tc.access != nil {
				tc.mockBehavior(service, tc.access.(int), tc.input)
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestUnbanUser(t *testing.T) {
	gin.SetMode(gin.TestMode)

	type mockBehavior func(s *mocks.Admin, access int, input bans.UserUnban)

	tests := []struct {
		name         string
		access       interface{}
		setupContext func(c *gin.Context)
		mockBehavior mockBehavior
		input        bans.UserUnban
		expectedCode int
		expectedBody string
	}{
		{
			name:         "no access in context",
			access:       nil,
			setupContext: func(c *gin.Context) {},
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserUnban) {},
			input:        bans.UserUnban{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid json",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserUnban) {},
			input:        bans.UserUnban{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:         "service error",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.UserUnban{Id: 2},
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserUnban) {
				s.On("TryUnbanUser", access, input).Return(errors.New(gotype.ErrPermissionDenied)).Once()
			},
			expectedCode: http.StatusForbidden,
			expectedBody: `{"message":"ERR_PERMISSION_DENIED"}`,
		},
		{
			name:         "success",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.UserUnban{Id: 2},
			mockBehavior: func(s *mocks.Admin, access int, input bans.UserUnban) {
				s.On("TryUnbanUser", access, input).Return(nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)
			r := gin.New()

			r.POST("/unban", func(c *gin.Context) {
				if tc.setupContext != nil {
					tc.setupContext(c)
				}
				h.UnbanUser(c)
			})

			var reqBody []byte
			if tc.name == "invalid json" {
				reqBody = []byte(`{"broken":`)
			} else {
				reqBody, _ = json.Marshal(tc.input)
			}

			req, _ := http.NewRequest(http.MethodPost, "/unban", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil && tc.access != nil {
				tc.mockBehavior(service, tc.access.(int), tc.input)
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestBanLevel(t *testing.T) {
	gin.SetMode(gin.TestMode)

	type mockBehavior func(s *mocks.Admin, access int, input bans.LevelBan)

	tests := []struct {
		name         string
		access       interface{}
		setupContext func(c *gin.Context)
		mockBehavior mockBehavior
		input        bans.LevelBan
		expectedCode int
		expectedBody string
	}{
		{
			name:         "no access in context",
			access:       nil,
			setupContext: func(c *gin.Context) {},
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {},
			input:        bans.LevelBan{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid json",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {},
			input:        bans.LevelBan{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:         "service error",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.LevelBan{Id: 2},
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {
				s.On("TryBanLevel", access, input).Return(errors.New(gotype.ErrPermissionDenied)).Once()
			},
			expectedCode: http.StatusForbidden,
			expectedBody: `{"message":"ERR_PERMISSION_DENIED"}`,
		},
		{
			name:         "success",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.LevelBan{Id: 2},
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {
				s.On("TryBanLevel", access, input).Return(nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)
			r := gin.New()

			r.POST("/ban", func(c *gin.Context) {
				if tc.setupContext != nil {
					tc.setupContext(c)
				}
				h.BanLevel(c)
			})

			var reqBody []byte
			if tc.name == "invalid json" {
				reqBody = []byte(`{"broken":`)
			} else {
				reqBody, _ = json.Marshal(tc.input)
			}

			req, _ := http.NewRequest(http.MethodPost, "/ban", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil && tc.access != nil {
				tc.mockBehavior(service, tc.access.(int), tc.input)
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestUnbanLevel(t *testing.T) {
	gin.SetMode(gin.TestMode)

	type mockBehavior func(s *mocks.Admin, access int, input bans.LevelBan)

	tests := []struct {
		name         string
		access       interface{}
		setupContext func(c *gin.Context)
		mockBehavior mockBehavior
		input        bans.LevelBan
		expectedCode int
		expectedBody string
	}{
		{
			name:         "no access in context",
			access:       nil,
			setupContext: func(c *gin.Context) {},
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {},
			input:        bans.LevelBan{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid json",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {},
			input:        bans.LevelBan{},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:         "service error",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.LevelBan{Id: 2},
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {
				s.On("TryUnbanLevel", access, input).Return(errors.New(gotype.ErrPermissionDenied)).Once()
			},
			expectedCode: http.StatusForbidden,
			expectedBody: `{"message":"ERR_PERMISSION_DENIED"}`,
		},
		{
			name:         "success",
			access:       1,
			setupContext: func(c *gin.Context) { c.Set("Access", 1); c.Set("id", 1) },
			input:        bans.LevelBan{Id: 2},
			mockBehavior: func(s *mocks.Admin, access int, input bans.LevelBan) {
				s.On("TryUnbanLevel", access, input).Return(nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)
			r := gin.New()

			r.POST("/unban", func(c *gin.Context) {
				if tc.setupContext != nil {
					tc.setupContext(c)
				}
				h.UnbanLevel(c)
			})

			var reqBody []byte
			if tc.name == "invalid json" {
				reqBody = []byte(`{"broken":`)
			} else {
				reqBody, _ = json.Marshal(tc.input)
			}

			req, _ := http.NewRequest(http.MethodPost, "/unban", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil && tc.access != nil {
				tc.mockBehavior(service, tc.access.(int), tc.input)
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestChangeUserAccess(t *testing.T) {
	gin.SetMode(gin.TestMode)

	type mockBehavior func(s *mocks.Admin, userID int, input useraccess.ChangeUserAccess)

	tests := []struct {
		name         string
		userID       interface{}
		input        interface{}
		mockBehavior mockBehavior
		setupContext func(c *gin.Context)
		expectedCode int
		expectedBody string
	}{
		{
			name:         "missing user id",
			userID:       nil,
			input:        useraccess.ChangeUserAccess{},
			mockBehavior: func(s *mocks.Admin, userID int, input useraccess.ChangeUserAccess) {},
			setupContext: func(c *gin.Context) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid json",
			userID:       1,
			input:        nil,
			mockBehavior: func(s *mocks.Admin, userID int, input useraccess.ChangeUserAccess) {},
			setupContext: func(c *gin.Context) {
				c.Set("Access", 1)
				c.Set("id", 1)
			},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:   "service returns error",
			userID: 1,
			input: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: 3,
			},
			setupContext: func(c *gin.Context) {
				c.Set("Access", 1)
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.Admin, userID int, input useraccess.ChangeUserAccess) {
				s.On("TryChangeAccessLevel", userID, input).Return(errors.New(gotype.ErrPermissionDenied)).Once()
			},
			expectedCode: http.StatusForbidden,
			expectedBody: `{"message":"ERR_PERMISSION_DENIED"}`,
		},
		{
			name:   "success",
			userID: 1,
			input: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: 3,
			},
			setupContext: func(c *gin.Context) {
				c.Set("Access", 1)
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.Admin, userID int, input useraccess.ChangeUserAccess) {
				s.On("TryChangeAccessLevel", userID, input).Return(nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{}`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			service := new(mocks.Admin)
			handlerObj := handler.NewAdmin(service)

			r := gin.New()
			r.POST("/change", func(c *gin.Context) {
				if tt.setupContext != nil {
					tt.setupContext(c)
				}
				handlerObj.ChangeUserAccess(c)
			})

			var reqBody []byte
			if tt.name == "invalid json" {
				reqBody = []byte(`{"bad json"`)
			} else {
				reqBody, _ = json.Marshal(tt.input)
			}

			req, _ := http.NewRequest(http.MethodPost, "/change", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()

			if tt.mockBehavior != nil && tt.userID != nil && tt.input != nil {
				tt.mockBehavior(service, tt.userID.(int), tt.input.(useraccess.ChangeUserAccess))
			}

			r.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedCode, w.Code)
			assert.JSONEq(t, tt.expectedBody, w.Body.String())
		})
	}
}

func TestGetUserComplaints(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		setContext     func(c *gin.Context)
		mockBehavior   func(s *mocks.Admin)
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "no access context",
			setContext:     func(c *gin.Context) {},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "no id context",
			setContext: func(c *gin.Context) {
				c.Set("Access", 1)
			},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "service error",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			mockBehavior: func(s *mocks.Admin) {
				s.On("GetUserComplaints", 3, 2).Return(nil, errors.New(gotype.ErrInternal)).Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectedBody:   `{"message":"ERR_INTERNAL"}`,
		},
		{
			name: "success",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			mockBehavior: func(s *mocks.Admin) {
				s.On("GetUserComplaints", 3, 2).Return([]complaints.UserComplaint{}, nil).Once()
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"user_complaints":[]}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)

			r := gin.New()
			r.GET("/complaints", func(c *gin.Context) {
				tc.setContext(c)
				h.GetUserComplaints(c)
			})

			tc.mockBehavior(service)

			req, _ := http.NewRequest(http.MethodGet, "/complaints", nil)
			w := httptest.NewRecorder()

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedStatus, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestProcessUserComplaint(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		setContext     func(c *gin.Context)
		inputBody      interface{}
		mockBehavior   func(s *mocks.Admin)
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "missing access",
			setContext:     func(c *gin.Context) {},
			inputBody:      complaints.ComplaintID{Id: 1},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:           "missing id",
			setContext:     func(c *gin.Context) { c.Set("Access", 1) },
			inputBody:      complaints.ComplaintID{Id: 1},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "invalid json",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			inputBody:      `{"id":`,
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name: "service error",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			inputBody: complaints.ComplaintID{Id: 5},
			mockBehavior: func(s *mocks.Admin) {
				s.On("ProcessUserComplaint", 3, 2, 5).Return(errors.New(gotype.ErrInternal)).Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectedBody:   `{"message":"ERR_INTERNAL"}`,
		},
		{
			name: "success",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			inputBody: complaints.ComplaintID{Id: 6},
			mockBehavior: func(s *mocks.Admin) {
				s.On("ProcessUserComplaint", 3, 2, 6).Return(nil).Once()
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)

			r := gin.New()
			r.POST("/process", func(c *gin.Context) {
				tc.setContext(c)
				h.ProcessUserComplaint(c)
			})

			var bodyBytes []byte
			if str, ok := tc.inputBody.(string); ok {
				bodyBytes = []byte(str)
			} else {
				bodyBytes, _ = json.Marshal(tc.inputBody)
			}

			req, _ := http.NewRequest(http.MethodPost, "/process", bytes.NewBuffer(bodyBytes))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			tc.mockBehavior(service)

			r.ServeHTTP(w, req)
			assert.Equal(t, tc.expectedStatus, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestGetLevelComplaints(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		setContext     func(c *gin.Context)
		mockBehavior   func(s *mocks.Admin)
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "no access context",
			setContext:     func(c *gin.Context) {},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "no id context",
			setContext: func(c *gin.Context) {
				c.Set("Access", 1)
			},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "service error",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			mockBehavior: func(s *mocks.Admin) {
				s.On("GetLevelComplaints", 3, 2).Return(nil, errors.New(gotype.ErrInternal)).Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectedBody:   `{"message":"ERR_INTERNAL"}`,
		},
		{
			name: "success",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			mockBehavior: func(s *mocks.Admin) {
				s.On("GetLevelComplaints", 3, 2).Return([]complaints.LevelComplaint{}, nil).Once()
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{"level_complaints":[]}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)

			r := gin.New()
			r.GET("/complaints", func(c *gin.Context) {
				tc.setContext(c)
				h.GetLevelComplaints(c)
			})

			tc.mockBehavior(service)

			req, _ := http.NewRequest(http.MethodGet, "/complaints", nil)
			w := httptest.NewRecorder()

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedStatus, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestProcessLevelComplaint(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name           string
		setContext     func(c *gin.Context)
		inputBody      interface{}
		mockBehavior   func(s *mocks.Admin)
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "missing access",
			setContext:     func(c *gin.Context) {},
			inputBody:      complaints.ComplaintID{Id: 1},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:           "missing id",
			setContext:     func(c *gin.Context) { c.Set("Access", 1) },
			inputBody:      complaints.ComplaintID{Id: 1},
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name: "invalid json",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			inputBody:      `{"id":`,
			mockBehavior:   func(s *mocks.Admin) {},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name: "service error",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			inputBody: complaints.ComplaintID{Id: 5},
			mockBehavior: func(s *mocks.Admin) {
				s.On("ProcessLevelComplaint", 3, 2, 5).Return(errors.New(gotype.ErrInternal)).Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectedBody:   `{"message":"ERR_INTERNAL"}`,
		},
		{
			name: "success",
			setContext: func(c *gin.Context) {
				c.Set("Access", 2)
				c.Set("id", 3)
			},
			inputBody: complaints.ComplaintID{Id: 6},
			mockBehavior: func(s *mocks.Admin) {
				s.On("ProcessLevelComplaint", 3, 2, 6).Return(nil).Once()
			},
			expectedStatus: http.StatusOK,
			expectedBody:   `{}`,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.Admin)
			h := handler.NewAdmin(service)

			r := gin.New()
			r.POST("/process", func(c *gin.Context) {
				tc.setContext(c)
				h.ProcessLevelComplaint(c)
			})

			var bodyBytes []byte
			if str, ok := tc.inputBody.(string); ok {
				bodyBytes = []byte(str)
			} else {
				bodyBytes, _ = json.Marshal(tc.inputBody)
			}

			req, _ := http.NewRequest(http.MethodPost, "/process", bytes.NewBuffer(bodyBytes))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			tc.mockBehavior(service)

			r.ServeHTTP(w, req)
			assert.Equal(t, tc.expectedStatus, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestAdmin_GetUsers(t *testing.T) {
	type mockBehavior func(s *mocks.Admin, access int, input user.UserSearchParams)

	testCases := []struct {
		name         string
		access       interface{}
		query        string
		mockBehavior mockBehavior
		expectedCode int
		expectedBody string
	}{
		{
			name:         "missing access",
			access:       nil,
			query:        "",
			mockBehavior: func(s *mocks.Admin, access int, input user.UserSearchParams) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid query params",
			access:       2,
			query:        "%gh=bad",
			mockBehavior: func(s *mocks.Admin, access int, input user.UserSearchParams) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:   "service error",
			access: 2,
			query:  "name=test&is_banned=false&page_size=10&offset=0",
			mockBehavior: func(s *mocks.Admin, access int, input user.UserSearchParams) {
				s.On("GetUsers", access, input).Return(nil, errors.New("ERR_INTERNAL")).Once()
			},
			expectedCode: http.StatusInternalServerError,
			expectedBody: `{"message":"ERR_INTERNAL"}`,
		},
		{
			name:   "success",
			access: 2,
			query:  "name=test&is_banned=false&page_size=10&offset=0",
			mockBehavior: func(s *mocks.Admin, access int, input user.UserSearchParams) {
				s.On("GetUsers", access, input).Return([]user.UserInfo{{Id: 1, Name: "Test User", Access: 1}}, nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{"users":[{"id":1, "name":"Test User","access":1, "ban_reason":""}]}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			svc := new(mocks.Admin)
			h := handler.NewAdmin(svc)

			r := gin.New()
			r.GET("/users", func(c *gin.Context) {
				if tc.access != nil {
					c.Set("Access", tc.access)
				}
				h.GetUsers(c)
			})

			u := "/users"
			if tc.query != "" {
				u += "?" + tc.query
			}

			req := httptest.NewRequest(http.MethodGet, u, nil)
			w := httptest.NewRecorder()

			if tc.mockBehavior != nil && tc.access != nil && tc.query != "%gh=bad" {
				values, _ := url.ParseQuery(tc.query)
				pageSize, _ := strconv.Atoi(values.Get("page_size"))
				offset, _ := strconv.Atoi(values.Get("offset"))
				params := user.UserSearchParams{
					Name:     values.Get("name"),
					IsBanned: values.Get("is_banned") == "true",
					PageSize: pageSize,
					Offset:   offset,
				}
				tc.mockBehavior(svc, tc.access.(int), params)
			}

			fmt.Println("LOL: ", req.URL.String())

			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}
