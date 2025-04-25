package Handlers

import "github.com/gin-gonic/gin"

type LevelHandler interface {
	CreateLevel(c *gin.Context)
	GetLevel(c *gin.Context)
	GetLevelInfoById(c *gin.Context)
	UpdateLevel(c *gin.Context)
	GetLevelList(c *gin.Context)
}
