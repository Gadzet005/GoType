package handler_test

import (
	"bytes"
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	handler "github.com/Gadzet005/GoType/backend/internal/handler"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"net/http"
	"net/http/httptest"

	"testing"
)

func TestRegister(t *testing.T) {
	serv := mocks.NewMockAuthorization(t)
	authHandler := handler.NewAuth(serv)

	tests := map[string]struct {
		expectedBody        string
		expectedCode        int
		expectedError       error
		mockRetAccessToken  string
		mockRetRefreshToken string
		mockRetErrorError   error
		inputName           string
		inputPassword       string
	}{
		"correct service work": {
			expectedBody:        `{"access_token":"a","refresh_token":"b"}`,
			expectedCode:        http.StatusOK,
			expectedError:       nil,
			mockRetRefreshToken: "b",
			mockRetAccessToken:  "a",
			mockRetErrorError:   nil,
			inputName:           "Alice",
			inputPassword:       "123",
		},
		"error from service": {
			expectedBody:        `{"message":"ERR_UNAUTHORIZED"}`,
			expectedCode:        http.StatusUnauthorized,
			expectedError:       errors.New(gotype.ErrUnauthorized),
			mockRetRefreshToken: "",
			mockRetAccessToken:  "",
			mockRetErrorError:   errors.New(gotype.ErrUnauthorized),
			inputName:           "Alice",
			inputPassword:       "123",
		},
		"invalid input": {
			expectedBody:        `{"message":"ERR_INVALID_INPUT"}`,
			expectedCode:        http.StatusBadRequest,
			expectedError:       errors.New(gotype.ErrInvalidInput),
			mockRetRefreshToken: "",
			mockRetAccessToken:  "",
			mockRetErrorError:   nil,
			inputName:           "",
			inputPassword:       "",
		},
	}

	for name, tc := range tests {
		//name, tc := name, tc
		t.Run(name, func(t *testing.T) {

			if tc.inputName != "" {
				serv.On("CreateUser", mock.AnythingOfType("domain.User")).Return(tc.mockRetAccessToken, tc.mockRetRefreshToken, tc.mockRetErrorError).Once()
			}

			body := []byte(`{"name": "` + tc.inputName + `", "password": "` + tc.inputPassword + `"}`)
			req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			authHandler.Register(c)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())

		})
	}
}

func TestLogin(t *testing.T) {
	serv := mocks.NewMockAuthorization(t)
	authHandler := handler.NewAuth(serv)

	tests := map[string]struct {
		inputName           string
		inputPassword       string
		mockRetAccessToken  string
		mockRetRefreshToken string
		mockRetError        error
		expectedCode        int
		expectedBody        string
	}{
		"successful login": {
			inputName:           "Bob",
			inputPassword:       "qwerty",
			mockRetAccessToken:  "access123",
			mockRetRefreshToken: "refresh123",
			mockRetError:        nil,
			expectedCode:        http.StatusOK,
			expectedBody:        `{"access_token":"access123","refresh_token":"refresh123"}`,
		},
		"invalid input": {
			inputName:           "",
			inputPassword:       "",
			mockRetAccessToken:  "",
			mockRetRefreshToken: "",
			mockRetError:        errors.New(gotype.ErrInvalidInput),
			expectedCode:        http.StatusBadRequest,
			expectedBody:        `{"message":"ERR_INVALID_INPUT"}`,
		},
		"error from service": {
			inputName:           "Alice",
			inputPassword:       "123",
			mockRetAccessToken:  "",
			mockRetRefreshToken: "",
			mockRetError:        errors.New(gotype.ErrUnauthorized),
			expectedCode:        http.StatusUnauthorized,
			expectedBody:        `{"message":"ERR_UNAUTHORIZED"}`,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {

			if tc.mockRetAccessToken != "" || tc.inputName != "" {
				serv.On("GenerateToken", tc.inputName, tc.inputPassword).
					Return(tc.mockRetRefreshToken, tc.mockRetAccessToken, tc.mockRetError).Once()
			}

			body := []byte(`{"name": "` + tc.inputName + `", "password": "` + tc.inputPassword + `"}`)
			req := httptest.NewRequest(http.MethodPost, "/auth/login", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			authHandler.Login(c)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestRefresh(t *testing.T) {
	serv := mocks.NewMockAuthorization(t)
	authHandler := handler.NewAuth(serv)

	tests := map[string]struct {
		inputAccessToken    string
		inputRefreshToken   string
		mockRetAccessToken  string
		mockRetRefreshToken string
		mockRetError        error
		expectedCode        int
		expectedBody        string
	}{
		"successful refresh": {
			inputAccessToken:    "accessOld",
			inputRefreshToken:   "refreshOld",
			mockRetAccessToken:  "accessNew",
			mockRetRefreshToken: "refreshNew",
			mockRetError:        nil,
			expectedCode:        http.StatusOK,
			expectedBody:        `{"access_token":"accessNew","refresh_token":"refreshNew"}`,
		},
		"expired refresh token": {
			inputAccessToken:    "accessOld",
			inputRefreshToken:   "refreshOld",
			mockRetAccessToken:  "",
			mockRetRefreshToken: "",
			mockRetError:        errors.New(gotype.ErrUnauthorized),
			expectedCode:        http.StatusUnauthorized,
			expectedBody:        `{"message":"ERR_UNAUTHORIZED"}`,
		},
		"invalid input": {
			inputAccessToken:    "",
			inputRefreshToken:   "",
			mockRetAccessToken:  "",
			mockRetRefreshToken: "",
			mockRetError:        errors.New(gotype.ErrInvalidInput),
			expectedCode:        http.StatusBadRequest,
			expectedBody:        `{"message":"ERR_INVALID_INPUT"}`,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {

			if tc.mockRetAccessToken != "" || tc.inputRefreshToken != "" {
				serv.On("GenerateTokenByToken", tc.inputAccessToken, tc.inputRefreshToken).
					Return(tc.mockRetRefreshToken, tc.mockRetAccessToken, tc.mockRetError).Once()
			}

			var body []byte
			if tc.expectedCode != http.StatusBadRequest {
				body = []byte(`{"access_token": "` + tc.inputAccessToken + `", "refresh_token": "` + tc.inputRefreshToken + `"}`)
			} else {
				body = []byte(`{"access_token":1}`)
			}

			req := httptest.NewRequest(http.MethodPost, "/auth/refresh", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			authHandler.Refresh(c)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}
