package handler

import (
	"github.com/Gadzet005/GoType/backend/internal/handler"
	"github.com/Gadzet005/GoType/backend/internal/service"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestHandler(t *testing.T) {
	h := handler.NewHandler(&service.Service{nil, nil, nil, nil, nil, nil})
	h.InitRoutes()
	assert.NotEmpty(t, h)
}
