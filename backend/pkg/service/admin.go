package service

import (
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/Gadzet005/GoType/backend/pkg/repository"
	"time"
)

type AdminService struct {
	repo repository.Admin
}

func NewAdminService(repo repository.Admin) *AdminService {
	return &AdminService{repo: repo}
}

func (s *AdminService) TryBanUser(adminAccess int, ban entities.UserBan) error {

	bannedUserAccess, err := s.repo.GetUserAccess(ban.Id)

	if err != nil {
		return err
	}

	if adminAccess <= bannedUserAccess || adminAccess < entities.Moderator {
		return errors.New(gotype.ErrPermissionDenied)
	}

	duration, err := time.ParseDuration(ban.BanTime)

	if err != nil {
		return errors.New(gotype.ErrInvalidInput)
	}

	endTime := time.Now().Add(duration).UTC()

	err = s.repo.BanUser(ban.Id, endTime, ban.BanReason)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) TryUnbanUser(adminAccess int, ban entities.UserUnban) error {
	bannedUserAccess, err := s.repo.GetUserAccess(ban.Id)

	if err != nil {
		return err
	}

	if adminAccess <= bannedUserAccess || adminAccess < entities.Moderator {
		return errors.New(gotype.ErrPermissionDenied)
	}

	err = s.repo.UnbanUser(ban.Id)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) TryBanLevel(adminAccess int, ban entities.LevelBan) error {
	if adminAccess < entities.Moderator {
		return errors.New(gotype.ErrPermissionDenied)
	}

	err := s.repo.BanLevel(ban.Id)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) TryUnbanLevel(adminAccess int, ban entities.LevelBan) error {

	if adminAccess < entities.Moderator {
		return errors.New(gotype.ErrPermissionDenied)
	}

	err := s.repo.UnbanLevel(ban.Id)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) TryChangeAccessLevel(adminAccess int, ban entities.ChangeUserAccess) error {
	bannedUserAccess, err := s.repo.GetUserAccess(ban.Id)

	if err != nil {
		return err
	}

	if bannedUserAccess >= adminAccess || adminAccess < entities.Moderator || ban.NewAccess >= adminAccess {
		return errors.New(gotype.ErrPermissionDenied)
	}

	err = s.repo.ChangeUserAccess(ban.Id, ban.NewAccess)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) GetUserComplaints(adminId int, adminAccess int) ([]entities.UserComplaint, error) {
	if adminAccess < entities.Moderator {
		return nil, errors.New(gotype.ErrPermissionDenied)
	}

	userComplaints, err := s.repo.GetUserComplaints(adminId)

	if err != nil {
		return nil, err
	}

	return userComplaints, nil
}

func (s *AdminService) GetLevelComplaints(adminId int, adminAccess int) ([]entities.LevelComplaint, error) {
	if adminAccess < entities.Moderator {
		return nil, errors.New(gotype.ErrPermissionDenied)
	}

	levelComplaints, err := s.repo.GetLevelComplaints(adminId)

	if err != nil {
		return nil, err
	}

	return levelComplaints, nil
}

func (s *AdminService) ProcessUserComplaint(adminId int, adminAccess int, complaintId int) error {
	if adminAccess < entities.Moderator {
		return errors.New(gotype.ErrPermissionDenied)
	}

	err := s.repo.DeleteUserComplaint(adminId, complaintId)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) ProcessLevelComplaint(adminId int, adminAccess int, complaintId int) error {
	if adminAccess < entities.Moderator {
		return errors.New(gotype.ErrPermissionDenied)
	}

	err := s.repo.DeleteLevelComplaint(adminId, complaintId)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminService) GetUsers(adminAccess int, searchParams entities.UserSearchParams) ([]entities.UserInfo, error) {
	if adminAccess < entities.Moderator {
		return nil, errors.New(gotype.ErrPermissionDenied)
	}

	users, err := s.repo.GetUsers(searchParams)

	if err != nil {
		return nil, err
	}

	return users, nil
}
