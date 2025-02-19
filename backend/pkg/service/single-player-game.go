package service

import (
	"errors"
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/Gadzet005/GoType/backend/pkg/repository"
	"github.com/spf13/cast"
	"time"
)

type SinglePlayerGame struct {
	repo repository.SinglePlayerGame
}

func NewSinglePlayerGame(repo repository.SinglePlayerGame) *SinglePlayerGame {
	return &SinglePlayerGame{repo: repo}
}

func (s *SinglePlayerGame) SendResults(senderID int, lc entities.LevelComplete) error {
	if senderID != lc.PlayerId {
		return errors.New(gotype.ErrPermissionDenied)
	}

	lc.Time = time.Now().Unix()

	totalCount := 0
	totalErr := 0
	//TODO: проверка на больше меньше
	for _, nums := range lc.NumPressErrByChar {
		totalCount += nums[0]
		totalErr += nums[1]
	}

	lc.Accuracy = 1.0 - (cast.ToFloat64(totalErr) / cast.ToFloat64(totalCount))

	err := s.repo.SendResults(lc, totalCount, totalErr)

	if err != nil {
		return err
	}

	return nil
}
