package domain

import "time"

var UserComplaintReasons = [...]string{"Cheating", "Offencive nickname", "Unsportsmanlike conduct"}

type UserComplaint struct {
	Id           int       `json:"-" db:"id"`
	UserId       int       `json:"user_id" binding:"required" db:"user_id"`
	AuthorId     int       `json:"author_id" binding:"required"  db:"author"`
	CreationTime time.Time `json:"-" db:"time"`
	AssignedTo   int       `json:"-" db:"given_to"`
	Reason       string    `json:"reason" binding:"required" db:"reason"`
	Message      string    `json:"message" binding:"required" db:"message"`
}

type UserComplaints struct {
	UserComplaints []UserComplaint `json:"user_complaints"`
}
