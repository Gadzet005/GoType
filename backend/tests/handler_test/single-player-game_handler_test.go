package handler

import (
	"bytes"
	"encoding/json"
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSendResults(t *testing.T) {
	gin.SetMode(gin.TestMode)

	type mockBehavior func(s *mocks.SinglePlayer, userID int, input statistics.LevelComplete)

	testCases := []struct {
		name               string
		userID             interface{}
		mockBehavior       mockBehavior
		input              statistics.LevelCompleteJSON
		setupContext       func(c *gin.Context)
		expectedStatusCode int
		expectedBody       string
	}{
		{
			name:   "no user id in context",
			userID: nil,
			mockBehavior: func(s *mocks.SinglePlayer, userID int, input statistics.LevelComplete) {
			},
			input: statistics.LevelCompleteJSON{},
			setupContext: func(c *gin.Context) {
			},
			expectedStatusCode: http.StatusBadRequest,
			expectedBody:       `{"message":"ERR_ACCESS_TOKEN_WRONG"}`,
		},
		{
			name:   "invalid json",
			userID: 1,
			mockBehavior: func(s *mocks.SinglePlayer, userID int, input statistics.LevelComplete) {
			},
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			input:              statistics.LevelCompleteJSON{},
			expectedStatusCode: http.StatusBadRequest,
			expectedBody:       `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:   "service returns error",
			userID: 1,
			input: statistics.LevelCompleteJSON{
				LevelId:         1,
				PlayerId:        1,
				Time:            120,
				Accuracy:        0.95,
				AverageVelocity: 5.2,
				MaxCombo:        10,
				Placement:       2,
				Points:          100,
				NumPressErrByChar: map[string][2]int{
					"a": {1, 0},
				},
			},
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.SinglePlayer, userID int, input statistics.LevelComplete) {
				s.On("SendResults", userID, input).Return(errors.New(gotype.ErrInternal)).Once()
			},
			expectedStatusCode: http.StatusInternalServerError,
			expectedBody:       `{"message":"ERR_INTERNAL"}`,
		},
		{
			name:   "success",
			userID: 1,
			input: statistics.LevelCompleteJSON{
				LevelId:         1,
				PlayerId:        1,
				Time:            120,
				Accuracy:        0.95,
				AverageVelocity: 5.2,
				MaxCombo:        10,
				Placement:       2,
				Points:          100,
				NumPressErrByChar: map[string][2]int{
					"a": {1, 0},
				},
			},
			setupContext: func(c *gin.Context) {
				c.Set("id", 1)
			},
			mockBehavior: func(s *mocks.SinglePlayer, userID int, input statistics.LevelComplete) {
				s.On("SendResults", userID, input).Return(nil).Once()
			},
			expectedStatusCode: http.StatusOK,
			expectedBody:       `{}`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			service := new(mocks.SinglePlayer)
			handlerObj := handler.NewSinglePlayer(service)

			router := gin.New()
			router.POST("/send", func(c *gin.Context) {
				if tc.setupContext != nil {
					tc.setupContext(c)
				}
				handlerObj.SendResults(c)
			})

			var reqBody []byte
			if tc.name == "invalid json" {
				reqBody = []byte(`{"invalid":`)
			} else {
				reqBody, _ = json.Marshal(tc.input)
			}

			req, _ := http.NewRequest(http.MethodPost, "/send", bytes.NewBuffer(reqBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()

			if tc.mockBehavior != nil {
				converted := handler.ConvertLevelCompleteJSONToLevelComplete(tc.input)
				tc.mockBehavior(service, 1, converted)
			}

			router.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedStatusCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}
