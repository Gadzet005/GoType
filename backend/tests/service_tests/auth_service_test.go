package service_tests

import (
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

func TestCreateUser(t *testing.T) {
	repo := mocks.NewMockAuthorization(t)
	authService := service2.NewAuthService(repo)

	repo.On("CreateUser", mock.AnythingOfType("domain.User")).Return(0, 1, "a", nil)

	_, refresh, err := authService.CreateUser(user.User{Password: "a", Name: "a"})

	//asserts for valid access
	assert.Equal(t, "a", refresh)
	assert.Nil(t, err)
}
