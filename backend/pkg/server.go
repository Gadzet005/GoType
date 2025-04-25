package gotype

import (
	"context"
	"net/http"
	"time"
)

const (
	PreviewDirName = "previews"
	LevelDirName   = "levels"
	AvatarDirName  = "avatars"
)

type Server struct {
	httpServer *http.Server
}

func (s *Server) Run(port string, handler http.Handler) error {
	s.httpServer = &http.Server{
		Addr:           ":" + port,
		Handler:        handler,
		MaxHeaderBytes: 1 << 20, // 1 MB
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
	}

	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	//_ = os.RemoveAll(LevelDirName)
	//_ = os.RemoveAll(PreviewDirName)
	//_ = os.RemoveAll(AvatarDirName)

	return s.httpServer.Shutdown(ctx)
}
