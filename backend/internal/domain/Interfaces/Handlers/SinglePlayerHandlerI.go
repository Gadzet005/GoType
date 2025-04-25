package Handlers

import "github.com/gin-gonic/gin"

type SinglePlayerHandler interface {
	SendResults(c *gin.Context)
}
