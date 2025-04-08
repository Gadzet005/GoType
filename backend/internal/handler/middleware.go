package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
	"time"
)

const (
	AuthorizationHeader = "Authorization"
	userIdCtx           = "id"
	userAccessCtx       = "Access"
)

func (h *Handler) UserIdentity(c *gin.Context) {
	header := c.GetHeader(AuthorizationHeader)

	if header == "" {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	expTime, id, access, err := h.services.Authorization.Parse(headerParts[1])

	if err != nil {
		NewErrorResponse(c, http.StatusUnauthorized, gotype.ErrUnauthorized)
		return
	}

	if expTime.Before(time.Now()) {
		NewErrorResponse(c, http.StatusUnauthorized, gotype.ErrUnauthorized)
		return
	}

	c.Set(userIdCtx, id)
	c.Set(userAccessCtx, access)
}
