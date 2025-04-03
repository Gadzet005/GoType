package handler_test

import (
	"bytes"
	handler "github.com/Gadzet005/GoType/backend/internal/handler"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"

	"github.com/stretchr/testify/mock"
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
		"correct repository work": {
			expectedBody:        `{"access_token":"a","refresh_token":"b"}`,
			expectedCode:        http.StatusOK,
			expectedError:       nil,
			mockRetRefreshToken: "b",
			mockRetAccessToken:  "a",
			mockRetErrorError:   nil,
			inputName:           "Alice",
			inputPassword:       "123",
		},
	}

	for name, tc := range tests {
		name, tc := name, tc
		t.Run(name, func(t *testing.T) {
			t.Parallel()
			serv.On("CreateUser", mock.AnythingOfType("domain.User")).Return(tc.mockRetAccessToken, tc.mockRetRefreshToken, tc.mockRetErrorError).Once()

			body := []byte(`{"name": "` + tc.inputName + `", "password": "` + tc.inputPassword + `"}`)
			req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			authHandler.Register(c)

			assert.Equal(t, http.StatusOK, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())

			//if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
			//	t.Errorf("CreateUser returned unexpected error: %v, expected: %v", err, tc.expectedError)
			//}
			//
			//if (tc.expectedError != nil && tc.expectedError.Error() != err.Error()) || tc.expectedRefreshToken != refresh {
			//	t.Errorf("CreateUser returned %v; %v, expected %v; %v", refresh, err.Error(), tc.expectedRefreshToken, tc.expectedError.Error())
			//}
		})
	}

}
