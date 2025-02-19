package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

// @Summary Ban user
// @Tags admin
// @Description Ban user with given id if your access is greater than theirs. Available only for moderators and admins
// @ID ban-user
// @Accept json
// @Produce json
// @Param input body entities.UserBan true "id of user you want to ban, duration of ban (format 10h), ban_reason"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json/Wrong format of ban duration;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/ban-user [post]
func (h *Handler) BanUser(c *gin.Context) {
	var input entities.UserBan
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.services.Admin.TryBanUser(curAccess.(int), input)
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
// @Param input body entities.UserUnban true "id of user you want to unban"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/unban-user [post]
func (h *Handler) UnbanUser(c *gin.Context) {
	var input entities.UserUnban
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.services.Admin.TryUnbanUser(curAccess.(int), input)
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
// @Param input body entities.LevelBan true "id of level you want to ban"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - Level with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/ban-level [post]
func (h *Handler) BanLevel(c *gin.Context) {
	var input entities.LevelBan
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.services.Admin.TryBanLevel(curAccess.(int), input)
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
// @Param input body entities.LevelBan true "id of level you want to unban"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - Level with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/unban-level [post]
func (h *Handler) UnbanLevel(c *gin.Context) {
	var input entities.LevelBan
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.services.Admin.TryUnbanLevel(curAccess.(int), input)
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
// @Param input body entities.ChangeUserAccess true "id of user you want to ban, new value of access"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id does not exist; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/change-user-access [post]
func (h *Handler) ChangeUserAccess(c *gin.Context) {
	var input entities.ChangeUserAccess
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.services.Admin.TryChangeAccessLevel(curAccess.(int), input)
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
// @Success 200 {object} entities.UserComplaints
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/get-user-complaints [get]
func (h *Handler) getUserComplaints(c *gin.Context) {
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

	complaints, err := h.services.Admin.GetUserComplaints(curID.(int), curAccess.(int))

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"user_complaints": complaints,
	})
}

// @Summary Get Level Complaints for moderator to process
// @Tags admin
// @Description Get list of level complaints assigned to current admin. Available only for moderators and admins
// @ID get-level-complaints
// @Accept json
// @Produce json
// @Success 200 {object} entities.LevelComplaints
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/get-level-complaints [get]
func (h *Handler) getLevelComplaints(c *gin.Context) {
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

	complaints, err := h.services.Admin.GetLevelComplaints(curID.(int), curAccess.(int))

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"level_complaints": complaints,
	})
}

// @Summary Delete user complaint with given id
// @Tags admin
// @Description Delete user complaint with given id. Available only for moderators and admins
// @ID process-user-complaint
// @Accept json
// @Produce json
// @Param complaint_id body entities.ComplaintID true "Complaint ID"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - There is no complaint with such id among the ones assigned to you"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/process-user-complaint [POST]
func (h *Handler) processUserComplaint(c *gin.Context) {
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

	var input entities.ComplaintID
	err := c.BindJSON(&input)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
	}

	err = h.services.Admin.ProcessUserComplaint(curID.(int), curAccess.(int), input.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Delete level complaint with given id
// @Tags admin
// @Description Delete level complaint with given id. Available only for moderators and admins
// @ID process-level-complaint
// @Accept json
// @Produce json
// @Param complaint_id body entities.ComplaintID true "Complaint ID"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_ENTITY_NOT_FOUND - There is no complaint with such id among the ones assigned to you"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/process-level-complaint [POST]
func (h *Handler) processLevelComplaint(c *gin.Context) {
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

	var input entities.ComplaintID
	err := c.BindJSON(&input)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
	}

	err = h.services.Admin.ProcessLevelComplaint(curID.(int), curAccess.(int), input.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Get Users with given params
// @Tags admin
// @Description Get list of users with given params. Available only for moderators and admins
// @ID get-users
// @Accept json
// @Produce json
// @Param user_search_params body entities.UserSearchParams true "Search params - name, isBanned, pages info"
// @Success 200 {object} entities.Users
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /admin/get-users [get]
func (h *Handler) getUsers(c *gin.Context) {
	curAccess, exists := c.Get(userAccessCtx)

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	var input entities.UserSearchParams

	err := c.ShouldBindBodyWithJSON(&input)

	if err != nil {
		logrus.Printf("BindJSON error: %v; %v", err, input)
		logrus.Println(input.Name, input.IsBanned, input.PageSize, input.Offset)
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	users, err := h.services.Admin.GetUsers(curAccess.(int), input)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"users": users,
	})
}
