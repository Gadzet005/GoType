package service

import (
	"fmt"
	"github.com/Gadzet005/GoType/backend/internal/domain"
	repository "github.com/Gadzet005/GoType/backend/internal/domain/Interfaces/Repositories"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/spf13/cast"
	"slices"
)

type StatsService struct {
	repo repository.Stats
}

func NewStatsService(repo repository.Stats) *StatsService {
	return &StatsService{repo: repo}
}

func (s *StatsService) GetUserStats(id int) (statistics.PlayerStats, error) {
	playerStats, err := s.repo.GetUserStats(id)

	if err != nil {
		return statistics.PlayerStats{}, err
	}

	return playerStats, nil
}

func (s *StatsService) GetUsersTop(params statistics.StatSortFilterParams) ([]statistics.PlayerStats, error) {
	sortOrder, sortParam, sortIndex := "desc", "sum_points", -1

	fmt.Printf("%v", params)

	if sortIndex = slices.Index(statistics.AvailableClasses, params.CategoryParams.Category); sortIndex != -1 {
		if slices.Index(domain.SortingValues, params.CategoryParams.Pattern) != -1 {
			sortOrder = params.CategoryParams.Pattern
		}

		if params.CategoryParams.Pattern != "" {
			sortParam = params.CategoryParams.Pattern
		}
	}

	if slices.Index(domain.SortingValues, params.Points) != -1 {
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
