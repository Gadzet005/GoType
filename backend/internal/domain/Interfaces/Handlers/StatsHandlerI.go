package Handlers

import "github.com/gin-gonic/gin"

type StatsHandler interface {
	GetUserStats(c *gin.Context)
	GetUsersTop(c *gin.Context)
}
