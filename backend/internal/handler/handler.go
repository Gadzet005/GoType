package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	_ "github.com/Gadzet005/GoType/backend/docs"
	"github.com/Gadzet005/GoType/backend/internal/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
)

type AuthorizationHandler interface {
	Register(c *gin.Context)
	Login(c *gin.Context)
	Refresh(c *gin.Context)
}

type UserActionsHandler interface {
	logout(c *gin.Context)
	getUserInfo(c *gin.Context)
	WriteUserComplaint(c *gin.Context)
	WriteLevelComplaint(c *gin.Context)
	changeAvatar(c *gin.Context)
}

type StatsHandler interface {
	GetUserStats(c *gin.Context)
	GetUsersTop(c *gin.Context)
}

type AdminHandler interface {
	BanUser(c *gin.Context)
	UnbanUser(c *gin.Context)
	BanLevel(c *gin.Context)
	UnbanLevel(c *gin.Context)
	ChangeUserAccess(c *gin.Context)
	getUserComplaints(c *gin.Context)
	getLevelComplaints(c *gin.Context)
	processUserComplaint(c *gin.Context)
	processLevelComplaint(c *gin.Context)
	getUsers(c *gin.Context)
}

type SinglePlayerHandler interface {
	SendResults(c *gin.Context)
}

type LevelHandler interface {
	CreateLevel(c *gin.Context)
	GetLevel(c *gin.Context)
	GetLevelInfoById(c *gin.Context)
	UpdateLevel(c *gin.Context)
	GetLevelList(c *gin.Context)
}

type Handler struct {
	Authorization    AuthorizationHandler
	UserActions      UserActionsHandler
	Admin            AdminHandler
	Level            LevelHandler
	Stats            StatsHandler
	SinglePlayerGame SinglePlayerHandler
	services         *service.Service
}

//type Handler struct {
//	services *service.Service
//}

func NewHandler(services *service.Service) *Handler {
	return &Handler{
		Authorization:    NewAuth(services.Authorization),
		UserActions:      NewUserActions(services.UserActions),
		Admin:            NewAdmin(services.Admin),
		Level:            NewLevel(services.Level),
		Stats:            NewStat(services.Stats),
		SinglePlayerGame: NewSinglePlayer(services.SinglePlayerGame),
		services:         services,
	}
}

//func NewHandler(services *service.Service) *Handler {
//	return &Handler{services: services}
//}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	corsDescr := cors.DefaultConfig()
	corsDescr.AllowAllOrigins = true

	corsDescr.AllowHeaders = append(corsDescr.AllowHeaders, "Authorization")
	corsDescr.AllowHeaders = append(corsDescr.AllowHeaders, "X-Requested-With")
	corsDescr.AllowHeaders = append(corsDescr.AllowHeaders, "Accept")

	router.Use(cors.New(corsDescr))

	router.Static("/previews", "./"+gotype.PreviewDirName)
	router.Static("/avatars", "./"+gotype.AvatarDirName)

	auth := router.Group("/auth")
	{
		auth.POST("/register", h.Authorization.Register)
		auth.POST("/login", h.Authorization.Login)
		auth.POST("/refresh", h.Authorization.Refresh)
	}

	userActions := router.Group("/user-actions", h.UserIdentity)
	{
		userActions.POST("/logout", h.UserActions.logout)
		userActions.GET("/get-user-info", h.UserActions.getUserInfo)
		userActions.POST("/write-user-complaint", h.UserActions.WriteUserComplaint)
		userActions.POST("/write-level-complaint", h.UserActions.WriteLevelComplaint)
		userActions.POST("/change-avatar", h.UserActions.changeAvatar)
	}

	stats := router.Group("/stats", h.UserIdentity)
	{
		stats.GET("/get-user-stats", h.Stats.GetUserStats)
		stats.GET("/get-users-top", h.Stats.GetUsersTop)
	}

	admin := router.Group("/admin", h.UserIdentity)
	{
		admin.POST("/ban-user", h.Admin.BanUser)
		admin.POST("/unban-user", h.Admin.UnbanUser)
		admin.POST("/ban-level", h.Admin.BanLevel)
		admin.POST("/change-user-access", h.Admin.ChangeUserAccess)
		admin.GET("/get-user-complaints", h.Admin.getUserComplaints)
		admin.GET("/get-level-complaints", h.Admin.getLevelComplaints)
		admin.POST("/process-user-complaint", h.Admin.processUserComplaint)
		admin.POST("/process-level-complaint", h.Admin.processLevelComplaint)
		admin.GET("/get-users", h.Admin.getUsers)
	}

	level := router.Group("/level", h.UserIdentity)
	{
		level.POST("/create-level", h.Level.CreateLevel)
		level.GET("/download-level", h.Level.GetLevel)
		level.GET("/get-level-info", h.Level.GetLevelInfoById)
		level.POST("/update-level", h.Level.UpdateLevel)
		level.GET("/get-level-list", h.Level.GetLevelList)
	}

	singleGame := router.Group("/single-game", h.UserIdentity)
	{
		singleGame.POST("/send-results", h.SinglePlayerGame.SendResults)
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return router
}
