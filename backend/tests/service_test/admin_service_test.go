package service

import (
	"errors"
	bans "github.com/Gadzet005/GoType/backend/internal/domain/Bans"
	complaints "github.com/Gadzet005/GoType/backend/internal/domain/Complaints"
	user "github.com/Gadzet005/GoType/backend/internal/domain/User"
	useraccess "github.com/Gadzet005/GoType/backend/internal/domain/UserAccess"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	gotype "github.com/Gadzet005/GoType/backend/pkg"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/stretchr/testify/mock"
	"reflect"
	"testing"
)

func TestTryBanUser(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		ban           bans.UserBan
		mockReturn    int
		mockError     error
		expectedError error
		banError      error
		doCallBanUser bool
	}{
		"success": {
			adminAccess: user.Admin,
			ban: bans.UserBan{
				Id:        2,
				BanTime:   "48h",
				BanReason: "Violation",
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			banError:      nil,
			expectedError: nil,
			doCallBanUser: true,
		},
		"permission denied - insufficient admin access": {
			adminAccess: user.Moderator,
			ban: bans.UserBan{
				Id:        2,
				BanTime:   "48h",
				BanReason: "Violation",
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
			doCallBanUser: false,
		},
		"invalid duration format": {
			adminAccess: user.Admin,
			ban: bans.UserBan{
				Id:        2,
				BanTime:   "invalid_time",
				BanReason: "Violation",
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrInvalidInput),
			doCallBanUser: false,
		},
		"repository error on GetUserAccess": {
			adminAccess: user.Admin,
			ban: bans.UserBan{
				Id:        2,
				BanTime:   "48h",
				BanReason: "Violation",
			},
			mockReturn:    0,
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
			doCallBanUser: false,
		},
		"repository error on BanUser": {
			adminAccess: user.Admin,
			ban: bans.UserBan{
				Id:        2,
				BanTime:   "48h",
				BanReason: "Violation",
			},
			mockReturn:    user.Moderator,
			banError:      errors.New("db error"),
			expectedError: errors.New("db error"),
			doCallBanUser: true,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			repo.On("GetUserAccess", tc.ban.Id).Return(tc.mockReturn, tc.mockError).Once()

			if tc.doCallBanUser == true {
				repo.On("BanUser", tc.ban.Id, mock.Anything, tc.ban.BanReason).Return(tc.banError).Once()
			}

			err := adminService.TryBanUser(tc.adminAccess, tc.ban)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTryUnbanUser(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		unban         bans.UserUnban
		mockReturn    int
		mockError     error
		expectedError error
		banError      error
		doCallBanUser bool
	}{
		"success": {
			adminAccess: user.Admin,
			unban: bans.UserUnban{
				Id: 2,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: nil,
			doCallBanUser: true,
		},
		"permission denied - insufficient admin access": {
			adminAccess: user.Moderator,
			unban: bans.UserUnban{
				Id: 2,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
			doCallBanUser: false,
		},
		"permission denied - lower user access": {
			adminAccess: user.Authorized,
			unban: bans.UserUnban{
				Id: 2,
			},
			mockReturn:    user.Authorized,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
			doCallBanUser: false,
		},
		"repository error on GetUserAccess": {
			adminAccess: user.Admin,
			unban: bans.UserUnban{
				Id: 2,
			},
			mockReturn:    0,
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
			doCallBanUser: false,
		},
		"repository error on UnbanUser": {
			adminAccess: user.Admin,
			unban: bans.UserUnban{
				Id: 2,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			doCallBanUser: true,
			banError:      errors.New("db error"),
			expectedError: errors.New("db error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			repo.On("GetUserAccess", tc.unban.Id).Return(tc.mockReturn, tc.mockError).Once()

			if tc.doCallBanUser == true {
				repo.On("UnbanUser", tc.unban.Id).Return(tc.banError).Once()
			}

			err := adminService.TryUnbanUser(tc.adminAccess, tc.unban)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}
		})
	}
}

func TestTryBanLevel(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		ban           bans.LevelBan
		mockError     error
		expectedError error
		dontBan       bool
	}{
		"success": {
			adminAccess: user.Admin,
			ban: bans.LevelBan{
				Id: 2,
			},
			mockError:     nil,
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess: user.Authorized,
			ban: bans.LevelBan{
				Id: 2,
			},
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
		},
		"repository error on BanLevel": {
			adminAccess: user.Admin,
			ban: bans.LevelBan{
				Id: 2,
			},
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
			dontBan:       true,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontBan == true || name == "success" {
				repo.On("BanLevel", tc.ban.Id).Return(tc.mockError).Once()
			}

			err := adminService.TryBanLevel(tc.adminAccess, tc.ban)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTryUnbanLevel(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		ban           bans.LevelBan
		mockError     error
		expectedError error
		dontBan       bool
	}{
		"success": {
			adminAccess: user.Admin,
			ban: bans.LevelBan{
				Id: 2,
			},
			mockError:     nil,
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess: user.Authorized,
			ban: bans.LevelBan{
				Id: 2,
			},
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
		},
		"repository error on UnbanLevel": {
			adminAccess: user.Admin,
			ban: bans.LevelBan{
				Id: 2,
			},
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
			dontBan:       true,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontBan == true || name == "success" {
				repo.On("UnbanLevel", tc.ban.Id).Return(tc.mockError).Once()
			}

			err := adminService.TryUnbanLevel(tc.adminAccess, tc.ban)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTryChangeAccessLevel(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		ban           useraccess.ChangeUserAccess
		mockReturn    int
		mockError     error
		expectedError error
		doCallChange  bool
		changeErr     error
	}{
		"success": {
			adminAccess: user.Admin,
			ban: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: user.Moderator,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: nil,
			doCallChange:  true,
		},
		"permission denied - insufficient admin access": {
			adminAccess: user.Moderator,
			ban: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: user.Moderator,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
		},
		"permission denied - user access level higher": {
			adminAccess: user.Admin,
			ban: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: user.SeniorAdmin,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
		},
		"repository error on GetUserAccess": {
			adminAccess: user.Admin,
			ban: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: user.Moderator,
			},
			mockReturn:    0,
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
		},
		"repository error on ChangeUserAccess": {
			adminAccess: user.Admin,
			ban: useraccess.ChangeUserAccess{
				Id:        2,
				NewAccess: user.Moderator,
			},
			mockReturn:    user.Moderator,
			mockError:     nil,
			expectedError: errors.New("db error"),
			doCallChange:  true,
			changeErr:     errors.New("db error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			repo.On("GetUserAccess", tc.ban.Id).Return(tc.mockReturn, tc.mockError).Once()

			if tc.doCallChange == true {
				repo.On("ChangeUserAccess", tc.ban.Id, tc.ban.NewAccess).Return(tc.changeErr).Once()
			}

			err := adminService.TryChangeAccessLevel(tc.adminAccess, tc.ban)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestGetUserComplaints(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess        int
		adminId            int
		mockComplaints     []complaints.UserComplaint
		mockError          error
		expectedComplaints []complaints.UserComplaint
		expectedError      error
		dontCallFirst      bool
	}{
		"success": {
			adminAccess: user.Admin,
			adminId:     2,
			mockComplaints: []complaints.UserComplaint{
				{Id: 1, Message: "Test Complaint 1"},
				{Id: 2, Message: "Test Complaint 2"},
			},
			mockError: nil,
			expectedComplaints: []complaints.UserComplaint{
				{Id: 1, Message: "Test Complaint 1"},
				{Id: 2, Message: "Test Complaint 2"},
			},
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess:        user.Authorized,
			adminId:            2,
			mockComplaints:     nil,
			mockError:          nil,
			expectedComplaints: nil,
			dontCallFirst:      true,
			expectedError:      errors.New(gotype.ErrPermissionDenied),
		},
		"repository error on GetUserComplaints": {
			adminAccess:        user.Admin,
			adminId:            2,
			mockComplaints:     nil,
			mockError:          errors.New("db error"),
			expectedComplaints: nil,
			expectedError:      errors.New("db error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontCallFirst == false {
				repo.On("GetUserComplaints", tc.adminId).Return(tc.mockComplaints, tc.mockError).Once()
			}

			complaints, err := adminService.GetUserComplaints(tc.adminId, tc.adminAccess)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			if !reflect.DeepEqual(complaints, tc.expectedComplaints) {
				t.Errorf("unexpected complaints: got %v, expected %v", complaints, tc.expectedComplaints)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestGetLevelComplaints(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess        int
		adminId            int
		mockComplaints     []complaints.LevelComplaint
		mockError          error
		expectedComplaints []complaints.LevelComplaint
		expectedError      error
		dontCallFirst      bool
	}{
		"success": {
			adminAccess: user.Admin,
			adminId:     2,
			mockComplaints: []complaints.LevelComplaint{
				{Id: 1, Message: "Test Complaint 1"},
				{Id: 2, Message: "Test Complaint 2"},
			},
			mockError: nil,
			expectedComplaints: []complaints.LevelComplaint{
				{Id: 1, Message: "Test Complaint 1"},
				{Id: 2, Message: "Test Complaint 2"},
			},
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess:        user.Authorized,
			adminId:            2,
			mockComplaints:     nil,
			mockError:          nil,
			expectedComplaints: nil,
			dontCallFirst:      true,
			expectedError:      errors.New(gotype.ErrPermissionDenied),
		},
		"repository error on GetLevelComplaints": {
			adminAccess:        user.Admin,
			adminId:            2,
			mockComplaints:     nil,
			mockError:          errors.New("db error"),
			expectedComplaints: nil,
			expectedError:      errors.New("db error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontCallFirst == false {
				repo.On("GetLevelComplaints", tc.adminId).Return(tc.mockComplaints, tc.mockError).Once()
			}

			complaints, err := adminService.GetLevelComplaints(tc.adminId, tc.adminAccess)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			if !reflect.DeepEqual(complaints, tc.expectedComplaints) {
				t.Errorf("unexpected complaints: got %v, expected %v", complaints, tc.expectedComplaints)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestProcessUserComplaint(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		adminId       int
		complaintId   int
		mockError     error
		expectedError error
		dontCallFirst bool
	}{
		"success": {
			adminAccess:   user.Admin,
			adminId:       2,
			complaintId:   1,
			mockError:     nil,
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess:   user.Authorized,
			adminId:       2,
			complaintId:   1,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
			dontCallFirst: true,
		},
		"repository error on DeleteUserComplaint": {
			adminAccess:   user.Admin,
			adminId:       2,
			complaintId:   1,
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontCallFirst == false {
				repo.On("DeleteUserComplaint", tc.adminId, tc.complaintId).Return(tc.mockError).Once()
			}

			err := adminService.ProcessUserComplaint(tc.adminId, tc.adminAccess, tc.complaintId)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestProcessLevelComplaint(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		adminId       int
		complaintId   int
		mockError     error
		expectedError error
		dontCallFirst bool
	}{
		"success": {
			adminAccess:   user.Admin,
			adminId:       2,
			complaintId:   1,
			mockError:     nil,
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess:   user.Authorized,
			adminId:       2,
			complaintId:   1,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
			dontCallFirst: true,
		},
		"repository error on DeleteLevelComplaint": {
			adminAccess:   user.Admin,
			adminId:       2,
			complaintId:   1,
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontCallFirst == false {
				repo.On("DeleteLevelComplaint", tc.adminId, tc.complaintId).Return(tc.mockError).Once()
			}

			err := adminService.ProcessLevelComplaint(tc.adminId, tc.adminAccess, tc.complaintId)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestGetUsers(t *testing.T) {
	repo := mocks.NewMockAdmin(t)
	adminService := service2.NewAdminService(repo)

	tests := map[string]struct {
		adminAccess   int
		searchParams  user.UserSearchParams
		mockReturn    []user.UserInfo
		mockError     error
		expectedError error
		dontCallFirst bool
	}{
		"success": {
			adminAccess: user.Admin,
			searchParams: user.UserSearchParams{
				Name: "testuser",
			},
			mockReturn: []user.UserInfo{
				{
					Id:   1,
					Name: "testuser",
				},
			},
			mockError:     nil,
			expectedError: nil,
		},
		"permission denied - insufficient admin access": {
			adminAccess: user.Authorized,
			searchParams: user.UserSearchParams{
				Name: "testuser",
			},
			mockReturn:    nil,
			mockError:     nil,
			expectedError: errors.New(gotype.ErrPermissionDenied),
			dontCallFirst: true,
		},
		"repository error on GetUsers": {
			adminAccess: user.Admin,
			searchParams: user.UserSearchParams{
				Name: "testuser",
			},
			mockReturn:    nil,
			mockError:     errors.New("db error"),
			expectedError: errors.New("db error"),
		},
		"empty search results": {
			adminAccess: user.Admin,
			searchParams: user.UserSearchParams{
				Name: "nonexistentuser",
			},
			mockReturn:    nil,
			mockError:     nil,
			expectedError: nil,
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			if tc.dontCallFirst == false {
				repo.On("GetUsers", tc.searchParams).Return(tc.mockReturn, tc.mockError).Once()
			}

			users, err := adminService.GetUsers(tc.adminAccess, tc.searchParams)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			if tc.expectedError == nil && len(users) != len(tc.mockReturn) {
				t.Errorf("unexpected result: got %+v, expected %+v", users, tc.mockReturn)
			}

			repo.AssertExpectations(t)
		})
	}
}
