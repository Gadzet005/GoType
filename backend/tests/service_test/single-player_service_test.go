package service

import (
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/mock"
	"testing"
)

func TestSendResults(t *testing.T) {
	repo := mocks.NewMockSinglePlayerGame(t)
	game := service2.NewSinglePlayerGame(repo)
	
	tests := map[string]struct {
		senderID      int
		inputLC       statistics.LevelComplete
		mockError     error
		expectedError error
	}{
		"success": {
			senderID: 1,
			inputLC: statistics.LevelComplete{
				PlayerId:          1,
				NumPressErrByChar: map[rune][2]int{},
			},
			mockError:     nil,
			expectedError: nil,
		},
		"permission denied": {
			senderID: 2,
			inputLC: statistics.LevelComplete{
				PlayerId:          1,
				NumPressErrByChar: map[rune][2]int{},
			},
			expectedError: errors.New(gotype.ErrPermissionDenied),
		},
		"invalid input - negative error count": {
			senderID: 1,
			inputLC: statistics.LevelComplete{
				PlayerId: 1,
				NumPressErrByChar: map[rune][2]int{
					'a': [2]int{1, -2},
				},
			},
			expectedError: errors.New(gotype.ErrInvalidInput),
		},
		"invalid input - more errors than total": {
			senderID: 1,
			inputLC: statistics.LevelComplete{
				PlayerId: 1,
				NumPressErrByChar: map[rune][2]int{
					'a': [2]int{1, 2},
				},
			},
			expectedError: errors.New(gotype.ErrInvalidInput),
		},
		"repository returns error": {
			senderID: 1,
			inputLC: statistics.LevelComplete{
				PlayerId: 1,
				NumPressErrByChar: map[rune][2]int{
					'a': [2]int{1, 1},
				},
			},
			mockError:     errors.New("repo error"),
			expectedError: errors.New("repo error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.expectedError == nil || tc.mockError != nil {
				totalCount := 0
				totalErr := 0
				for _, nums := range tc.inputLC.NumPressErrByChar {
					totalCount += nums[0]
					totalErr += nums[1]
				}

				repo.On("SendResults", mock.AnythingOfType("LevelComplete"), totalCount, totalErr).
					Return(tc.mockError).Maybe()
			}

			err := game.SendResults(tc.senderID, tc.inputLC)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && tc.expectedError.Error() != err.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}
		})
	}
}
