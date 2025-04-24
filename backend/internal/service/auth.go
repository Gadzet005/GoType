package service

import (
	"crypto/sha256"
	"errors"
	"fmt"
	repository "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Repositories"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/golang-jwt/jwt/v5"
	"math/rand"
	"time"
)

// TODO: Move to .env
const (
	salt              = "pqlpwisd5786vhdf27675da"
	signingKey        = "wiu8s7]df9s&di9230s#s894w90g2092v[d"
	refreshTokenTTL   = time.Hour * 720  //1 month
	accessTokenTTL    = time.Minute * 15 //15 min
	letterRunes       = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#&!?&"
	maxNameLength     = 20
	maxPasswordLength = 20
)

type AuthService struct {
	repo repository.Authorization
}

type tokenClaims struct {
	jwt.RegisteredClaims `json:"Claims"`
	Id                   int `json:"id"`
	Access               int `json:"access"`
}

func NewAuthService(repo repository.Authorization) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) CreateSeniorAdmin(username string, password string) error {

	password = s.GeneratePasswordHash(password)

	err := s.repo.CreateSeniorAdmin(username, password)

	if err != nil {
		return err
	}

	return nil
}

func (s *AuthService) CreateUser(user user.User) (string, string, error) {

	if len(user.Name) > maxNameLength || len(user.Password) > maxPasswordLength {
		return "", "", errors.New(gotype.ErrInvalidInput)
	}

	user.Password = s.GeneratePasswordHash(user.Password)

	rToken := s.NewRefreshToken()

	user.RefreshToken = rToken
	user.ExpiresAt = time.Now().UTC().Add(refreshTokenTTL)

	id, access, refreshToken, err := s.repo.CreateUser(user)

	if err != nil {
		return "", "", err
	}

	accessToken, err := s.NewAccessToken(id, access)

	if err != nil {
		return "", "", errors.New(gotype.ErrInternal)
	}

	return accessToken, refreshToken, nil
}

func (s *AuthService) GenerateToken(username, password string) (string, string, error) {
	curUser, err := s.repo.GetUser(username, s.GeneratePasswordHash(password))

	if err != nil {
		return "", "", err
	}

	refreshToken := s.NewRefreshToken()

	expiresAt := time.Now().UTC().Add(refreshTokenTTL)

	id, access, refreshToken, err := s.repo.SetUserRefreshToken(curUser.Id, refreshToken, expiresAt)
	fmt.Println(id, access, refreshToken, err)
	if err != nil {
		return "", "", err
	}

	accessToken, err := s.NewAccessToken(id, access)

	if err != nil {
		return "", "", errors.New(gotype.ErrInternal)
	}

	return refreshToken, accessToken, nil
}

func (s *AuthService) GenerateTokenByToken(accessToken, refreshToken string) (string, string, error) {
	_, id, _, err := s.ParseWithoutValidation(accessToken)

	if err != nil {
		return "", "", errors.New(gotype.ErrAccessToken)
	}

	curUser, err := s.repo.GetUserById(id)

	if err != nil {
		return "", "", err
	}

	if curUser.RefreshToken != refreshToken {
		return "", "", errors.New(gotype.ErrRefreshToken)
	}

	newRefreshToken := s.NewRefreshToken()

	expiresAt := time.Now().UTC().Add(refreshTokenTTL)

	retId, retAccess, newRefreshToken, err := s.repo.SetUserRefreshToken(curUser.Id, newRefreshToken, expiresAt)

	if err != nil {
		return "", "", err
	}

	newAccessToken, err := s.NewAccessToken(retId, retAccess)

	if err != nil {
		return "", "", errors.New(gotype.ErrInternal)
	}

	return newRefreshToken, newAccessToken, nil
}

func (s *AuthService) NewAccessToken(id, Access int) (string, error) {
	authToken := jwt.NewWithClaims(jwt.SigningMethodHS256, tokenClaims{
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessTokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		id,
		Access,
	})

	return authToken.SignedString([]byte(signingKey))
}

func (s *AuthService) NewRefreshToken() string {

	b := make([]rune, 32)
	for i := range b {
		b[i] = []rune(letterRunes)[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func (s *AuthService) Parse(accessToken string) (time.Time, int, int, error) {
	token, err := jwt.ParseWithClaims(accessToken, new(tokenClaims), func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(signingKey), nil
	})

	if err != nil {
		//fmt.Print(err.Error())
		return time.Time{}, -1, -1, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok || !token.Valid {
		return time.Time{}, -1, -1, errors.New("invalid token")
	}

	expirationTime, err := claims.GetExpirationTime()

	if err != nil {
		return time.Time{}, -1, -1, err
	}

	userId := claims.Id
	accessLevel := claims.Access

	return expirationTime.Time, userId, accessLevel, nil
}

func (s *AuthService) ParseWithoutValidation(accessToken string) (time.Time, int, int, error) {
	token, err := jwt.ParseWithClaims(accessToken, new(tokenClaims), func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(signingKey), nil
	})

	if err != nil && !errors.Is(err, jwt.ErrTokenExpired) {
		return time.Time{}, -1, -1, fmt.Errorf("failed to parse token: %w", err)
	}

	claims, ok := token.Claims.(*tokenClaims)
	if !ok {
		return time.Time{}, -1, -1, errors.New("invalid token")
	}

	expirationTime, err := claims.GetExpirationTime()

	if err != nil {
		return time.Time{}, -1, -1, err
	}

	userId := claims.Id
	accessLevel := claims.Access

	return expirationTime.Time, userId, accessLevel, nil
}

func (s *AuthService) GeneratePasswordHash(password string) string {
	hash := sha256.New()
	hash.Write([]byte(password))

	return fmt.Sprintf("%x", hash.Sum([]byte(salt)))
}
