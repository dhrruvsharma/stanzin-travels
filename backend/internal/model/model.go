package model

import "time"

// Service types a customer can request. Day-by-day places are collected for
// DriverOnly and HotelOnly; for CompleteItinerary the team plans the route.
const (
	ServiceDriverOnly        = "driver_only"
	ServiceHotelOnly         = "hotel_only"
	ServiceCompleteItinerary = "complete_itinerary"
)

// Dashboard roles. Every new account starts as RoleUser and sees nothing
// until an admin promotes it; editors see bookings; admins see everything.
const (
	RoleAdmin  = "admin"
	RoleEditor = "editor"
	RoleUser   = "user"
)

// AdminUser is a dashboard account. PasswordHash is never serialized.
type AdminUser struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Phone        string    `json:"phone"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	PasswordHash string    `json:"-"`
}

// TripRequestFilter narrows the bookings list on the dashboard.
// Zero values mean "no constraint".
type TripRequestFilter struct {
	CreatedFrom string // created on/after this date (YYYY-MM-DD)
	CreatedTo   string // created on/before this date (YYYY-MM-DD)
	MinGroup    int
	MaxGroup    int
	MinDays     int // trip length in days, inclusive of both ends
	MaxDays     int
	Phone       string // substring of the customer phone
}

// Vehicle is one machine from the fleet shown on the home page.
type Vehicle struct {
	Slug     string `json:"slug"`
	Name     string `json:"name"`
	Kind     string `json:"kind"`
	Category string `json:"category"`
}

// DayPlan is where the group wants to be on one day of the trip.
type DayPlan struct {
	DayNumber int    `json:"day_number"`
	Place     string `json:"place"`
}

// TripRequest is a stored booking request.
type TripRequest struct {
	ID            string    `json:"id"`
	CustomerName  string    `json:"customer_name"`
	CustomerPhone string    `json:"customer_phone"`
	GroupSize     int       `json:"group_size"`
	ServiceType   string    `json:"service_type"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
	VehicleSlug   string    `json:"vehicle_slug"`
	Status        string    `json:"status"`
	DayPlans      []DayPlan `json:"day_plans"`
	CreatedAt     time.Time `json:"created_at"`
}

// CreateTripRequest is the payload accepted by POST /api/v1/trip-requests.
type CreateTripRequest struct {
	CustomerName  string    `json:"customer_name"`
	CustomerPhone string    `json:"customer_phone"`
	GroupSize     int       `json:"group_size"`
	ServiceType   string    `json:"service_type"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
	VehicleSlug   string    `json:"vehicle_slug"`
	DayPlans      []DayPlan `json:"day_plans"`
}

// Highest star rating a review can carry; ratings run 0..MaxRating.
const MaxRating = 5

// Review is a customer testimonial. One review is allowed per email address.
type Review struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Rating    int       `json:"rating"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"created_at"`
}

// PublicReview is the review projection shown on the public site. It omits the
// reviewer's contact details, which only the back office needs to see.
type PublicReview struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Rating    int       `json:"rating"`
	Body      string    `json:"body"`
	CreatedAt time.Time `json:"created_at"`
}

// CreateReview is the payload accepted by POST /api/v1/reviews.
type CreateReview struct {
	Name   string `json:"name"`
	Email  string `json:"email"`
	Rating int    `json:"rating"`
	Body   string `json:"body"`
}
