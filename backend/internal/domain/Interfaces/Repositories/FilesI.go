package Repositories

import "mime/multipart"

type Files interface {
	SaveFile(file *multipart.FileHeader, filePath string) error
	DeleteFile(filePath string) error
}
