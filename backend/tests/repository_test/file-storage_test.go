package repository_test

import (
	"bytes"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"mime/multipart"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestLocalFileRepository_SaveFile(t *testing.T) {
	repo := &repository.LocalFileRepository{}

	var b bytes.Buffer
	writer := multipart.NewWriter(&b)

	fileWriter, err := writer.CreateFormFile("file", "testfile.txt")
	assert.NoError(t, err)

	content := []byte("hello test file")
	_, err = fileWriter.Write(content)
	assert.NoError(t, err)

	writer.Close()

	req := httptest.NewRequest("POST", "/", &b)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	c, _ := gin.CreateTestContext(nil)
	c.Request = req

	err = req.ParseMultipartForm(10 << 20)
	assert.NoError(t, err)

	file, fileHeader, err := req.FormFile("file")
	assert.NoError(t, err)
	defer file.Close()

	tmpDir := t.TempDir()
	savePath := filepath.Join(tmpDir, "saved.txt")

	err = repo.SaveFile(fileHeader, savePath)
	assert.NoError(t, err)
	
	saved, err := os.ReadFile(savePath)
	assert.NoError(t, err)
	assert.Equal(t, content, saved)
}

func TestLocalFileRepository_DeleteFile(t *testing.T) {
	repo := &repository.LocalFileRepository{}

	tmpDir := t.TempDir()
	testPath := filepath.Join(tmpDir, "todelete.txt")
	err := os.WriteFile(testPath, []byte("delete me"), 0644)
	assert.NoError(t, err)

	_, err = os.Stat(testPath)
	assert.NoError(t, err)

	err = repo.DeleteFile(testPath)
	assert.NoError(t, err)
	_, err = os.Stat(testPath)
	assert.ErrorIs(t, err, os.ErrNotExist)
}
