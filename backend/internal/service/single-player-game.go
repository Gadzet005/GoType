package service

import (
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/spf13/cast"
	"time"
)

type SinglePlayerGame struct {
	repo repository.SinglePlayerGame
}

func NewSinglePlayerGame(repo repository.SinglePlayerGame) *SinglePlayerGame {
	return &SinglePlayerGame{repo: repo}
}

func (s *SinglePlayerGame) SendResults(senderID int, lc statistics.LevelComplete) error {
	if senderID != lc.PlayerId {
		return errors.New(gotype.ErrPermissionDenied)
	}

	lc.Time = time.Now().Unix()

	totalCount := 0
	totalErr := 0

	for _, nums := range lc.NumPressErrByChar {
		if nums[1] >= 0 && totalErr <= totalCount {
			totalCount += nums[0]
			totalErr += nums[1]
		} else {
			return errors.New(gotype.ErrInvalidInput)
		}
	}

	lc.Accuracy = 1.0 - (cast.ToFloat64(totalErr) / cast.ToFloat64(totalCount))

	err := s.repo.SendResults(lc, totalCount, totalErr)

	if err != nil {
		return err
	}

	return nil
}
