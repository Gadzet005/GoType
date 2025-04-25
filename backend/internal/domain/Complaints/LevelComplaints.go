package domain

import "time"

var LevelComplaintReasons = [...]string{"Offencive name", "Offencive video", "Offencive audio", "Offencive text"}

type LevelComplaint struct {
	Id           int       `json:"id" db:"id" binding:"omitempty"`
	LevelId      int       `json:"level_id" binding:"required" db:"level_id" example:"2"`
	AuthorId     int       `json:"author_id" binding:"required"  db:"author" example:"4"`
	CreationTime time.Time `json:"-" db:"time"`
	AssignedTo   int       `json:"-" db:"given_to"`
	Reason       string    `json:"reason" binding:"required" db:"reason" example:"Offencive name" example:"Offencive video"`
	Message      string    `json:"message" binding:"required" db:"message" example:"The name of this is offencive."`
}

type LevelComplaints struct {
	LevelComplaints []LevelComplaint `json:"level_complaints"`
}
