package domain

type UserBan struct {
	Id        int    `json:"id" binding:"required"`
	BanTime   string `json:"ban_time" binding:"required"`
	BanReason string `json:"ban_reason" binding:"required"`
}
