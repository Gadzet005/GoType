package Handlers

import "github.com/gin-gonic/gin"

type AdminHandlerI interface {
	BanUser(c *gin.Context)
	UnbanUser(c *gin.Context)
	BanLevel(c *gin.Context)
	UnbanLevel(c *gin.Context)
	ChangeUserAccess(c *gin.Context)
	GetUserComplaints(c *gin.Context)
	GetLevelComplaints(c *gin.Context)
	ProcessUserComplaint(c *gin.Context)
	ProcessLevelComplaint(c *gin.Context)
	GetUsers(c *gin.Context)
}
