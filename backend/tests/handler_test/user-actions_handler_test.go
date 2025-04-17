package handler

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestLogout(t *testing.T) {
	cases := []struct {
		name         string
		userId       interface{}
		setUser      bool
		mockError    error
		expectedCode int
	}{
		{
			name:         "missing user id",
			setUser:      false,
			expectedCode: http.StatusBadRequest,
		},
		{
			name:         "logout success",
			userId:       1,
			setUser:      true,
			mockError:    nil,
			expectedCode: http.StatusOK,
		},
		{
			name:         "logout error",
			userId:       1,
			setUser:      true,
			mockError:    errors.New(gotype.ErrInternal),
			expectedCode: gotype.CodeErrors[gotype.ErrInternal],
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			mockService := new(mocks.UserActions)
			h := handler.NewUserActions(mockService)
			if tc.setUser {
				mockService.On("DropRefreshToken", tc.userId).Return(tc.mockError)
			}

			r := gin.New()
			r.POST("/logout", func(c *gin.Context) {
				if tc.setUser {
					c.Set("id", tc.userId)
				}
				h.Logout(c)
			})

			req := httptest.NewRequest(http.MethodPost, "/logout", nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
		})
	}
}

func TestGetUserInfo(t *testing.T) {
	mockService := new(mocks.UserActions)
	h := handler.NewUserActions(mockService)

	r := gin.New()
	r.GET("/user-actions/get-user-info", func(c *gin.Context) {
		c.Set("id", 1)
		h.GetUserInfo(c)
	})

	mockService.On("GetUserById", 1).Return("Alice", 1, time.Time{}, "", sql.NullString{"", false}, nil)

	req := httptest.NewRequest(http.MethodGet, "/user-actions/get-user-info", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	mockService.On("GetUserById", 2).Return("", 0, time.Time{}, "", sql.NullString{"", false}, errors.New(gotype.ErrUserNotFound))
	r.GET("/user-actions/get-user-info/fail", func(c *gin.Context) {
		c.Set("id", 2)
		h.GetUserInfo(c)
	})

	req = httptest.NewRequest(http.MethodGet, "/user-actions/get-user-info/fail", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, gotype.CodeErrors[gotype.ErrUserNotFound], w.Code)
}

func TestWriteUserComplaint(t *testing.T) {
	mockService := new(mocks.UserActions)
	h := handler.NewUserActions(mockService)

	r := gin.New()
	r.POST("/user-actions/write-user-complaint", h.WriteUserComplaint)

	validInput := complaints.UserComplaint{
		Reason:   "Cheating",
		Message:  "Suspected cheating",
		UserId:   42,
		AuthorId: 1,
	}
	body, _ := json.Marshal(validInput)
	mockService.On("CreateUserComplaint", validInput).Return(nil).Once()

	req := httptest.NewRequest(http.MethodPost, "/user-actions/write-user-complaint", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	invalidReasonInput := complaints.UserComplaint{
		Reason:   "NotARealReason",
		Message:  "Test",
		UserId:   1,
		AuthorId: 1,
	}
	body, _ = json.Marshal(invalidReasonInput)
	req = httptest.NewRequest(http.MethodPost, "/user-actions/write-user-complaint", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	brokenJSON := []byte(`{"invalid`)
	req = httptest.NewRequest(http.MethodPost, "/user-actions/write-user-complaint", bytes.NewBuffer(brokenJSON))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	internalErrorInput := complaints.UserComplaint{
		Reason:   "Cheating",
		Message:  "This should trigger internal error",
		UserId:   42,
		AuthorId: 1,
	}
	body, _ = json.Marshal(internalErrorInput)

	mockService.On("CreateUserComplaint", internalErrorInput).Return(errors.New(gotype.ErrInternal)).Once()
	req = httptest.NewRequest(http.MethodPost, "/user-actions/write-user-complaint", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, gotype.CodeErrors[gotype.ErrInternal], w.Code)
}

func TestWriteLevelComplaint(t *testing.T) {
	mockService := new(mocks.UserActions)
	h := handler.NewUserActions(mockService)

	r := gin.New()
	r.POST("/user-actions/write-level-complaint", h.WriteLevelComplaint)

	validInput := complaints.LevelComplaint{
		Reason:   "Offencive name",
		Message:  "Suspected cheating",
		LevelId:  42,
		AuthorId: 1,
	}
	body, _ := json.Marshal(validInput)
	mockService.On("CreateLevelComplaint", validInput).Return(nil).Once()

	req := httptest.NewRequest(http.MethodPost, "/user-actions/write-level-complaint", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)

	invalidReasonInput := complaints.LevelComplaint{
		Reason:   "NotARealReason",
		Message:  "Test",
		LevelId:  1,
		AuthorId: 1,
	}
	body, _ = json.Marshal(invalidReasonInput)
	req = httptest.NewRequest(http.MethodPost, "/user-actions/write-level-complaint", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	brokenJSON := []byte(`{"invalid`)
	req = httptest.NewRequest(http.MethodPost, "/user-actions/write-level-complaint", bytes.NewBuffer(brokenJSON))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)

	internalErrorInput := complaints.LevelComplaint{
		Reason:   "Offencive name",
		Message:  "This should trigger internal error",
		LevelId:  42,
		AuthorId: 1,
	}
	body, _ = json.Marshal(internalErrorInput)

	mockService.On("CreateLevelComplaint", internalErrorInput).Return(errors.New(gotype.ErrInternal)).Once()
	req = httptest.NewRequest(http.MethodPost, "/user-actions/write-level-complaint", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	assert.Equal(t, gotype.CodeErrors[gotype.ErrInternal], w.Code)
}

func TestChangeAvatar(t *testing.T) {
	mockService := new(mocks.UserActions)
	h := handler.NewUserActions(mockService)

	router := gin.New()
	router.POST("/user-actions/change-avatar", func(c *gin.Context) {
		c.Set("id", 1)
		h.ChangeAvatar(c)
	})

	t.Run("no userId in context", func(t *testing.T) {
		routerNoCtx := gin.New()
		routerNoCtx.POST("/user-actions/change-avatar", h.ChangeAvatar)

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)

		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/user-actions/change-avatar", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		w := httptest.NewRecorder()
		routerNoCtx.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("userId is not int", func(t *testing.T) {
		routerBadCtx := gin.New()
		routerBadCtx.POST("/user-actions/change-avatar", func(c *gin.Context) {
			c.Set("id", "not-an-int")
			h.ChangeAvatar(c)
		})

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/user-actions/change-avatar", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		w := httptest.NewRecorder()
		routerBadCtx.ServeHTTP(w, req)

		assert.Equal(t, http.StatusBadRequest, w.Code)
	})

	t.Run("no file uploaded (missing file)", func(t *testing.T) {
		mockService.On("UpdateAvatar", 1, (*multipart.FileHeader)(nil)).Return(nil).Once()

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/user-actions/change-avatar", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("UpdateAvatar returns error with nil file", func(t *testing.T) {
		mockService.On("UpdateAvatar", 1, (*multipart.FileHeader)(nil)).Return(errors.New(gotype.ErrInternal)).Once()

		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/user-actions/change-avatar", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, gotype.CodeErrors[gotype.ErrInternal], w.Code)
	})

	t.Run("successful upload with file", func(t *testing.T) {
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)

		part, _ := writer.CreateFormFile("avatar", "avatar.png")
		part.Write([]byte("fake image data"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/user-actions/change-avatar", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		_, fileHeader, _ := req.FormFile("avatar")
		mockService.On("UpdateAvatar", 1, fileHeader).Return(nil).Once()

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
	})

	t.Run("upload with file but service error", func(t *testing.T) {
		body := &bytes.Buffer{}
		writer := multipart.NewWriter(body)

		part, _ := writer.CreateFormFile("avatar", "avatar.png")
		part.Write([]byte("fake image data"))
		writer.Close()

		req := httptest.NewRequest(http.MethodPost, "/user-actions/change-avatar", body)
		req.Header.Set("Content-Type", writer.FormDataContentType())

		_, fileHeader, _ := req.FormFile("avatar")
		mockService.On("UpdateAvatar", 1, fileHeader).Return(errors.New(gotype.ErrInternal)).Once()

		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, gotype.CodeErrors[gotype.ErrInternal], w.Code)
	})
}
