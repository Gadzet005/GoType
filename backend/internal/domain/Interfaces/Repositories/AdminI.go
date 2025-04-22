package Repositories

import (
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"time"
)

type Admin interface {
	GetUserAccess(id int) (int, error)
	BanUser(userId int, expirationTime time.Time, reason string) error
	UnbanUser(userId int) error
	BanLevel(levelId int) error
	UnbanLevel(levelId int) error
	ChangeUserAccess(userId int, newAccess int) error
	GetUserComplaints(moderatorId int) ([]complaints.UserComplaint, error)
	GetLevelComplaints(moderatorId int) ([]complaints.LevelComplaint, error)
	DeleteUserComplaint(moderatorId int, complaintId int) error
	DeleteLevelComplaint(moderatorId int, complaintId int) error
	GetUsers(params user.UserSearchParams) ([]user.UserInfo, error)
}
