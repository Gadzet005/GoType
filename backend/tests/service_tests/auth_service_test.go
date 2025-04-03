package service_tests

//import (
//	"github.com/Gadzet005/GoType/backend/domain"
//	mocks "github.com/Gadzet005/GoType/backend/internal/mocks/repository"
//	service2 "github.com/Gadzet005/GoType/backend/internal/service"
//	"github.com/stretchr/testify/assert"
//	"github.com/stretchr/testify/mock"
//	"testing"
//)
//
//func TestCreateUser(t *testing.T) {
//	repo := mocks.NewMockAuthorization(t)
//	authService := service2.NewAuthService(repo)
//
//	repo.On("CreateUser", mock.AnythingOfType("domain.User")).Return(0, 1, "a", nil)
//
//	_, refresh, err := authService.CreateUser(domain.User{Password: "a", Name: "a"})
//
//	//asserts for valid access
//	assert.Equal(t, "a", refresh)
//	assert.Nil(t, err)
//}
