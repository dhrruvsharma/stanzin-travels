package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"regexp"
	"strings"

	"stanzin-travels-backend/internal/model"
	"stanzin-travels-backend/internal/repository"
)

const (
	maxReviewBodyLen = 2000
	maxEmailLen      = 200
)

var emailPattern = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[^@\s]+$`)

// CreateReview handles POST /api/v1/reviews (public). It stores a testimonial;
// no OTP or email verification is performed. One review per email address.
func (h *Handler) CreateReview(w http.ResponseWriter, r *http.Request) {
	var req model.CreateReview
	decoder := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if msg := validateReview(&req); msg != "" {
		writeError(w, http.StatusBadRequest, msg)
		return
	}

	review, err := h.repo.CreateReview(r.Context(), req)
	if errors.Is(err, repository.ErrEmailReviewed) {
		writeError(w, http.StatusConflict, "You've already left a review with this email — thank you!")
		return
	}
	if err != nil {
		log.Printf("create review: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not save your review")
		return
	}
	writeSuccess(w, http.StatusCreated, review)
}

// ListReviews handles GET /api/v1/reviews (public). It returns testimonials
// without the reviewer's contact details.
func (h *Handler) ListReviews(w http.ResponseWriter, r *http.Request) {
	reviews, err := h.repo.ListReviews(r.Context(), listLimit)
	if err != nil {
		log.Printf("list reviews: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not load reviews")
		return
	}

	public := make([]model.PublicReview, 0, len(reviews))
	for _, rev := range reviews {
		public = append(public, model.PublicReview{
			ID:        rev.ID,
			Name:      rev.Name,
			Rating:    rev.Rating,
			Body:      rev.Body,
			CreatedAt: rev.CreatedAt,
		})
	}
	writeSuccess(w, http.StatusOK, public)
}

// ListReviewsAdmin handles GET /api/v1/reviews/admin (admin and editor). It
// returns full reviews, including the reviewer's email.
func (h *Handler) ListReviewsAdmin(w http.ResponseWriter, r *http.Request) {
	reviews, err := h.repo.ListReviews(r.Context(), listLimit)
	if err != nil {
		log.Printf("list reviews (admin): %v", err)
		writeError(w, http.StatusInternalServerError, "Could not load reviews")
		return
	}
	writeSuccess(w, http.StatusOK, reviews)
}

// validateReview normalizes the payload in place and returns a human-readable
// message for the first problem found, or "" when the payload is valid.
func validateReview(req *model.CreateReview) string {
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	req.Body = strings.TrimSpace(req.Body)

	switch {
	case req.Name == "":
		return "Your name is required"
	case len(req.Name) > maxNameLength:
		return "Your name is too long"
	case req.Email == "":
		return "Email is required"
	case len(req.Email) > maxEmailLen || !emailPattern.MatchString(req.Email):
		return "Email doesn't look valid"
	case req.Rating < 0 || req.Rating > model.MaxRating:
		return "Rating must be between 0 and 5 stars"
	case req.Body == "":
		return "Please write a few words about your trip"
	case len(req.Body) > maxReviewBodyLen:
		return "Your review is a little too long"
	}
	return ""
}
