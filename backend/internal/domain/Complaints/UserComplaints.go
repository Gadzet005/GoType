package domain

import "time"

var UserComplaintReasons = [...]string{"Cheating", "Offencive nickname", "Unsportsmanlike conduct"}

type UserComplaint struct {
	Id           int       `json:"id" db:"id" binding:"omitempty"`
	UserId       int       `json:"user_id" binding:"required" db:"user_id" example:"1"`
	AuthorId     int       `json:"author_id" binding:"required"  db:"author" example:"2"`
	CreationTime time.Time `json:"-" db:"time"`
	AssignedTo   int       `json:"-" db:"given_to"`
	Reason       string    `json:"reason" binding:"required" db:"reason" example:"Cheating" example:"Unsportsmanlike conduct"`
	Message      string    `json:"message" binding:"required" db:"message" example:"Ban this cheater" example:"He did not play fair"`
}

type UserComplaints struct {
	UserComplaints []UserComplaint `json:"user_complaints"`
}
