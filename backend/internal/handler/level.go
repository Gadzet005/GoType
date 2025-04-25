package handler

import (
	"fmt"
	service "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Services"
	level "github.com/Gadzet005/GoType/backend/internal/domain/Level"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"strings"
)

type Level struct {
	service service.Level
}

func NewLevel(service service.Level) *Level {
	return &Level{service: service}
}

// @Summary Create level
// @Tags level
// @Description Create level with given structure
// @ID create-level
// @Accept mpfd
// @Produce json
// @Param level formData file true "Archive with level."
// @Param info formData file true "JSON file with level description."
// @Param preview formData file true "File with preview image of the level"
// @Success 200 {object} level.GetLevelInfoStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/create-level [post]
// @Security BearerAuth
func (h *Level) CreateLevel(c *gin.Context) {
	err := c.Request.ParseMultipartForm(1)
	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

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
		return
	}

	levelId, err := h.service.CreateLevel(userId.(int), levelFile, infoFile, previewFile)

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
// @Param id query int true "id of user you want to find"
// @Success 200 {file}  file "Archive with level."
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json; ERR_ENTITY_NOT_FOUND - no such level on server"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/download-level [get]
// @Security BearerAuth
func (h *Level) GetLevel(c *gin.Context) {
	var levelId int

	levelId, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	filePath, err := h.service.CheckLevelExists(levelId)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrEntityNotFound)
		return
	}

	parts := strings.Split(filePath, "/")
	c.FileAttachment(filePath, parts[len(parts)-1])
	return
}

// @Summary Get level info
// @Tags level
// @Description Get level info about level with given id
// @ID get-level-info
// @Accept json
// @Produce json
// @Param id query int true "id of user you want to find"
// @Success 200 {object} level.LevelInfo
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/get-level-info [get]
// @Security BearerAuth
func (h *Level) GetLevelInfoById(c *gin.Context) {
	var levId int

	levId, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	levelInfo, err := h.service.GetLevelById(levId)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	levelStats, err := h.service.GetLevelStats(levId)

	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	levelUserTop, err := h.service.GetLevelUserTop(levId)

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
// @Success 200 {object} level.GetLevelInfoStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired; ERR_PERMISSION_DENIED - Not enough rights to perform the action"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/update-level [put]
// @Security BearerAuth
func (h *Level) UpdateLevel(c *gin.Context) {
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
		return
	}

	levelId, err := h.service.UpdateLevel(userId.(int), levelFile, infoFile, previewFile)

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
// @Param input body level.FetchLevelStruct true "search and filter params"
// @Success 200 {object} level.LevelsList
// @Failure 400 {object} errorResponse "Possible messages: ERR_ACCESS_TOKEN_WRONG - Wrong structure of Access Token/No Access Token; ERR_INVALID_INPUT - Wrong structure of input json;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Access Token expired"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server"
// @Failure default {object} errorResponse
// @Router /level/get-level-list [post]
func (h *Level) GetLevelList(c *gin.Context) {
	var fetchParams level.FetchLevelStruct
	err := c.BindJSON(&fetchParams)

	if err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	levelList, err := h.service.GetLevelList(fetchParams)
	fmt.Println(err)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, level.LevelsList{Levels: levelList})
}
