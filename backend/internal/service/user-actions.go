package service

import (
	"database/sql"
	"errors"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	repository "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Repositories"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	"github.com/sirupsen/logrus"
	"mime/multipart"
	"os"
	"time"
)

type UserActionsService struct {
	repo        repository.UserActions
	fileStorage repository.Files
}

func NewUserActionsService(repo repository.UserActions, fileStorage repository.Files) *UserActionsService {
	return &UserActionsService{repo: repo, fileStorage: fileStorage}
}

func (s *UserActionsService) DropRefreshToken(id int) error {
	_, err := s.repo.DropRefreshToken(id, time.Now())

	if err != nil {
		return err
	}

	return nil
}

func (s *UserActionsService) GetUserById(id int) (string, int, time.Time, string, sql.NullString, error) {
	name, access, banTime, banReason, avatarPath, err := s.repo.GetUserById(id)

	if err != nil {
		return "", -1, time.Now(), "", sql.NullString{String: ""}, err
	}

	return name, access, banTime, banReason, avatarPath, nil
}

func (s *UserActionsService) CreateUserComplaint(complaint complaints.UserComplaint) error {
	complaint.CreationTime = time.Now().UTC()

	complaint.AssignedTo = -1
	err := s.repo.CreateUserComplaint(complaint)

	if err != nil {
		return err
	}

	return nil
}

func (s *UserActionsService) CreateLevelComplaint(complaint complaints.LevelComplaint) error {
	complaint.CreationTime = time.Now().UTC()

	complaint.AssignedTo = -1
	err := s.repo.CreateLevelComplaint(complaint)

	if err != nil {
		return err
	}

	return nil
}

func (s *UserActionsService) UpdateAvatar(userId int, avatarFile *multipart.FileHeader) error {
	var filename string
	var newPath string

	if avatarFile != nil {
		filename = user.GenerateAvatarName(userId)
		newPath = user.GenerateAvatarPath(userId)
	} else {
		newPath = ""
	}

	oldPath, err := s.repo.UpdateAvatarPath(userId, newPath)
	if err != nil {
		logrus.Printf("avatar update error: %v", err)
		return err
	}

	if oldPath != "" {
		err = s.fileStorage.DeleteFile(oldPath)
		if err != nil && !errors.Is(err, os.ErrNotExist) {
			logrus.Printf("Failed to remove old avatar %s: %v", oldPath, err)
			return errors.New(gotype.ErrInternal)
		}
	}

	if avatarFile != nil {
		avatarFile.Filename = filename
		err = s.fileStorage.SaveFile(avatarFile, newPath)
		if err != nil {
			logrus.Printf("Failed to save new avatar %s: %v", newPath, err)
			return errors.New(gotype.ErrInternal)
		}
	}

	return nil
}
