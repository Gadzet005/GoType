package Services

import (
	bans "github.com/Gadzet005/GoType/backend/internal/domain/Bans"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	useraccess "github.com/Gadzet005/GoType/backend/internal/domain/UserAccess"
)

type Admin interface {
	TryBanUser(adminAccess int, ban bans.UserBan) error
	TryUnbanUser(adminAccess int, ban bans.UserUnban) error
	TryBanLevel(adminAccess int, ban bans.LevelBan) error
	TryUnbanLevel(adminAccess int, ban bans.LevelBan) error
	TryChangeAccessLevel(adminAccess int, ban useraccess.ChangeUserAccess) error
	GetUserComplaints(adminId int, adminAccess int) ([]complaints.UserComplaint, error)
	GetLevelComplaints(adminId int, adminAccess int) ([]complaints.LevelComplaint, error)
	ProcessUserComplaint(adminId int, adminAccess int, complaintId int) error
	ProcessLevelComplaint(adminId int, adminAccess int, complaintId int) error
	GetUsers(adminAccess int, searchParams user.UserSearchParams) ([]user.UserInfo, error)
}
