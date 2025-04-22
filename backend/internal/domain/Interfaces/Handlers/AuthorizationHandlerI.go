package Handlers

import "github.com/gin-gonic/gin"

type AuthorizationHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Refresh(c *gin.Context)
}
