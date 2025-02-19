package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cast"
	"net/http"
)

// @Summary Send results of single player game
// @Tags single-game
// @Description Send results of single player game
// @ID send-results
// @Accept json
// @Produce json
// @Param complaint_id body entities.LevelComplete true "Results of the game"
// @Success 200
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_NO_SUCH_USER - There is no user with such id"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /single-game/send-results [POST]
func (h *Handler) SendResults(c *gin.Context) {
	var inputJSON entities.LevelCompleteJSON

	userId, ok := c.Get(userIdCtx)
	if !ok {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
	}

	if err := c.BindJSON(&inputJSON); err != nil {
		logrus.Printf(err.Error())
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	var input = ConvertLevelCompleteJSONToLevelComplete(inputJSON)

	err := h.services.SinglePlayerGame.SendResults(userId.(int), input)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

func ConvertLevelCompleteJSONToLevelComplete(jsonData entities.LevelCompleteJSON) entities.LevelComplete {
	numPressErrByChar := make(map[rune][2]int)

	for k, v := range jsonData.NumPressErrByChar {
		runes := []rune(k)
		if len(runes) == 1 {
			numPressErrByChar[[]rune(k)[0]] = v
		}
	}
	logrus.Printf(cast.ToString(numPressErrByChar))
	return entities.LevelComplete{
		LevelId:           jsonData.LevelId,
		PlayerId:          jsonData.PlayerId,
		Time:              jsonData.Time,
		NumPressErrByChar: numPressErrByChar,
		Accuracy:          jsonData.Accuracy,
		AverageVelocity:   jsonData.AverageVelocity,
		MaxCombo:          jsonData.MaxCombo,
		Placement:         jsonData.Placement,
		Points:            jsonData.Points,
	}
}
