package service

import (
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/Gadzet005/GoType/backend/internal/service"
	"testing"
)

func TestCreateSeniorAdmin(t *testing.T) {
	repo := repository.NewRepository(nil, nil, 1, 1, 1)
	_ = service.NewService(repo, 1, 1, "", "")
}
