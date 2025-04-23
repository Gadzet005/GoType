package handler

import (
	"bytes"
	"errors"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	"github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestMaxRequestSize(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := &service.Service{}
	h := handler.NewHandler(service)

	router := gin.New()
	router.Use(h.MaxRequestSize(10)) // very small limit
	router.POST("/upload", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	t.Run("too large request", func(t *testing.T) {
		body := bytes.NewBuffer(make([]byte, 100))
		req := httptest.NewRequest(http.MethodPost, "/upload", body)
		req.Header.Set("Content-Type", "multipart/form-data; boundary=MyBoundary")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusRequestEntityTooLarge, w.Code)
		assert.JSONEq(t, `{"error":"Size of the request is too large"}`, w.Body.String())
	})

	t.Run("non-multipart request", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/upload", strings.NewReader("test data"))
		req.Header.Set("Content-Type", "text/plain")
		w := httptest.NewRecorder()

		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		assert.JSONEq(t, `{"status":"ok"}`, w.Body.String())
	})
}

func TestUserIdentity(t *testing.T) {
	type mockBehavior func(a *mocks.Authorization, token string)

	testCases := []struct {
		name         string
		header       string
		mockBehavior mockBehavior
		expectedCode int
		expectedBody string
	}{
		{
			name:         "missing header",
			header:       "",
			mockBehavior: func(a *mocks.Authorization, token string) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:         "invalid header format",
			header:       "BearerOnly",
			mockBehavior: func(a *mocks.Authorization, token string) {},
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:   "token parse error",
			header: "Bearer token123",
			mockBehavior: func(a *mocks.Authorization, token string) {
				a.On("Parse", token).Return(time.Now().Add(time.Hour), 0, 0, errors.New("ERR_UNAUTHORIZED")).Once()
			},
			expectedCode: http.StatusUnauthorized,
			expectedBody: `{"message":"ERR_UNAUTHORIZED"}`,
		},
		{
			name:   "expired token",
			header: "Bearer token123",
			mockBehavior: func(a *mocks.Authorization, token string) {
				a.On("Parse", token).Return(time.Now().Add(-time.Hour), 1, 1, nil).Once()
			},
			expectedCode: http.StatusUnauthorized,
			expectedBody: `{"message":"ERR_UNAUTHORIZED"}`,
		},
		{
			name:   "success",
			header: "Bearer token123",
			mockBehavior: func(a *mocks.Authorization, token string) {
				a.On("Parse", token).Return(time.Now().Add(time.Hour), 42, 2, nil).Once()
			},
			expectedCode: http.StatusOK,
			expectedBody: `{"status":"ok"}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			gin.SetMode(gin.TestMode)
			auth := mocks.NewMockAuthorization(t)
			service := &service.Service{Authorization: auth}
			h := handler.NewHandler(service)

			router := gin.New()
			router.Use(h.UserIdentity)
			router.GET("/auth", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"status": "ok"})
			})

			req := httptest.NewRequest(http.MethodGet, "/auth", nil)
			if tc.header != "" {
				req.Header.Set("Authorization", tc.header)
			}
			w := httptest.NewRecorder()

			tc.mockBehavior(auth, "token123")
			router.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}
