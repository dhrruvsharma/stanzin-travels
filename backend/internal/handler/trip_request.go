package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"stanzin-travels-backend/internal/model"
	"stanzin-travels-backend/internal/repository"
)

const (
	maxNameLength = 120
	maxPlaceLen   = 160
	maxGroupSize  = 50
	maxTripDays   = 30
	listLimit     = 100
)

var phonePattern = regexp.MustCompile(`^\+?[0-9][0-9 \-]{6,17}$`)

// Handler serves the trip-request API.
type Handler struct {
	repo      *repository.Repository
	jwtSecret string
}

func New(repo *repository.Repository, jwtSecret string) *Handler {
	return &Handler{repo: repo, jwtSecret: jwtSecret}
}

// ListVehicles handles GET /api/v1/vehicles.
func (h *Handler) ListVehicles(w http.ResponseWriter, r *http.Request) {
	vehicles, err := h.repo.ListVehicles(r.Context())
	if err != nil {
		log.Printf("list vehicles: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not load the fleet")
		return
	}
	writeSuccess(w, http.StatusOK, vehicles)
}

// CreateTripRequest handles POST /api/v1/trip-requests.
func (h *Handler) CreateTripRequest(w http.ResponseWriter, r *http.Request) {
	var req model.CreateTripRequest
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if msg := h.validate(r, &req); msg != "" {
		writeError(w, http.StatusBadRequest, msg)
		return
	}

	trip, err := h.repo.CreateTripRequest(r.Context(), req)
	if err != nil {
		log.Printf("create trip request: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not save the trip request")
		return
	}
	writeSuccess(w, http.StatusCreated, trip)
}

// ListTripRequests handles GET /api/v1/trip-requests (admin and editor).
// Supported query params: created_from, created_to (YYYY-MM-DD),
// min_group, max_group, min_days, max_days, phone.
func (h *Handler) ListTripRequests(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	intParam := func(key string) int {
		n, err := strconv.Atoi(q.Get(key))
		if err != nil || n < 0 {
			return 0
		}
		return n
	}
	dateParam := func(key string) string {
		v := strings.TrimSpace(q.Get(key))
		if v == "" {
			return ""
		}
		if _, err := time.Parse(time.DateOnly, v); err != nil {
			return ""
		}
		return v
	}

	filter := model.TripRequestFilter{
		CreatedFrom: dateParam("created_from"),
		CreatedTo:   dateParam("created_to"),
		MinGroup:    intParam("min_group"),
		MaxGroup:    intParam("max_group"),
		MinDays:     intParam("min_days"),
		MaxDays:     intParam("max_days"),
		Phone:       strings.TrimSpace(q.Get("phone")),
	}

	trips, err := h.repo.ListTripRequests(r.Context(), filter, listLimit)
	if err != nil {
		log.Printf("list trip requests: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not load trip requests")
		return
	}
	writeSuccess(w, http.StatusOK, trips)
}

// validate normalizes the payload in place and returns a human-readable
// message for the first problem found, or "" when the payload is valid.
func (h *Handler) validate(r *http.Request, req *model.CreateTripRequest) string {
	req.CustomerName = strings.TrimSpace(req.CustomerName)
	req.CustomerPhone = strings.TrimSpace(req.CustomerPhone)
	req.ServiceType = strings.TrimSpace(req.ServiceType)
	req.VehicleSlug = strings.TrimSpace(req.VehicleSlug)

	switch {
	case req.CustomerName == "":
		return "Customer name is required"
	case len(req.CustomerName) > maxNameLength:
		return "Customer name is too long"
	case req.CustomerPhone == "":
		return "Phone number is required"
	case !phonePattern.MatchString(req.CustomerPhone):
		return "Phone number doesn't look valid"
	case req.GroupSize < 1:
		return "Group size must be at least 1"
	case req.GroupSize > maxGroupSize:
		return fmt.Sprintf("Group size can be at most %d", maxGroupSize)
	}

	switch req.ServiceType {
	case model.ServiceDriverOnly, model.ServiceHotelOnly, model.ServiceCompleteItinerary:
	default:
		return "Unknown service type"
	}

	start, err := time.Parse(time.DateOnly, req.StartDate)
	if err != nil {
		return "Start date must be in YYYY-MM-DD format"
	}
	end, err := time.Parse(time.DateOnly, req.EndDate)
	if err != nil {
		return "End date must be in YYYY-MM-DD format"
	}
	if end.Before(start) {
		return "End date cannot be before the start date"
	}
	today := time.Now().Truncate(24 * time.Hour)
	if start.Before(today) {
		return "Start date cannot be in the past"
	}
	days := int(end.Sub(start).Hours()/24) + 1
	if days > maxTripDays {
		return fmt.Sprintf("Trips can be at most %d days — call us for longer plans", maxTripDays)
	}

	if req.VehicleSlug == "" {
		return "Pick a vehicle from the fleet"
	}
	exists, err := h.repo.VehicleExists(r.Context(), req.VehicleSlug)
	if err != nil {
		log.Printf("check vehicle: %v", err)
		return "Could not verify the chosen vehicle"
	}
	if !exists {
		return "That vehicle is not part of the fleet"
	}

	// Day-by-day places are the team's job on a complete itinerary; for the
	// other services the customer must name a place for every trip day.
	if req.ServiceType == model.ServiceCompleteItinerary {
		req.DayPlans = nil
		return ""
	}
	if len(req.DayPlans) != days {
		return fmt.Sprintf("Expected a place for each of the %d days", days)
	}
	seen := make(map[int]bool, days)
	for i := range req.DayPlans {
		day := &req.DayPlans[i]
		day.Place = strings.TrimSpace(day.Place)
		if day.DayNumber < 1 || day.DayNumber > days {
			return fmt.Sprintf("Day number %d is outside the trip", day.DayNumber)
		}
		if seen[day.DayNumber] {
			return fmt.Sprintf("Day %d is listed twice", day.DayNumber)
		}
		seen[day.DayNumber] = true
		if day.Place == "" {
			return fmt.Sprintf("Where would you like to be on day %d?", day.DayNumber)
		}
		if len(day.Place) > maxPlaceLen {
			return fmt.Sprintf("The place for day %d is too long", day.DayNumber)
		}
	}
	return ""
}
