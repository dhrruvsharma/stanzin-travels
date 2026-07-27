package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"

	"stanzin-travels-backend/internal/model"
)

// ErrEmailReviewed is returned when an email address has already left a review.
var ErrEmailReviewed = errors.New("email already reviewed")

// CreateReview stores a testimonial. Each email may leave only one review;
// a repeat email returns ErrEmailReviewed.
func (r *Repository) CreateReview(ctx context.Context, req model.CreateReview) (*model.Review, error) {
	var review model.Review
	err := r.pool.QueryRow(ctx, `
		INSERT INTO reviews (name, email, rating, body)
		VALUES ($1, $2, $3, $4)
		RETURNING id::text, name, email, rating, body, created_at`,
		req.Name, req.Email, req.Rating, req.Body,
	).Scan(
		&review.ID, &review.Name, &review.Email,
		&review.Rating, &review.Body, &review.CreatedAt,
	)
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return nil, ErrEmailReviewed
	}
	if err != nil {
		return nil, fmt.Errorf("insert review: %w", err)
	}
	return &review, nil
}

// ListReviews returns every review, newest first, for the back office.
func (r *Repository) ListReviews(ctx context.Context, limit int) ([]model.Review, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT id::text, name, email, rating, body, created_at
		FROM reviews
		ORDER BY created_at DESC
		LIMIT $1`, limit)
	if err != nil {
		return nil, fmt.Errorf("list reviews: %w", err)
	}
	defer rows.Close()

	reviews := []model.Review{}
	for rows.Next() {
		var rev model.Review
		if err := rows.Scan(
			&rev.ID, &rev.Name, &rev.Email,
			&rev.Rating, &rev.Body, &rev.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan review: %w", err)
		}
		reviews = append(reviews, rev)
	}
	return reviews, rows.Err()
}
