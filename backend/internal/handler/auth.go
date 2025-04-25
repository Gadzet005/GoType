package handler

import (
	service "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Services"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Auth struct {
	service service.Authorization
}

func NewAuth(service service.Authorization) *Auth {
	return &Auth{service: service}
}

// @Summary Register
// @Tags auth
// @Description create new account
// @ID create-account
// @Accept json
// @Produce json
// @Param input body user.User true "new account info"
// @Success 200 {object} user.RefreshStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_INVALID_INPUT - Wrong structure of input json; ERR_USER_EXISTS - User with such name already exists;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server; "
// @Failure default {object} errorResponse
// @Router /auth/register [post]
func (h *Auth) Register(c *gin.Context) {
	var input user.User
	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	accessToken, refreshToken, err := h.service.CreateUser(input)
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
// @Param input body user.User true "login and password"
// @Success 200 {object} user.RefreshStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_INVALID_INPUT - Wrong structure of input json; ERR_NO_SUCH_USER - User with such name and password does not exist;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server; "
// @Failure default {object} errorResponse
// @Router /auth/login [post]
func (h *Auth) Login(c *gin.Context) {
	var input user.User

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	refreshToken, accessToken, err := h.service.GenerateToken(input.Name, input.Password)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

// @Summary Refresh
// @Tags auth
// @Description get new access token and refresh token by existing access token and refresh token
// @ID refresh
// @Accept json
// @Produce json
// @Param input body user.RefreshStruct true "RefreshToken and AccessToken"
// @Success 200 {object} user.RefreshStruct
// @Failure 400 {object} errorResponse "Possible messages: ERR_INVALID_INPUT - Wrong structure of input json; ERR_NO_SUCH_USER - User with id as in access token does not exist; ERR_ACCESS_TOKEN_WRONG - Wrong access token; ERR_REFRESH_TOKEN_WRONG - Wrong refresh token;"
// @Failure 401 {object} errorResponse "Possible messages: ERR_UNAUTHORIZED - Refresh token expired;"
// @Failure 500 {object} errorResponse "Possible messages: ERR_INTERNAL - Error on server; "
// @Failure default {object} errorResponse
// @Router /auth/refresh [post]
func (h *Auth) Refresh(c *gin.Context) {
	var input user.RefreshStruct

	if err := c.BindJSON(&input); err != nil {
		NewErrorResponse(c, http.StatusBadRequest, gotype.ErrInvalidInput)
		return
	}

	refreshToken, accessToken, err := h.service.GenerateTokenByToken(input.AccessToken, input.RefreshToken)
	if err != nil {
		NewErrorResponse(c, gotype.CodeErrors[err.Error()], err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}
