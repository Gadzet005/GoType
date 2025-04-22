package service_test

import (
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/mock"
	"github.com/swaggo/swag/testdata/enums/types"
	"strings"
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
		"long name error": {
			expectedRefreshToken: "",
			expectedError:        errors.New(gotype.ErrInvalidInput),
			mockRetRefreshToken:  "a",
			mockRetErrorError:    nil,
			inputName:            "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
			inputPassword:        "a",
		},
		"long password error": {
			expectedRefreshToken: "",
			expectedError:        errors.New(gotype.ErrInvalidInput),
			mockRetRefreshToken:  "a",
			mockRetErrorError:    nil,
			inputName:            "a",
			inputPassword:        "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if !strings.HasPrefix(name, "long") {
				repo.On("CreateUser", mock.AnythingOfType("domain.User")).Return(0, 1, tc.mockRetRefreshToken, tc.mockRetErrorError).Once()
			}

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

//func TestGenerateToken(t *testing.T) {
//	repo := mocks.NewMockAuthorization(t)
//	authService := service2.NewAuthService(repo)
//
//	authService.NewRefreshToken = func() string { return "refresh123" }
//	authService.NewAccessToken = func(id int, access int) (string, error) {
//		return "access123", nil
//	}
//
//	hashedPassword := authService.GeneratePasswordHash("pass")
//
//	tests := map[string]struct {
//		username        string
//		password        string
//		mockGetUser     domain.User
//		mockGetUserErr  error
//		mockSetTokenErr error
//		expectedRefresh string
//		expectedAccess  string
//		expectedErr     error
//	}{
//		"success": {
//			username: "user",
//			password: "pass",
//			mockGetUser: domain.User{
//				Id: 1,
//			},
//			mockGetUserErr:  nil,
//			mockSetTokenErr: nil,
//			expectedRefresh: "refresh123",
//			expectedAccess:  "access123",
//			expectedErr:     nil,
//		},
//		"get user error": {
//			username:        "user",
//			password:        "pass",
//			mockGetUser:     domain.User{},
//			mockGetUserErr:  errors.New("user not found"),
//			mockSetTokenErr: nil,
//			expectedRefresh: "",
//			expectedAccess:  "",
//			expectedErr:     errors.New("user not found"),
//		},
//		"set token error": {
//			username: "user",
//			password: "pass",
//			mockGetUser: domain.User{
//				Id: 1,
//			},
//			mockGetUserErr:  nil,
//			mockSetTokenErr: errors.New("db error"),
//			expectedRefresh: "",
//			expectedAccess:  "",
//			expectedErr:     errors.New("db error"),
//		},
//	}
//
//	for name, tc := range tests {
//		t.Run(name, func(t *testing.T) {
//			repo.On("GetUser", tc.username, hashedPassword).Return(tc.mockGetUser, tc.mockGetUserErr).Once()
//
//			if tc.mockGetUserErr == nil {
//				repo.On("SetUserRefreshToken", tc.mockGetUser.Id, "refresh123", mock.Anything).Return(
//					tc.mockGetUser.Id, 1, "refresh123", tc.mockSetTokenErr,
//				).Once()
//			}
//
//			refresh, access, err := authService.GenerateToken(tc.username, tc.password)
//
//			if (tc.expectedErr == nil && err != nil) || (tc.expectedErr != nil && err == nil) {
//				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedErr)
//			}
//
//			if tc.expectedErr != nil && err != nil && tc.expectedErr.Error() != err.Error() {
//				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedErr.Error())
//			}
//
//			if refresh != tc.expectedRefresh || access != tc.expectedAccess {
//				t.Errorf("unexpected tokens: got (%v, %v), expected (%v, %v)", refresh, access, tc.expectedRefresh, tc.expectedAccess)
//			}
//		})
//	}
//}

func TestGenerateTokenByToken(t *testing.T) {
	repo := mocks.NewMockAuthorization(t)
	authService := service2.NewAuthService(repo)

	//authService.ParseWithoutValidation = func(token string) (string, int, int, error) {
	//	if token == "bad_token" {
	//		return "", 0, 0, errors.New(gotype.ErrAccessToken)
	//	}
	//	return "", 1, 1, nil
	//}
	//
	//authService.NewRefreshToken = func() string { return "newRefresh" }
	//authService.NewAccessToken = func(id int, access int) (string, error) {
	//	return "newAccess", nil
	//}
	//rt, _, _ := authService.GenerateToken("A", "A")
	repo.On("SetUserRefreshToken", mock.AnythingOfType("int"), mock.AnythingOfType("string"), mock.AnythingOfType("string")).Return("token", nil).Maybe()

	tests := map[string]struct {
		accessToken     string
		refreshToken    string
		mockUser        user.User
		mockGetUserErr  error
		mockSetTokenErr error
		expectedRefresh string
		expectedAccess  string
		expectedErr     error
	}{
		//"success": {
		//	accessToken:  rt,
		//	refreshToken: "oldRefresh",
		//	mockUser: user.User{
		//		Id:           1,
		//		RefreshToken: "oldRefresh",
		//	},
		//	mockGetUserErr:  nil,
		//	mockSetTokenErr: nil,
		//	expectedRefresh: "newRefresh",
		//	expectedAccess:  "newAccess",
		//	expectedErr:     nil,
		//},
		"bad access token": {
			accessToken:     "bad_token",
			refreshToken:    "xxx",
			mockGetUserErr:  nil,
			mockSetTokenErr: nil,
			expectedRefresh: "",
			expectedAccess:  "",
			expectedErr:     errors.New(gotype.ErrAccessToken),
		},
		//"get user error": {
		//	accessToken:    rt,
		//	refreshToken:   "xxx",
		//	mockGetUserErr: errors.New("not found"),
		//	expectedErr:    errors.New("not found"),
		//},
		//"wrong refresh token": {
		//	accessToken:  rt,
		//	refreshToken: "mismatch",
		//	mockUser: user.User{
		//		Id:           1,
		//		RefreshToken: "correct",
		//	},
		//	mockGetUserErr: nil,
		//	expectedErr:    errors.New(gotype.ErrRefreshToken),
		//},
		//"set refresh token error": {
		//	accessToken:  rt,
		//	refreshToken: "oldRefresh",
		//	mockUser: user.User{
		//		Id:           1,
		//		RefreshToken: "oldRefresh",
		//	},
		//	mockGetUserErr:  nil,
		//	mockSetTokenErr: errors.New("db fail"),
		//	expectedErr:     errors.New("db fail"),
		//},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if !strings.Contains(name, "bad access token") {
				repo.On("GetUserById", 1).Return(tc.mockUser, tc.mockGetUserErr).Maybe()
			}

			if tc.mockGetUserErr == nil && tc.mockUser.RefreshToken == tc.refreshToken {
				repo.On("SetUserRefreshToken", tc.mockUser.Id, "newRefresh", mock.Anything).Return(
					tc.mockUser.Id, 1, "newRefresh", tc.mockSetTokenErr,
				).Maybe()
			}

			refresh, access, err := authService.GenerateTokenByToken(tc.accessToken, tc.refreshToken)

			if (tc.expectedErr == nil && err != nil) || (tc.expectedErr != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedErr)
			}

			if tc.expectedErr != nil && err != nil && tc.expectedErr.Error() != err.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedErr.Error())
			}

			if refresh != tc.expectedRefresh || access != tc.expectedAccess {
				t.Errorf("unexpected tokens: got (%v, %v), expected (%v, %v)", refresh, access, tc.expectedRefresh, tc.expectedAccess)
			}
		})
	}
}
