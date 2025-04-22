package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	service "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Services"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

type Stat struct {
	service service.Stats
}

func NewStat(service service.Stats) *Stat {
	return &Stat{service: service}
}

// @Summary Get User Statistics
// @Tags stats
// @Description Get User Statistics by id
// @ID get-user-stats
// @Accept json
// @Produce json
// @Param id query int true "id of user you want to find"
// @Success 200 {object} statistics.GetUserStatsRes
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - There is no user with such id"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /stats/get-user-stats [get]
func (h *Stat) GetUserStats(c *gin.Context) {
	var levId int
	levId, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		logrus.Printf(err.Error())
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	userStats, err := h.service.GetUserStats(levId)

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
// @Param input body statistics.StatSortFilterParams  true "Search params"
// @Success 200 {object} statistics.GetUsersTop
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - There is no user with such id"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /stats/get-users-top [post]
func (h *Stat) GetUsersTop(c *gin.Context) {
	var input statistics.StatSortFilterParamsJSON

	if err := c.BindJSON(&input); err != nil {
		logrus.Printf(err.Error())
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	var inpReal statistics.StatSortFilterParams

	inpReal.PageInfo = input.PageInfo
	inpReal.Points = input.Points

	runes := []rune(input.CategoryParams.Category)
	firstRune := runes[0]
	inpReal.CategoryParams = statistics.CategoryParams{
		Category: ([]rune{firstRune})[0],
		Pattern:  input.CategoryParams.Pattern,
	}

	usersTop, err := h.service.GetUsersTop(inpReal)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"users": usersTop,
	})

}
