package handler

import (
	"errors"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	service "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Services"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"golang.org/x/exp/slices"
	"net/http"
)

type UserActions struct {
	service service.UserActions
}

func NewUserActions(service service.UserActions) *UserActions {
	return &UserActions{service: service}
}

// @Summary Logout
// @Tags user-actions
// @Description Expire refreshToken manually
// @ID logout
// @Accept json
// @Produce json
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - There is no id in token payload/Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id not found;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /user-actions/logout [post]
// @Security BearerAuth
func (h *UserActions) Logout(c *gin.Context) {
	curId, exists := c.Get("id")

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	err := h.service.DropRefreshToken(curId.(int))

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Get User Info
// @Tags user-actions
// @Description Get username by id
// @ID get-user-info
// @Accept json
// @Produce json
// @Success 200 {object} user.GetUserInfoStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - There is no id in token payload/Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - User with such id not found;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /user-actions/get-user-info [get]
// @Security BearerAuth
func (h *UserActions) GetUserInfo(c *gin.Context) {
	curId, exists := c.Get("id")

	if !exists {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	username, access, banTime, banReason, avatarPath, err := h.service.GetUserById(curId.(int))

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	var ret = user.GetUserInfoStruct{}
	ret.Id = curId.(int)
	ret.Name = username
	ret.Access = access
	ret.BanTime = banTime
	ret.BanReason = banReason
	ret.AvatarPath = avatarPath

	c.JSON(http.StatusOK, ret)
}

// @Summary Write User Complaint
// @Tags user-actions
// @Description Send user complaint to server. Possible Reason values: Cheating, Offencive nickname, Unsportsmanlike conduct
// @ID write-user-complaint
// @Accept json
// @Produce json
// @Param input body complaints.UserComplaint true "new complaint info"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json/Invalid Reason;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /user-actions/write-user-complaint [post]
// @Security BearerAuth
func (h *UserActions) WriteUserComplaint(c *gin.Context) {
	var input complaints.UserComplaint

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	if slices.Index(complaints.UserComplaintReasons[:], input.Reason) == -1 {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.CreateUserComplaint(input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Write Level Complaint
// @Tags user-actions
// @Description Send level complaint to server. Possible Reason values: Offencive name, Offencive video, Offencive audio, Offencive text
// @ID write-level-complaint
// @Accept json
// @Produce json
// @Param input body complaints.LevelComplaint true "new complaint info"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json/Invalid Reason;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /user-actions/write-level-complaint [post]
// @Security BearerAuth
func (h *UserActions) WriteLevelComplaint(c *gin.Context) {
	var input complaints.LevelComplaint

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	if slices.Index(complaints.LevelComplaintReasons[:], input.Reason) == -1 {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	err := h.service.CreateLevelComplaint(input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

// @Summary Change Avatar
// @Tags user-actions
// @Description Change avatar. In case of empty request sets default avatar.
// @ID change-avatar
// @Accept mpfd
// @Produce json
// @Param avatar formData file true "File with new avatar image"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input files (e.g. wrong name, not "avatar");"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /user-actions/change-avatar [post]
// @Security BearerAuth
func (h *UserActions) ChangeAvatar(c *gin.Context) {
	userId, ok := c.Get(userIdCtx)
	if !ok {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	intUserId, ok := userId.(int)
	if !ok {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
		return
	}

	avatarFile, err := c.FormFile("avatar")
	if errors.Is(err, http.ErrMissingFile) || errors.Is(err, http.ErrNotMultipart) {
		err = h.service.UpdateAvatar(intUserId, nil)

		if err != nil {
			NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
			return
		}
	} else if err != nil {
		logrus.Printf(err.Error())
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	} else {
		err = h.service.UpdateAvatar(intUserId, avatarFile)

		if err != nil {
			NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
			return
		}
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}
