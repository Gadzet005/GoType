package service

import (
	"database/sql"
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	"github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/mock"
	"mime/multipart"
	"testing"
	"time"
)

func TestDropRefreshToken(t *testing.T) {
	tests := []struct {
		name    string
		id      int
		mockErr error
		wantErr error
	}{
		{
			name:    "success",
			id:      1,
			mockErr: nil,
			wantErr: nil,
		},
		{
			name:    "error from repository",
			id:      1,
			mockErr: errors.New("db error"),
			wantErr: errors.New("db error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := mocks.NewMockUserActions(t)
			userActionsService := service.NewUserActionsService(repo, nil)

			repo.On("DropRefreshToken", tt.id, mock.AnythingOfType("time.Time")).Return(0, tt.mockErr).Once()

			err := userActionsService.DropRefreshToken(tt.id)

			if err != nil && err.Error() != tt.wantErr.Error() {
				t.Errorf("unexpected error: got %v, want %v", err, tt.wantErr)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestGetUserById(t *testing.T) {
	tests := []struct {
		name       string
		id         int
		mockReturn []interface{}
		mockErr    error
		wantName   string
		wantAccess int
		wantErr    error
		doCallRepo bool
	}{
		{
			name:       "success",
			id:         1,
			mockReturn: []interface{}{"user1", user.Admin, time.Now(), "No reason", sql.NullString{String: "path/to/avatar"}},
			mockErr:    nil,
			wantName:   "user1",
			wantAccess: user.Admin,
			wantErr:    nil,
			doCallRepo: true,
		},
		{
			name:       "error from repository",
			id:         1,
			mockReturn: nil,
			mockErr:    errors.New("db error"),
			wantName:   "",
			wantAccess: -1,
			wantErr:    errors.New("db error"),
			doCallRepo: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := mocks.NewMockUserActions(t)
			userActionsService := service.NewUserActionsService(repo, nil)

			if tt.doCallRepo {
				if tt.mockErr == nil {
					repo.On("GetUserById", tt.id).Return(
						tt.mockReturn[0], tt.mockReturn[1], tt.mockReturn[2].(time.Time),
						tt.mockReturn[3], tt.mockReturn[4].(sql.NullString), nil,
					).Once()
				} else {
					repo.On("GetUserById", tt.id).Return(
						"", -1, time.Now(), "", sql.NullString{String: ""}, tt.mockErr,
					).Once()
				}
			}

			name, access, _, _, _, err := userActionsService.GetUserById(tt.id)

			if err != nil && err.Error() != tt.wantErr.Error() {
				t.Errorf("unexpected error: got %v, want %v", err, tt.wantErr)
			}

			if name != tt.wantName {
				t.Errorf("unexpected name: got %v, want %v", name, tt.wantName)
			}

			if access != tt.wantAccess {
				t.Errorf("unexpected access level: got %v, want %v", access, tt.wantAccess)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestCreateUserComplaint(t *testing.T) {
	curTime := time.Now()

	tests := []struct {
		name      string
		complaint complaints.UserComplaint
		mockErr   error
		wantErr   error
	}{
		{
			name: "success",
			complaint: complaints.UserComplaint{
				UserId:       1,
				Reason:       "Violation",
				CreationTime: curTime,
			},
			mockErr: nil,
			wantErr: nil,
		},
		{
			name: "error from repository",
			complaint: complaints.UserComplaint{
				UserId:       1,
				Reason:       "Violation",
				CreationTime: curTime,
			},
			mockErr: errors.New("db error"),
			wantErr: errors.New("db error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := mocks.NewMockUserActions(t)
			userActionsService := service.NewUserActionsService(repo, nil)

			repo.On("CreateUserComplaint", mock.MatchedBy(func(c complaints.UserComplaint) bool {
				return c.UserId == tt.complaint.UserId && c.Reason == tt.complaint.Reason
			})).Return(tt.mockErr).Once()

			err := userActionsService.CreateUserComplaint(tt.complaint)

			if err != nil && err.Error() != tt.wantErr.Error() {
				t.Errorf("unexpected error: got %v, want %v", err, tt.wantErr)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestCreateLevelComplaint(t *testing.T) {
	curTime := time.Now()

	tests := []struct {
		name      string
		complaint complaints.LevelComplaint
		mockErr   error
		wantErr   error
	}{
		{
			name: "success",
			complaint: complaints.LevelComplaint{
				LevelId:      1,
				Reason:       "Violation",
				CreationTime: curTime,
			},
			mockErr: nil,
			wantErr: nil,
		},
		{
			name: "error from repository",
			complaint: complaints.LevelComplaint{
				LevelId:      1,
				Reason:       "Violation",
				CreationTime: curTime,
			},
			mockErr: errors.New("db error"),
			wantErr: errors.New("db error"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := mocks.NewMockUserActions(t)
			userActionsService := service.NewUserActionsService(repo, nil)

			repo.On("CreateLevelComplaint", mock.MatchedBy(func(c complaints.LevelComplaint) bool {
				return c.LevelId == tt.complaint.LevelId && c.Reason == tt.complaint.Reason
			})).Return(tt.mockErr).Once()

			err := userActionsService.CreateLevelComplaint(tt.complaint)

			if err != nil && err.Error() != tt.wantErr.Error() {
				t.Errorf("unexpected error: got %v, want %v", err, tt.wantErr)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestUpdateAvatar(t *testing.T) {
	mockFile := &multipart.FileHeader{
		Filename: "original.png",
	}

	userId := 1
	newPath := user.GenerateAvatarPath(userId)
	//newName := user.GenerateAvatarName(userId)
	oldAvatar := "old/path/avatar.png"

	tests := []struct {
		name         string
		avatarFile   *multipart.FileHeader
		oldPath      string
		updateErr    error
		deleteErr    error
		saveErr      error
		expectedErr  error
		expectDelete bool
		expectSave   bool
	}{
		{
			name:         "success with new avatar",
			avatarFile:   mockFile,
			oldPath:      oldAvatar,
			expectedErr:  nil,
			expectDelete: true,
			expectSave:   true,
		},
		{
			name:         "success with no avatar",
			avatarFile:   nil,
			oldPath:      "",
			expectedErr:  nil,
			expectDelete: false,
			expectSave:   false,
		},
		{
			name:         "repo error on update path",
			avatarFile:   mockFile,
			updateErr:    errors.New("db error"),
			expectedErr:  errors.New("db error"),
			expectDelete: false,
			expectSave:   false,
		},
		{
			name:         "delete file error (non-not-exist)",
			avatarFile:   mockFile,
			oldPath:      oldAvatar,
			deleteErr:    errors.New("permission denied"),
			expectedErr:  errors.New(gotype.ErrInternal),
			expectDelete: true,
			expectSave:   false,
		},
		{
			name:         "save file error",
			avatarFile:   mockFile,
			oldPath:      "",
			saveErr:      errors.New("disk full"),
			expectedErr:  errors.New(gotype.ErrInternal),
			expectDelete: false,
			expectSave:   true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := mocks.NewMockUserActions(t)
			storage := mocks.NewMockFileStorage(t)
			service := service.NewUserActionsService(repo, storage)

			newAvatarPath := ""
			if tt.avatarFile != nil {
				newAvatarPath = newPath
			}

			repo.On("UpdateAvatarPath", userId, newAvatarPath).Return(tt.oldPath, tt.updateErr).Once()

			if tt.expectDelete {
				storage.On("DeleteFile", tt.oldPath).Return(tt.deleteErr).Once()
			}

			if tt.expectSave {
				storage.On("SaveFile", mock.AnythingOfType("*multipart.FileHeader"), newAvatarPath).Return(tt.saveErr).Once()
			}

			err := service.UpdateAvatar(userId, tt.avatarFile)

			if (err == nil) != (tt.expectedErr == nil) || (err != nil && tt.expectedErr != nil && err.Error() != tt.expectedErr.Error()) {
				t.Errorf("unexpected error: got %v, want %v", err, tt.expectedErr)
			}

			repo.AssertExpectations(t)
			storage.AssertExpectations(t)
		})
	}
}
