package mocks

import (
	"github.com/stretchr/testify/mock"
	"mime/multipart"
)

type MockFileStorage struct {
	mock.Mock
}

func NewMockFileStorage(t mock.TestingT) *MockFileStorage {
	m := &MockFileStorage{}
	m.Mock.Test(t)
	return m
}

func (m *MockFileStorage) SaveFile(file *multipart.FileHeader, filePath string) error {
	args := m.Called(file, filePath)
	return args.Error(0)
}

func (m *MockFileStorage) DeleteFile(path string) error {
	args := m.Called(path)
	return args.Error(0)
}
