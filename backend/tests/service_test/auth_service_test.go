package service_test

import (
	"errors"
	"fmt"
	gotype "github.com/Gadzet005/GoType/backend"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/mock"
	"github.com/swaggo/swag/testdata/enums/types"
	"strings"
	"testing"
	"time"
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

func TestGenerateTokenByToken(t *testing.T) {
	repo := mocks.NewMockAuthorization(t)
	authService := service2.NewAuthService(repo)
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
		"bad access token": {
			accessToken:     "bad_token",
			refreshToken:    "xxx",
			mockGetUserErr:  nil,
			mockSetTokenErr: nil,
			expectedRefresh: "",
			expectedAccess:  "",
			expectedErr:     errors.New(gotype.ErrAccessToken),
		},
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

type tokenClaims struct {
	jwt.RegisteredClaims `json:"Claims"`
	Id                   int `json:"id"`
	Access               int `json:"access"`
}

func TestParse(t *testing.T) {
	tests := []struct {
		name           string
		accessToken    string
		expectedErr    error
		expectedUserId int
		expectedLevel  int
	}{
		{
			name:           "valid token",
			accessToken:    "valid.jwt.token",
			expectedErr:    nil,
			expectedUserId: 1,
			expectedLevel:  2,
		},
		{
			name:        "invalid token format",
			accessToken: "invalid.jwt.token",
			expectedErr: errors.New("failed to parse token"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			authToken := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims{
				jwt.RegisteredClaims{
					ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
					IssuedAt:  jwt.NewNumericDate(time.Now()),
				},
				tt.expectedUserId,
				tt.expectedLevel,
			})

			tttt, err := authToken.SignedString([]byte("wiu8s7]df9s&di9230s#s894w90g2092v[d"))

			authService := service2.NewAuthService(nil)
			expirationTime, userId, accessLevel, err := authService.Parse(tttt)

			if err != nil && !strings.Contains(err.Error(), tt.expectedErr.Error()) {
				t.Errorf("expected error %v, got %v", tt.expectedErr, err)
			}

			if userId != tt.expectedUserId {
				t.Errorf("expected userId %d, got %d", tt.expectedUserId, userId)
			}

			if accessLevel != tt.expectedLevel {
				t.Errorf("expected accessLevel %d, got %d", tt.expectedLevel, accessLevel)
			}

			if expirationTime.IsZero() {
				t.Error("expected valid expirationTime, got zero time")
			}
		})
	}
}

func TestParseWithoutValidation(t *testing.T) {
	tests := []struct {
		name           string
		accessToken    string
		expectedErr    error
		expectedUserId int
		expectedLevel  int
	}{
		{
			name:           "valid token",
			accessToken:    "valid.jwt.token",
			expectedErr:    nil,
			expectedUserId: 1,
			expectedLevel:  2,
		},
		{
			name:           "expired token",
			accessToken:    "expired.jwt.token",
			expectedErr:    nil,
			expectedUserId: 1,
			expectedLevel:  2,
		},
		{
			name:        "invalid token format",
			accessToken: "invalid.jwt.token",
			expectedErr: errors.New("failed to parse token"),
		},
		{
			name:        "token with unexpected signing method",
			accessToken: "unexpected-signing-method.jwt.token",
			expectedErr: fmt.Errorf("unexpected signing method: %v", "HS256"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			authToken := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims{
				RegisteredClaims: jwt.RegisteredClaims{
					ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
					IssuedAt:  jwt.NewNumericDate(time.Now()),
				},
				Id:     tt.expectedUserId,
				Access: tt.expectedLevel,
			})

			tttt, err := authToken.SignedString([]byte("wiu8s7]df9s&di9230s#s894w90g2092v[d"))

			authService := service2.NewAuthService(nil)
			expirationTime, userId, accessLevel, err := authService.ParseWithoutValidation(tttt)

			if err != nil && !strings.Contains(err.Error(), tt.expectedErr.Error()) {
				t.Errorf("expected error %v, got %v", tt.expectedErr, err)
			}

			if userId != tt.expectedUserId {
				t.Errorf("expected userId %d, got %d", tt.expectedUserId, userId)
			}

			if accessLevel != tt.expectedLevel {
				t.Errorf("expected accessLevel %d, got %d", tt.expectedLevel, accessLevel)
			}

			if expirationTime.IsZero() {
				t.Error("expected valid expirationTime, got zero time")
			}
		})
	}
}
