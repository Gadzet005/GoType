package handler

import (
	bans "github.com/Gadzet005/GoType/backend/internal/domain/Bans"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	service "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Services"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	useraccess "github.com/Gadzet005/GoType/backend/internal/domain/UserAccess"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Admin struct {
	service service.Admin
}

func NewAdmin(service service.Admin) *Admin {
	return &Admin{service: service}
}

// @Summary Ban user
// @Tags admin
// @Description Ban user with given id if your access is greater than theirs. Available only for moderators and admins
// @ID ban-user
// @Accept json
// @Produce json
// @Param input body bans.UserBan true "id of user you want to ban, duration of ban (format 10h), ban_reason"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json/Wrong format of ban duration;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/ban-user [post]
func (h *Admin) BanUser(c *gin.Context) {
	var input bans.UserBan
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.TryBanUser(curAccess.(int), input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Unban user
// @Tags admin
// @Description Unban user with given id if your access is greater than theirs. Available only for moderators and admins
// @ID unban-user
// @Accept json
// @Produce json
// @Param input body bans.UserUnban true "id of user you want to unban"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/unban-user [post]
func (h *Admin) UnbanUser(c *gin.Context) {
	var input bans.UserUnban
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.TryUnbanUser(curAccess.(int), input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Ban level
// @Tags admin
// @Description Ban level with given id. Available only for moderators and admins
// @ID ban-level
// @Accept json
// @Produce json
// @Param input body bans.LevelBan true "id of level you want to ban"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - Level with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/ban-level [post]
func (h *Admin) BanLevel(c *gin.Context) {
	var input bans.LevelBan
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.TryBanLevel(curAccess.(int), input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Unban level
// @Tags admin
// @Description Unban level with given id. Available only for moderators and admins
// @ID unban-level
// @Accept json
// @Produce json
// @Param input body bans.LevelBan true "id of level you want to unban"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - Level with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/unban-level [post]
func (h *Admin) UnbanLevel(c *gin.Context) {
	var input bans.LevelBan
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.TryUnbanLevel(curAccess.(int), input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Change access level
// @Tags admin
// @Description Change access of a user if your access is greater that theirs. New value must be less than admin's one. Available only for moderators and admins
// @ID change-user-access
// @Accept json
// @Produce json
// @Param input body useraccess.ChangeUserAccess true "id of user you want to ban, new value of access"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/change-user-access [post]
func (h *Admin) ChangeUserAccess(c *gin.Context) {
	var input useraccess.ChangeUserAccess
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.TryChangeAccessLevel(curAccess.(int), input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Get User Complaints for moderator to process
// @Tags admin
// @Description Get list of user complaints assigned to current admin. Available only for moderators and admins
// @ID get-user-complaints
// @Accept json
// @Produce json
// @Success 200 {object} complaints.UserComplaints
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/get-user-complaints [get]
func (h *Admin) GetUserComplaints(c *gin.Context) {
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	curID, exists := c.Get(userIdCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	complaint, err := h.service.GetUserComplaints(curID.(int), curAccess.(int))

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"user_complaints": complaint,
	})
}

// @Summary Get Level Complaints for moderator to process
// @Tags admin
// @Description Get list of level complaints assigned to current admin. Available only for moderators and admins
// @ID get-level-complaints
// @Accept json
// @Produce json
// @Success 200 {object} complaints.LevelComplaints
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/get-level-complaints [get]
func (h *Admin) GetLevelComplaints(c *gin.Context) {
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	curID, exists := c.Get(userIdCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	complaint, err := h.service.GetLevelComplaints(curID.(int), curAccess.(int))

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"level_complaints": complaint,
	})
}

// @Summary Delete user complaint with given id
// @Tags admin
// @Description Delete user complaint with given id. Available only for moderators and admins
// @ID process-user-complaint
// @Accept json
// @Produce json
// @Param complaint_id body complaints.ComplaintID true "Complaint ID"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - There is no complaint with such id among the ones assigned to you"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/process-user-complaint [POST]
func (h *Admin) ProcessUserComplaint(c *gin.Context) {
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	curID, exists := c.Get(userIdCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	var input complaints.ComplaintID
	err := c.BindJSON(&input)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err = h.service.ProcessUserComplaint(curID.(int), curAccess.(int), input.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Delete level complaint with given id
// @Tags admin
// @Description Delete level complaint with given id. Available only for moderators and admins
// @ID process-level-complaint
// @Accept json
// @Produce json
// @Param complaint_id body complaints.ComplaintID true "Complaint ID"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - There is no complaint with such id among the ones assigned to you"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/process-level-complaint [POST]
func (h *Admin) ProcessLevelComplaint(c *gin.Context) {
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	curID, exists := c.Get(userIdCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	var input complaints.ComplaintID
	err := c.BindJSON(&input)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err = h.service.ProcessLevelComplaint(curID.(int), curAccess.(int), input.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Get Users with given params
// @Tags admin
// @Description Get list of users with given params. Available only for moderators and admins
// @ID get-users
// @Accept json
// @Produce json
// @Param name query string false "name of user you want to find"
// @Param is_banned query boolean false "is user banned or not"
// @Param page_size query int false "size of page"
// @Param offset query int false "offset of users"
// @Success 200 {object} user.Users
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/get-users [get]
func (h *Admin) GetUsers(c *gin.Context) {
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	var input user.UserSearchParams

	err := c.ShouldBindQuery(&input)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	users, err := h.service.GetUsers(curAccess.(int), input)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"users": users,
	})
}
