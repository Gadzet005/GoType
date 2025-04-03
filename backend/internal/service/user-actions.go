package service

import (
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/sirupsen/logrus"
	"mime/multipart"
	"os"
	"time"
)

type UserActionsService struct {
	repo repository.UserActions
}

func NewUserActionsService(repo repository.UserActions) *UserActionsService {
	return &UserActionsService{repo: repo}
}

func (s *UserActionsService) DropRefreshToken(id int) error {
	_, err := s.repo.DropRefreshToken(id, time.Now())

	if err != nil {
		return err
	}

	return nil
}

func (s *UserActionsService) GetUserById(id int) (string, int, time.Time, string, string, error) {
	name, access, banTime, banReason, avatarPath, err := s.repo.GetUserById(id)

	if err != nil {
		return "", -1, time.Now(), "", "", err
	} //no such user

	return name, access, banTime, banReason, avatarPath, nil
}

func (s *UserActionsService) CreateUserComplaint(complaint complaints.UserComplaint) error {
	complaint.CreationTime = time.Now().UTC()

	err := s.repo.CreateUserComplaint(complaint)

	if err != nil {
		return err
	}

	return nil
}

func (s *UserActionsService) CreateLevelComplaint(complaint complaints.LevelComplaint) error {
	complaint.CreationTime = time.Now().UTC()

	err := s.repo.CreateLevelComplaint(complaint)

	if err != nil {
		return err
	}

	return nil
}

func (s *UserActionsService) UpdateAvatar(userId int, avatarFile *multipart.FileHeader) error {
	filename := ""

	if avatarFile != nil {
		filename = user.GenerateAvatarName(userId)
	}

	oldPath := ""
	if avatarFile != nil {
		err := errors.New("")
		oldPath, err = s.repo.UpdateAvatarPath(userId, user.GenerateAvatarPath(userId))

		if err != nil {
			logrus.Printf("avatar update error: %v", err)
			return err
		}
	} else {
		err := errors.New("")
		oldPath, err = s.repo.UpdateAvatarPath(userId, "")

		if err != nil {
			logrus.Printf("avatar update error: %v", err)
			return err
		}
	}

	err := os.Remove(oldPath)
	if err != nil && !errors.Is(err, os.ErrNotExist) {
		logrus.Printf("Failed to remove old avatar %s", oldPath)
		return errors.New(gotype.ErrInternal)
	}

	if avatarFile != nil {
		avatarFile.Filename = filename

		err = saveFile(avatarFile, user.GenerateAvatarPath(userId))
		if err != nil {
			logrus.Printf("Failed to save new archive %s", user.GenerateAvatarPath(userId))
			return errors.New(gotype.ErrInternal)
		}
	}

	return nil
}
