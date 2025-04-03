package domain

import "time"

var LevelComplaintReasons = [...]string{"Offencive name", "Offencive video", "Offencive audio", "Offencive text"}

type LevelComplaint struct {
	Id           int       `json:"-" db:"id"`
	LevelId      int       `json:"level_id" binding:"required" db:"level_id"`
	AuthorId     int       `json:"author_id" binding:"required"  db:"author"`
	CreationTime time.Time `json:"-" db:"time"`
	AssignedTo   int       `json:"-" db:"given_to"`
	Reason       string    `json:"reason" binding:"required" db:"reason"`
	Message      string    `json:"message" binding:"required" db:"message"`
}

type LevelComplaints struct {
	LevelComplaints []LevelComplaint `json:"level_complaints"`
}
