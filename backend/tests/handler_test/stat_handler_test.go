package handler_test

import (
	"bytes"
	"errors"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/service_mocks"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetUsersTop(t *testing.T) {
	serv := mocks.NewMockStats(t)
	statsHandler := handler.NewStat(serv)

	tests := map[string]struct {
		inputBody    string
		mockParam    statistics.StatSortFilterParams
		mockResult   statistics.GetUsersTop
		mockError    error
		expectedCode int
		expectedBody string
	}{
		"successful fetch": {
			inputBody: `{
				"page_info": {"page_size":10, "offset":0},
				"points": "100",
				"category_params": {"category":"C", "pattern":"test"}
			}`,
			mockParam: statistics.StatSortFilterParams{
				PageInfo: statistics.PageInfo{PageSize: 10, Offset: 0},
				Points:   "100",
				CategoryParams: statistics.CategoryParams{
					Category: 'C',
					Pattern:  "test",
				},
			},
			mockResult: statistics.GetUsersTop{
				Res: []statistics.PlayerStats{
					{
						UserId:            1,
						UserName:          "Alice",
						SumPoints:         200,
						NumClassesClassic: [5]int32{1, 2, 3, 4, 5},
						NumPressErrByCharByLang: map[string]map[rune][2]int{
							"en": {'a': {1, 0}},
						},
					},
				},
			},
			mockError:    nil,
			expectedCode: http.StatusOK,
			expectedBody: `{
  "users": [
    {
      "avatar_path": {
        "String": "",
        "Valid": false
      },
      "average_accuracy_classic": 0,
      "average_accuracy_relax": 0,
      "average_delay": 0,
      "num_chars_classic": 0,
      "num_chars_relax": 0,
      "num_classes_classic": [1, 2, 3, 4, 5],
      "num_games_mult": 0,
      "num_level_classic": 0,
      "num_level_relax": 0,
      "num_press_err_by_char_by_lang": {
        "en": {
          "97": [1, 0]
        }
      },
      "sum_points": 200,
      "user_id": 1,
      "user_name": "Alice",
      "win_percentage": 0
    }
  ]
}
`,
		},
		"invalid json": {
			inputBody:    `{this is not valid}`,
			expectedCode: http.StatusBadRequest,
			expectedBody: `{"message":"ERR_INVALID_INPUT"}`,
		},
		"internal error from service": {
			inputBody: `{
				"page_info": {"page_size":5, "offset":2},
				"points": "0",
				"category_params": {"category":"X", "pattern":"any"}
			}`,
			mockParam: statistics.StatSortFilterParams{
				PageInfo: statistics.PageInfo{PageSize: 5, Offset: 2},
				Points:   "0",
				CategoryParams: statistics.CategoryParams{
					Category: 'X',
					Pattern:  "any",
				},
			},
			mockResult:   statistics.GetUsersTop{},
			mockError:    errors.New(gotype.ErrInternal),
			expectedCode: http.StatusInternalServerError,
			expectedBody: `{"message":"ERR_INTERNAL"}`,
		},
	}

	for name, tc := range tests {
		//tc := tc
		t.Run(name, func(t *testing.T) {

			req := httptest.NewRequest(http.MethodPost, "/stats/get-users-top", bytes.NewBufferString(tc.inputBody))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			c, _ := gin.CreateTestContext(w)
			c.Request = req

			if tc.mockError != nil || len(tc.mockResult.Res) > 0 {
				serv.On("GetUsersTop", tc.mockParam).Return(tc.mockResult.Res, tc.mockError).Once()
			}

			statsHandler.GetUsersTop(c)

			assert.Equal(t, tc.expectedCode, w.Code)
			assert.JSONEq(t, tc.expectedBody, w.Body.String())
		})
	}
}

func TestGetUserStats(t *testing.T) {
	type mockBehavior func(s *mocks.Stats, id int)

	tests := []struct {
		name           string
		inputID        string
		mockBehavior   mockBehavior
		expectedStatus int
		expectedBody   string
	}{
		{
			name:    "invalid_id",
			inputID: "not-a-number",
			mockBehavior: func(s *mocks.Stats, id int) {
			},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_INVALID_INPUT"}`,
		},
		{
			name:    "service_error",
			inputID: "42",
			mockBehavior: func(s *mocks.Stats, id int) {
				s.On("GetUserStats", 42).Return(nil, errors.New(gotype.ErrUserNotFound)).Once()
			},
			expectedStatus: http.StatusBadRequest,
			expectedBody:   `{"message":"ERR_NO_SUCH_USER"}`,
		},
		{
			name:    "success",
			inputID: "1",
			mockBehavior: func(s *mocks.Stats, id int) {
				s.On("GetUserStats", 1).Return(statistics.PlayerStats{
					UserName:  "Alice",
					SumPoints: 1234,
				}, nil).Once()
			},
			expectedStatus: http.StatusOK,
			expectedBody: `{
  "user-stats": {
    "avatar_path": {
      "String": "",
      "Valid": false
    },
    "average_accuracy_classic": 0,
    "average_accuracy_relax": 0,
    "average_delay": 0,
    "num_chars_classic": 0,
    "num_chars_relax": 0,
    "num_classes_classic": [0, 0, 0, 0, 0],
    "num_games_mult": 0,
    "num_level_classic": 0,
    "num_level_relax": 0,
    "num_press_err_by_char_by_lang": null,
    "sum_points": 1234,
    "user_id": 0,
    "user_name": "Alice",
    "win_percentage": 0
  }
}
`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := mocks.NewMockStats(t)
			tt.mockBehavior(mockService, 1)

			handler1 := handler.NewStat(mockService)

			router := gin.Default()
			router.GET("/stats/:id", handler1.GetUserStats)

			req := httptest.NewRequest(http.MethodGet, "/stats/"+tt.inputID, nil)
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			require.Equal(t, tt.expectedStatus, w.Code)
			require.JSONEq(t, tt.expectedBody, w.Body.String())
		})
	}
}
