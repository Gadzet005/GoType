package repository

import (
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"os"
)

type LocalFileRepository struct{}

func NewLocalFileRepository() *LocalFileRepository {
	return &LocalFileRepository{}
}

func (r *LocalFileRepository) SaveFile(file *multipart.FileHeader, filePath string) error {
	ctx := &gin.Context{}
	return ctx.SaveUploadedFile(file, filePath)
}

func (r *LocalFileRepository) DeleteFile(path string) error {
	return os.Remove(path)
}
