package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
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

func (h *Handler) MaxRequestSize(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)

		if err := c.Request.ParseMultipartForm(maxBytes); err != nil {
			if err.Error() != "request Content-Type isn't multipart/form-data" {
				logrus.Printf("error parsing multipart form: %v", err.Error())
				c.AbortWithStatusJSON(http.StatusRequestEntityTooLarge, gin.H{
					"error": "Size of the request is too large",
				})
				return
			}
		}

		c.Next()
	}
}
