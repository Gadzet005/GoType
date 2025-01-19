package handler

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/gin-gonic/gin"
	"net/http"
)

// @Summary Register
// @Tags auth
// @Description create new account
// @ID create-account
// @Accept json
// @Produce json
// @Param input body entities.User true "new account info"
// @Success 200 {object} handler.refreshStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_INVALID_INPUT - Wrong structure of input json; ERR_USER_EXISTS - User with such name already exists;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server; "
// @Failure default {object} errorResponse
// @Router /auth/register [post]
func (h *Handler) register(c *gin.Context) {
	var input entities.User

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	accessToken, refreshToken, err := h.services.Authorization.CreateUser(input)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

// @Summary Login
// @Tags auth
// @Description authorize using login and password
// @ID login
// @Accept json
// @Produce json
// @Param input body entities.User true "login and password"
// @Success 200 {object} handler.refreshStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_INVALID_INPUT - Wrong structure of input json; ERR_NO_SUCH_USER - User with such name and password does not exist;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server; "
// @Failure default {object} errorResponse
// @Router /auth/login [post]
func (h *Handler) login(c *gin.Context) {
	var input entities.User

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	refreshToken, accessToken, err := h.services.Authorization.GenerateToken(input.Name, input.Password)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

type refreshStruct struct {
	RefreshToken string `json:"refresh_token"`
	AccessToken  string `json:"access_token"`
}

// @Summary Refresh
// @Tags auth
// @Description get new access token and refresh token by existing access token and refresh token
// @ID refresh
// @Accept json
// @Produce json
// @Param input body handler.refreshStruct true "RefreshToken and AccessToken"
// @Success 200 {object} handler.refreshStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_INVALID_INPUT - Wrong structure of input json; ERR_NO_SUCH_USER - User with id as in access token does not exist; ERR_ACCESS_TOKEN_WRONG - Wrong access token; ERR_REFRESH_TOKEN_WRONG - Wrong refresh token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Refresh token expired;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server; "
// @Failure default {object} errorResponse
// @Router /auth/refresh [post]
func (h *Handler) refresh(c *gin.Context) {
	var input refreshStruct

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	refreshToken, accessToken, err := h.services.Authorization.GenerateTokenByToken(input.AccessToken, input.RefreshToken)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}
