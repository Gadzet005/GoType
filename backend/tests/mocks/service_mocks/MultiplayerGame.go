// Code generated by mockery v2.53.3. DO NOT EDIT.

package mocks

import mock "github.com/stretchr/testify/mock"

// MultiplayerGame is an autogenerated mock type for the MultiplayerGame type
type MultiplayerGame struct {
	mock.Mock
}

// NewMultiplayerGame creates a new instance of MultiplayerGame. It also registers a testing interface on the mock and a cleanup function to assert the mocks expectations.
// The first argument is typically a *testing.T value.
func NewMockMultiplayerGame(t interface {
	mock.TestingT
	Cleanup(func())
}) *MultiplayerGame {
	mock := &MultiplayerGame{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
