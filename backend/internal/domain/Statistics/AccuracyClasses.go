package domain

var AvailableClasses = []rune{'S', 'A', 'B', 'C', 'D'}

func GetClassIndexByAccuracy(accuracy float64) int {
	if accuracy > 0.95 {
		return 0
	} else if accuracy > 0.9 {
		return 1
	} else if accuracy > 0.8 {
		return 2
	} else if accuracy > 0.7 {
		return 3
	} else {
		return 4
	}
}
