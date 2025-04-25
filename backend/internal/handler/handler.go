package handler

import (
	_ "github.com/Gadzet005/GoType/backend/docs"
	interfaces "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Handlers"
	"github.com/Gadzet005/GoType/backend/internal/service"
	"github.com/Gadzet005/GoType/backend/pkg"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
)

const (
	maxRequestBodySize = 20 * 1024 * 1024
)

type Handler struct {
	Authorization    interfaces.AuthorizationHandler
	UserActions      interfaces.UserActionsHandler
	Admin            interfaces.AdminHandlerI
	Level            interfaces.LevelHandler
	Stats            interfaces.StatsHandler
	SinglePlayerGame interfaces.SinglePlayerHandler
	services         *service.Service
}

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
		userActions.POST("/logout", h.UserActions.Logout)
		userActions.GET("/get-user-info", h.UserActions.GetUserInfo)
		userActions.POST("/write-user-complaint", h.UserActions.WriteUserComplaint)
		userActions.POST("/write-level-complaint", h.UserActions.WriteLevelComplaint)
		userActions.POST("/change-avatar", h.MaxRequestSize(maxRequestBodySize), h.UserActions.ChangeAvatar)
	}

	stats := router.Group("/stats")
	{
		stats.GET("/get-user-stats/:id", h.UserIdentity, h.Stats.GetUserStats)
		stats.POST("/get-users-top", h.Stats.GetUsersTop)
	}

	admin := router.Group("/admin", h.UserIdentity)
	{
		admin.POST("/ban-user", h.Admin.BanUser)
		admin.POST("/unban-user", h.Admin.UnbanUser)
		admin.POST("/ban-level", h.Admin.BanLevel)
		admin.POST("/change-user-access", h.Admin.ChangeUserAccess)
		admin.GET("/get-user-complaints", h.Admin.GetUserComplaints)
		admin.GET("/get-level-complaints", h.Admin.GetLevelComplaints)
		admin.POST("/process-user-complaint", h.Admin.ProcessUserComplaint)
		admin.POST("/process-level-complaint", h.Admin.ProcessLevelComplaint)
		admin.GET("/get-users", h.Admin.GetUsers)
	}

	level := router.Group("/level")
	{
		level.POST("/create-level", h.MaxRequestSize(maxRequestBodySize), h.UserIdentity, h.Level.CreateLevel)
		level.GET("/download-level/:id", h.UserIdentity, h.Level.GetLevel)
		level.GET("/get-level-info/:id", h.UserIdentity, h.Level.GetLevelInfoById)
		level.PUT("/update-level", h.MaxRequestSize(maxRequestBodySize), h.UserIdentity, h.Level.UpdateLevel)
		level.POST("/get-level-list", h.Level.GetLevelList)
	}
	
	singleGame := router.Group("/single-game", h.UserIdentity)
	{
		singleGame.POST("/send-results", h.SinglePlayerGame.SendResults)
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return router
}
