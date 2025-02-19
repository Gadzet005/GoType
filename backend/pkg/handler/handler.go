package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	_ "github.com/Gadzet005/GoType/backend/docs"
	"github.com/Gadzet005/GoType/backend/pkg/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"       // swagger embed files
	"github.com/swaggo/gin-swagger" // gin-swagger middleware
)

type Handler struct {
	services *service.Service
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{services: services}
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

	auth := router.Group("/auth")
	{
		auth.POST("/register", h.register)
		auth.POST("/login", h.login)
		auth.POST("/refresh", h.refresh)
	}

	userActions := router.Group("/user-actions", h.UserIdentity)
	{
		userActions.POST("/logout", h.logout)
		userActions.GET("/get-user-info", h.getUserInfo)
		userActions.POST("/write-user-complaint", h.WriteUserComplaint)
		userActions.POST("/write-level-complaint", h.WriteLevelComplaint)
	}

	stats := router.Group("/stats", h.UserIdentity)
	{
		stats.GET("/get-user-stats", h.GetUserStats)
		stats.GET("/get-users-top", h.GetUsersTop)
	}

	admin := router.Group("/admin", h.UserIdentity)
	{
		admin.POST("/ban-user", h.BanUser)
		admin.POST("/unban-user", h.UnbanUser)
		admin.POST("/ban-level", h.BanLevel)
		admin.POST("/unban-level")
		admin.POST("/change-user-access", h.ChangeUserAccess)

		admin.GET("/get-user-complaints", h.getUserComplaints)
		admin.GET("/get-level-complaints", h.getLevelComplaints)
		admin.POST("/process-user-complaint", h.processUserComplaint)
		admin.POST("/process-level-complaint", h.processLevelComplaint)
		admin.GET("/get-users", h.getUsers)
	}

	level := router.Group("/level", h.UserIdentity)
	{
		level.POST("/create-level", h.CreateLevel)
		level.GET("/download-level", h.GetLevel)
		level.GET("/get-level-info", h.GetLevelInfoById)
		level.POST("/update-level", h.UpdateLevel)
		level.GET("/get-level-list", h.GetLevelList)
	}

	//multGame := router.Group("/mult-game")
	//{
	//
	//}

	singleGame := router.Group("/single-game", h.UserIdentity)
	{
		singleGame.POST("/send-results", h.SendResults)
	}

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	//router.Run(":8080")

	return router
}
