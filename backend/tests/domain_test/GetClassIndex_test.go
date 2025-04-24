package domain_test

import (
	domain "github.com/Gadzet005/GoType/backend/internal/domain/Statistics"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestGetClassIndex(t *testing.T) {
	tests := map[string]struct {
		input float64
		ret   int
	}{
		"class 4": {input: 0.6, ret: 4},
		"class 3": {input: 0.75, ret: 3},
		"class 2": {input: 0.85, ret: 2},
		"class 1": {input: 0.95, ret: 1},
		"class 0": {input: 1, ret: 0},
	}

	for name, test := range tests {
		t.Run(name, func(t *testing.T) {
			ret := domain.GetClassIndexByAccuracy(test.input)
			assert.Equal(t, test.ret, ret)
		})
	}
}
