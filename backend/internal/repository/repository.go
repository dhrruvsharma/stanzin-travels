package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"

	"stanzin-travels-backend/internal/model"
)

// Repository wraps all database access for the API.
type Repository struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Repository {
	return &Repository{pool: pool}
}

// ListVehicles returns the active fleet, cars first, in seed order.
func (r *Repository) ListVehicles(ctx context.Context) ([]model.Vehicle, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT slug, name, kind, category
		FROM vehicles
		WHERE is_active
		ORDER BY sort_order, name`)
	if err != nil {
		return nil, fmt.Errorf("list vehicles: %w", err)
	}
	defer rows.Close()

	var vehicles []model.Vehicle
	for rows.Next() {
		var v model.Vehicle
		if err := rows.Scan(&v.Slug, &v.Name, &v.Kind, &v.Category); err != nil {
			return nil, fmt.Errorf("scan vehicle: %w", err)
		}
		vehicles = append(vehicles, v)
	}
	return vehicles, rows.Err()
}

// VehicleExists reports whether an active vehicle with the slug exists.
func (r *Repository) VehicleExists(ctx context.Context, slug string) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx,
		`SELECT EXISTS (SELECT 1 FROM vehicles WHERE slug = $1 AND is_active)`, slug,
	).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("check vehicle: %w", err)
	}
	return exists, nil
}

// CreateTripRequest inserts the request and its day plans in one transaction
// and returns the stored record.
func (r *Repository) CreateTripRequest(ctx context.Context, req model.CreateTripRequest) (*model.TripRequest, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin: %w", err)
	}
	defer tx.Rollback(ctx) //nolint:errcheck // no-op after commit

	var trip model.TripRequest
	err = tx.QueryRow(ctx, `
		INSERT INTO trip_requests
			(customer_name, customer_phone, group_size, service_type, start_date, end_date, vehicle_slug)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id::text, customer_name, customer_phone, group_size, service_type,
			start_date::text, end_date::text, vehicle_slug, status, created_at`,
		req.CustomerName, req.CustomerPhone, req.GroupSize, req.ServiceType,
		req.StartDate, req.EndDate, req.VehicleSlug,
	).Scan(
		&trip.ID, &trip.CustomerName, &trip.CustomerPhone, &trip.GroupSize,
		&trip.ServiceType, &trip.StartDate, &trip.EndDate, &trip.VehicleSlug,
		&trip.Status, &trip.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("insert trip request: %w", err)
	}

	trip.DayPlans = make([]model.DayPlan, 0, len(req.DayPlans))
	for _, day := range req.DayPlans {
		if _, err := tx.Exec(ctx, `
			INSERT INTO trip_request_days (trip_request_id, day_number, place)
			VALUES ($1, $2, $3)`,
			trip.ID, day.DayNumber, day.Place,
		); err != nil {
			return nil, fmt.Errorf("insert day %d: %w", day.DayNumber, err)
		}
		trip.DayPlans = append(trip.DayPlans, day)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit: %w", err)
	}
	return &trip, nil
}

// ListTripRequests returns the most recent requests matching the filter,
// with their day plans, newest first, for the team to review.
func (r *Repository) ListTripRequests(ctx context.Context, filter model.TripRequestFilter, limit int) ([]model.TripRequest, error) {
	where := []string{"TRUE"}
	args := []any{}
	arg := func(v any) string {
		args = append(args, v)
		return fmt.Sprintf("$%d", len(args))
	}

	if filter.CreatedFrom != "" {
		where = append(where, "created_at >= "+arg(filter.CreatedFrom)+"::date")
	}
	if filter.CreatedTo != "" {
		where = append(where, "created_at < "+arg(filter.CreatedTo)+"::date + INTERVAL '1 day'")
	}
	if filter.MinGroup > 0 {
		where = append(where, "group_size >= "+arg(filter.MinGroup))
	}
	if filter.MaxGroup > 0 {
		where = append(where, "group_size <= "+arg(filter.MaxGroup))
	}
	if filter.MinDays > 0 {
		where = append(where, "(end_date - start_date + 1) >= "+arg(filter.MinDays))
	}
	if filter.MaxDays > 0 {
		where = append(where, "(end_date - start_date + 1) <= "+arg(filter.MaxDays))
	}
	if filter.Phone != "" {
		where = append(where, "customer_phone ILIKE "+arg("%"+filter.Phone+"%"))
	}

	query := fmt.Sprintf(`
		SELECT id::text, customer_name, customer_phone, group_size, service_type,
			start_date::text, end_date::text, vehicle_slug, status, created_at
		FROM trip_requests
		WHERE %s
		ORDER BY created_at DESC
		LIMIT %s`, strings.Join(where, " AND "), arg(limit))

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list trip requests: %w", err)
	}
	defer rows.Close()

	var trips []model.TripRequest
	index := make(map[string]int)
	for rows.Next() {
		var t model.TripRequest
		if err := rows.Scan(
			&t.ID, &t.CustomerName, &t.CustomerPhone, &t.GroupSize, &t.ServiceType,
			&t.StartDate, &t.EndDate, &t.VehicleSlug, &t.Status, &t.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan trip request: %w", err)
		}
		t.DayPlans = []model.DayPlan{}
		index[t.ID] = len(trips)
		trips = append(trips, t)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if len(trips) == 0 {
		return []model.TripRequest{}, nil
	}

	ids := make([]string, 0, len(trips))
	for _, t := range trips {
		ids = append(ids, t.ID)
	}
	dayRows, err := r.pool.Query(ctx, `
		SELECT trip_request_id::text, day_number, place
		FROM trip_request_days
		WHERE trip_request_id = ANY($1::uuid[])
		ORDER BY day_number`, ids)
	if err != nil {
		return nil, fmt.Errorf("list day plans: %w", err)
	}
	defer dayRows.Close()

	for dayRows.Next() {
		var tripID string
		var day model.DayPlan
		if err := dayRows.Scan(&tripID, &day.DayNumber, &day.Place); err != nil {
			return nil, fmt.Errorf("scan day plan: %w", err)
		}
		if i, ok := index[tripID]; ok {
			trips[i].DayPlans = append(trips[i].DayPlans, day)
		}
	}
	return trips, dayRows.Err()
}
