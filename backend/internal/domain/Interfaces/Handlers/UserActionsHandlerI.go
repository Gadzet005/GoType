package Handlers

import "github.com/gin-gonic/gin"

type UserActionsHandler interface {
	Logout(c *gin.Context)
	GetUserInfo(c *gin.Context)
	WriteUserComplaint(c *gin.Context)
	WriteLevelComplaint(c *gin.Context)
	ChangeAvatar(c *gin.Context)
}
