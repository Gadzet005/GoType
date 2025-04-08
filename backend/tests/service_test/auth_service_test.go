package service_test

import (
	"errors"
	"fmt"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/mock"
	"github.com/swaggo/swag/testdata/enums/types"
	"testing"
)

func TestCreateUser(t *testing.T) {
	repo := mocks.NewMockAuthorization(t)
	authService := service2.NewAuthService(repo)

	tests := map[string]struct {
		expectedRefreshToken string
		expectedError        error
		mockRetRefreshToken  string
		mockRetErrorError    error
		inputName            string
		inputPassword        string
	}{
		"correct repository work": {
			expectedRefreshToken: "a",
			expectedError:        nil,
			mockRetRefreshToken:  "a",
			mockRetErrorError:    nil,
			inputName:            "a",
			inputPassword:        "a",
		},
		"repository worked with error": {
			expectedRefreshToken: "",
			expectedError:        errors.New("error while creating user"),
			mockRetRefreshToken:  "aaa",
			mockRetErrorError:    errors.New("error while creating user"),
			inputName:            "b",
			inputPassword:        "b",
		},
	}

	for name, tc := range tests {

		//name, tc := name, tc
		t.Run(name, func(t *testing.T) {
			//t.Parallel()
			repo.On("CreateUser", mock.AnythingOfType("domain.User")).Return(0, 1, tc.mockRetRefreshToken, tc.mockRetErrorError).Once()
			_, refresh, err := authService.CreateUser(user.User{Password: tc.inputPassword, Name: tc.inputName})

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("CreateUser returned unexpected error: %v, expected: %v", err, tc.expectedError)
			}

			if (tc.expectedError != nil && tc.expectedError.Error() != err.Error()) || tc.expectedRefreshToken != refresh {
				t.Errorf("CreateUser returned %v; %v, expected %v; %v", refresh, err.Error(), tc.expectedRefreshToken, tc.expectedError.Error())
			}
		})
	}

}

func TestCreateSeniorAdmin(t *testing.T) {
	repo := mocks.NewMockAuthorization(t)
	authService := service2.NewAuthService(repo)

	tests := map[string]struct {
		expectedRefreshToken string
		expectedError        error
		mockRetRefreshToken  string
		mockRetErrorError    error
		inputName            string
		inputPassword        string
	}{
		"correct repository work": {
			expectedRefreshToken: "a",
			expectedError:        nil,
			mockRetRefreshToken:  "a",
			mockRetErrorError:    nil,
			inputName:            "a",
			inputPassword:        "a",
		},
		"repository worked with error": {
			expectedRefreshToken: "",
			expectedError:        errors.New("error while creating user"),
			mockRetRefreshToken:  "aaa",
			mockRetErrorError:    errors.New("error while creating user"),
			inputName:            "b",
			inputPassword:        "b",
		},
	}

	for name, tc := range tests {

		t.Run(name, func(t *testing.T) {
			repo.On("CreateSeniorAdmin", mock.Anything, mock.Anything).Return(tc.mockRetErrorError).Once()
			var u string
			fmt.Println(types.Type(u))
			err := authService.CreateSeniorAdmin(tc.inputName, tc.inputPassword)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("CreateUser returned unexpected error: %v, expected: %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && tc.expectedError.Error() != err.Error() {
				t.Errorf("CreateUser returned; %v, expected %v; %v", err.Error(), tc.expectedRefreshToken, tc.expectedError.Error())
			}
		})
	}

}
