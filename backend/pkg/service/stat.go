package service

import (
	"github.com/Gadzet005/GoType/backend/entities"
	"github.com/Gadzet005/GoType/backend/pkg/repository"
	"github.com/spf13/cast"
	"slices"
)

type StatsService struct {
	repo repository.Stats
}

func NewStatsService(repo repository.Stats) *StatsService {
	return &StatsService{repo: repo}
}

func (s *StatsService) GetUserStats(id int) (entities.PlayerStats, error) {
	playerStats, err := s.repo.GetUserStats(id)

	if err != nil {
		return entities.PlayerStats{}, err
	}

	return playerStats, nil
}

func (s *StatsService) GetUsersTop(params entities.StatSortFilterParams) ([]entities.PlayerStats, error) {
	sortOrder, sortParam, sortIndex := "desc", "sum_points", -1

	if sortIndex = slices.Index(entities.AvailableClasses, params.CategoryParams.Category); sortIndex != -1 {
		if slices.Index(entities.SortingValues, params.CategoryParams.Pattern) != -1 {
			sortOrder = params.CategoryParams.Pattern
		}

		sortParam = params.CategoryParams.Pattern
	}

	if slices.Index(entities.SortingValues, params.Points) != -1 {
		sortOrder = params.Points
		sortParam = "sum_points"
	}

	finalParams := map[string]interface{}{
		"sort_order": sortOrder,
		"sort_param": sortParam,
		"sort_index": cast.ToString(sortIndex),
		"page_size":  params.PageInfo.PageSize,
		"page_num":   params.PageInfo.Offset,
	}

	playerStats, err := s.repo.GetUsersTop(finalParams)

	if err != nil {
		return nil, err
	}

	return playerStats, nil
}
