package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

// @Summary Create level
// @Tags level
// @Description Create level with given structure
// @ID create-level
// @Accept mpfd
// @Produce json
// @Param level formData file true "Archive with level."
// @Param info formData file true "JSON file with level description."
// @Param preview formData file true "File with preview image of the level"
// @Success 200 {object} entities.GetLevelInfoStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/create-level [post]
func (h *Handler) CreateLevel(c *gin.Context) {
	levelFile, err := c.FormFile("level")
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	infoFile, err := c.FormFile("info")
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	previewFile, err := c.FormFile("preview")
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	userId, ok := c.Get(userIdCtx)
	if !ok {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
	}

	levelId, err := h.services.Level.CreateLevel(userId.(int), levelFile, infoFile, previewFile)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": levelId,
	})
}

// @Summary Download level
// @Tags level
// @Description Download level with given id from server
// @ID download-level
// @Accept json
// @Produce      application/octet-stream
// @Param input body entities.GetLevelInfoStruct true "id of level you want to download"
// @Success 200 {file}  file "Archive with level."
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json; ERR_ENTITY_NOT_FOUND - no such level on server"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/download-level [get]
func (h *Handler) GetLevel(c *gin.Context) {
	var levInfo entities.GetLevelInfoStruct

	err := c.BindJSON(&levInfo)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	filePath, err := h.services.Level.CheckLevelExists(levInfo)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrEntityNotFound)
	}

	parts := strings.Split(filePath, "/")
	c.FileAttachment(filePath, parts[len(parts)-1])
}

// @Summary Get level info
// @Tags level
// @Description Get level info about level with given id
// @ID get-level-info
// @Accept json
// @Produce json
// @Param input body entities.GetLevelInfoStruct true "id of level you want to find out about"
// @Success 200 {object} entities.LevelInfo
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/get-level-info [get]
func (h *Handler) GetLevelInfoById(c *gin.Context) {
	var levId entities.GetLevelInfoStruct

	err := c.BindJSON(&levId)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	levelInfo, err := h.services.Level.GetLevelById(levId.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	levelStats, err := h.services.Level.GetLevelStats(levId.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	levelUserTop, err := h.services.Level.GetLevelUserTop(levId.Id)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"levelInfo":    levelInfo,
		"levelUserTop": levelUserTop,
		"levelStats":   levelStats,
	})
}

// @Summary Update level
// @Tags level
// @Description Update level with given structure
// @ID update-level
// @Accept mpfd
// @Produce json
// @Param level formData file true "Archive with level."
// @Param info formData file true "JSON file with level description."
// @Param preview formData file true "File with preview image of the level"
// @Success 200 {object} entities.GetLevelInfoStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/update-level [post]
func (h *Handler) UpdateLevel(c *gin.Context) {
	levelFile, err := c.FormFile("level")
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	infoFile, err := c.FormFile("info")
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	previewFile, err := c.FormFile("preview")
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	userId, ok := c.Get(userIdCtx)
	if !ok {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrAccessToken)
	}

	levelId, err := h.services.Level.UpdateLevel(userId.(int), levelFile, infoFile, previewFile)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": levelId,
	})
}

// @Summary Get level list
// @Tags level
// @Description Get level list with given params
// @ID get-level-list
// @Accept json
// @Produce json
// @Param input body entities.FetchLevelStruct true "search and filter params"
// @Success 200 {object} entities.LevelsList
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/get-level-list [get]
func (h *Handler) GetLevelList(c *gin.Context) {
	var fetchParams entities.FetchLevelStruct
	err := c.BindJSON(&fetchParams)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	levelList, err := h.services.Level.GetLevelList(fetchParams)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, entities.LevelsList{Levels: levelList})
}
