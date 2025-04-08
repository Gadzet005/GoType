// Code generated by mockery v2.53.3. DO NOT EDIT.

package mocks

import (
	domain "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	mock "github.com/stretchr/testify/mock"
)

// Stats is an autogenerated mock type for the Stats type
type Stats struct {
	mock.Mock
}

// GetUserStats provides a mock function with given fields: id
func (_m *Stats) GetUserStats(id int) (domain.PlayerStats, error) {
	ret := _m.Called(id)

	if len(ret) == 0 {
		panic("no return value specified for GetUserStats")
	}

	var r0 domain.PlayerStats
	var r1 error
	if rf, ok := ret.Get(0).(func(int) (domain.PlayerStats, error)); ok {
		return rf(id)
	}
	if rf, ok := ret.Get(0).(func(int) domain.PlayerStats); ok {
		r0 = rf(id)
	} else {
		r0 = ret.Get(0).(domain.PlayerStats)
	}

	if rf, ok := ret.Get(1).(func(int) error); ok {
		r1 = rf(id)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetUsersTop provides a mock function with given fields: params
func (_m *Stats) GetUsersTop(params domain.StatSortFilterParams) ([]domain.PlayerStats, error) {
	ret := _m.Called(params)

	if len(ret) == 0 {
		panic("no return value specified for GetUsersTop")
	}

	var r0 []domain.PlayerStats
	var r1 error
	if rf, ok := ret.Get(0).(func(domain.StatSortFilterParams) ([]domain.PlayerStats, error)); ok {
		return rf(params)
	}
	if rf, ok := ret.Get(0).(func(domain.StatSortFilterParams) []domain.PlayerStats); ok {
		r0 = rf(params)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).([]domain.PlayerStats)
		}
	}

	if rf, ok := ret.Get(1).(func(domain.StatSortFilterParams) error); ok {
		r1 = rf(params)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// NewStats creates a new instance of Stats. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewMockStats(t interface {
	mock.TestingT
	Cleanup(func())
}) *Stats {
	mock := &Stats{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
