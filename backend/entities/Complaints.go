package entities

import "time"

var UserComplaintReasons = [...]string{"Cheating", "Offencive nickname", "Unsportsmanlike conduct"}
var LevelComplaintReasons = [...]string{"Offencive name", "Offencive video", "Offencive audio", "Offencive text"}

type UserComplaint struct {
	Id           int       `json:"-" db:"id"`
	UserId       int       `json:"user_id" binding:"required" db:"user_id"`
	AuthorId     int       `json:"author_id" binding:"required"  db:"author"`
	CreationTime time.Time `json:"-" db:"time"`
	AssignedTo   int       `json:"-" db:"given_to"`
	Reason       string    `json:"reason" binding:"required" db:"reason"`
	Message      string    `json:"message" binding:"required" db:"message"`
}

type LevelComplaint struct {
	Id           int       `json:"-" db:"id"`
	LevelId      int       `json:"level_id" binding:"required" db:"level_id"`
	AuthorId     int       `json:"author_id" binding:"required"  db:"author"`
	CreationTime time.Time `json:"-" db:"time"`
	AssignedTo   int       `json:"-" db:"given_to"`
	Reason       string    `json:"reason" binding:"required" db:"reason"`
	Message      string    `json:"message" binding:"required" db:"message"`
}

type UserComplaints struct {
	UserComplaints []UserComplaint `json:"user_complaints"`
}

type LevelComplaints struct {
	LevelComplaints []LevelComplaint `json:"level_complaints"`
}

// swagger:model
type ComplaintID struct {
	Id int `json:"id" binding:"required"`
}
