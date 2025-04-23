package service

import (
	"encoding/json"
	"errors"
	"github.com/Gadzet005/GoType/backend/internal/domain"
	statistics "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	service2 "github.com/Gadzet005/GoType/backend/internal/service"
	mocks "github.com/Gadzet005/GoType/backend/tests/mocks/repository_mocks"
	"github.com/spf13/cast"
	"golang.org/x/exp/slices"
	"reflect"
	"testing"
)

func TestGetUserStats(t *testing.T) {
	repo := mocks.NewMockStats(t)
	service := service2.NewStatsService(repo)

	tests := map[string]struct {
		inputID       int
		mockReturn    statistics.PlayerStats
		mockError     error
		expectedStats statistics.PlayerStats
		expectedError error
	}{
		"success": {
			inputID: 1,
			mockReturn: statistics.PlayerStats{
				UserId:    1,
				UserName:  "player1",
				SumPoints: 100,
			},
			mockError: nil,
			expectedStats: statistics.PlayerStats{
				UserId:    1,
				UserName:  "player1",
				SumPoints: 100,
			},
			expectedError: nil,
		},
		"repo returns error": {
			inputID:       2,
			mockReturn:    statistics.PlayerStats{},
			mockError:     errors.New("repo error"),
			expectedStats: statistics.PlayerStats{},
			expectedError: errors.New("repo error"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			repo.On("GetUserStats", tc.inputID).Return(tc.mockReturn, tc.mockError).Once()

			stats, err := service.GetUserStats(tc.inputID)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && err.Error() != tc.expectedError.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err, tc.expectedError)
			}

			gotJSON, _ := json.Marshal(stats)
			expectedJSON, _ := json.Marshal(tc.expectedStats)

			if string(gotJSON) != string(expectedJSON) {
				t.Errorf("unexpected stats:\ngot      = %s\nexpected = %s", gotJSON, expectedJSON)
			}
		})
	}
}

func TestGetUsersTop(t *testing.T) {
	repo := mocks.NewMockStats(t)
	service := service2.NewStatsService(repo)

	tests := map[string]struct {
		inputParams   statistics.StatSortFilterParams
		mockReturn    []statistics.PlayerStats
		mockError     error
		expectedStats []statistics.PlayerStats
		expectedError error
	}{
		"default sort": {
			inputParams: statistics.StatSortFilterParams{
				PageInfo: statistics.PageInfo{
					PageSize: 10,
					Offset:   0,
				},
				CategoryParams: statistics.CategoryParams{
					Category: 'S',
					Pattern:  "",
				},
				Points: "",
			},
			mockReturn: []statistics.PlayerStats{
				{UserId: 1, UserName: "a", SumPoints: 50},
				{UserId: 2, UserName: "b", SumPoints: 60},
			},
			mockError: nil,
			expectedStats: []statistics.PlayerStats{
				{UserId: 1, UserName: "a", SumPoints: 50},
				{UserId: 2, UserName: "b", SumPoints: 60},
			},
			expectedError: nil,
		},
		"sort by category and pattern": {
			inputParams: statistics.StatSortFilterParams{
				PageInfo: statistics.PageInfo{
					PageSize: 5,
					Offset:   1,
				},
				CategoryParams: statistics.CategoryParams{
					Category: statistics.AvailableClasses[0],
					Pattern:  domain.SortingValues[0],
				},
				Points: "",
			},
			mockReturn: []statistics.PlayerStats{
				{UserId: 3, UserName: "x", SumPoints: 100},
			},
			mockError: nil,
			expectedStats: []statistics.PlayerStats{
				{UserId: 3, UserName: "x", SumPoints: 100},
			},
			expectedError: nil,
		},
		"sort by points overrides other sort": {
			inputParams: statistics.StatSortFilterParams{
				PageInfo: statistics.PageInfo{
					PageSize: 3,
					Offset:   2,
				},
				CategoryParams: statistics.CategoryParams{
					Category: statistics.AvailableClasses[0],
					Pattern:  domain.SortingValues[1],
				},
				Points: domain.SortingValues[0],
			},
			mockReturn: []statistics.PlayerStats{
				{UserId: 4, UserName: "z", SumPoints: 200},
			},
			mockError: nil,
			expectedStats: []statistics.PlayerStats{
				{UserId: 4, UserName: "z", SumPoints: 200},
			},
			expectedError: nil,
		},
		"repo returns error": {
			inputParams: statistics.StatSortFilterParams{
				PageInfo: statistics.PageInfo{
					PageSize: 10,
					Offset:   0,
				},
			},
			mockReturn:    nil,
			mockError:     errors.New("db failure"),
			expectedStats: nil,
			expectedError: errors.New("db failure"),
		},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			sortIndex := slices.Index(statistics.AvailableClasses, tc.inputParams.CategoryParams.Category)
			sortOrder := "desc"
			sortParam := "sum_points"

			if sortIndex != -1 && slices.Index(domain.SortingValues, tc.inputParams.CategoryParams.Pattern) != -1 {
				sortOrder = tc.inputParams.CategoryParams.Pattern
				sortParam = tc.inputParams.CategoryParams.Pattern
			}
			if slices.Index(domain.SortingValues, tc.inputParams.Points) != -1 {
				sortOrder = tc.inputParams.Points
				sortParam = "sum_points"
			}

			finalParams := map[string]interface{}{
				"sort_order": sortOrder,
				"sort_param": sortParam,
				"sort_index": cast.ToString(sortIndex),
				"page_size":  tc.inputParams.PageInfo.PageSize,
				"page_num":   tc.inputParams.PageInfo.Offset,
			}

			repo.On("GetUsersTop", finalParams).Return(tc.mockReturn, tc.mockError).Once()

			result, err := service.GetUsersTop(tc.inputParams)

			if (tc.expectedError == nil && err != nil) || (tc.expectedError != nil && err == nil) {
				t.Errorf("unexpected error: got %v, expected %v", err, tc.expectedError)
			}

			if tc.expectedError != nil && err != nil && tc.expectedError.Error() != err.Error() {
				t.Errorf("error mismatch: got %v, expected %v", err.Error(), tc.expectedError.Error())
			}

			if !reflect.DeepEqual(result, tc.expectedStats) {
				t.Errorf("unexpected result: got %+v, expected %+v", result, tc.expectedStats)
			}
		})
	}
}
