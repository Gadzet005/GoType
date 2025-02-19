package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
)

// @Summary Get User Statistics
// @Tags stats
// @Description Get User Statistics by id
// @ID get-user-stats
// @Accept json
// @Produce json
// @Param input body entities.UserID true "Id of user"
// @Success 200 {object} entities.GetUserStatsRes
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - There is no user with such id"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /stats/get-user-stats [get]
func (h *Handler) GetUserStats(c *gin.Context) {
	var input entities.UserID

	if err := c.BindJSON(&input); err != nil {
		logrus.Printf(err.Error())
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	userStats, err := h.services.Stats.GetUserStats(input.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"user-stats": userStats,
	})
}

// @Summary Get Users Top
// @Tags stats
// @Description Get Users Top with given params
// @ID get-users-top
// @Accept json
// @Produce json
// @Param input body entities.StatSortFilterParams  true "Search params"
// @Success 200 {object} entities.GetUsersTop
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - There is no user with such id"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /stats/get-users-top [get]
func (h *Handler) GetUsersTop(c *gin.Context) {
	var input entities.StatSortFilterParamsJSON

	if err := c.BindJSON(&input); err != nil {
		logrus.Printf(err.Error())
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	var inpReal entities.StatSortFilterParams

	inpReal.PageInfo = input.PageInfo
	inpReal.Points = input.Points

	runes := []rune(input.CategoryParams.Category)
	firstRune := runes[0]
	inpReal.CategoryParams = entities.CategoryParams{
		Category: ([]rune{firstRune})[0],
		Pattern:  input.CategoryParams.Pattern,
	}

	usersTop, err := h.services.Stats.GetUsersTop(inpReal)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"users": usersTop,
	})
}
