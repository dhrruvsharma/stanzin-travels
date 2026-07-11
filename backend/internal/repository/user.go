package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

	"stanzin-travels-backend/internal/model"
)

var (
	// ErrPhoneTaken is returned when registering with an existing phone.
	ErrPhoneTaken = errors.New("phone already registered")
	// ErrNotFound is returned when a user does not exist.
	ErrNotFound = errors.New("user not found")
)

const userColumns = `id::text, name, phone, role, created_at, password_hash`

func scanUser(row pgx.Row) (*model.AdminUser, error) {
	var u model.AdminUser
	err := row.Scan(&u.ID, &u.Name, &u.Phone, &u.Role, &u.CreatedAt, &u.PasswordHash)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("scan user: %w", err)
	}
	return &u, nil
}

// CreateUser registers a dashboard account with the default 'user' role.
func (r *Repository) CreateUser(ctx context.Context, name, phone, passwordHash string) (*model.AdminUser, error) {
	row := r.pool.QueryRow(ctx, `
		INSERT INTO admin_users (name, phone, password_hash)
		VALUES ($1, $2, $3)
		RETURNING `+userColumns,
		name, phone, passwordHash)
	user, err := scanUser(row)
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return nil, ErrPhoneTaken
	}
	return user, err
}

func (r *Repository) GetUserByPhone(ctx context.Context, phone string) (*model.AdminUser, error) {
	return scanUser(r.pool.QueryRow(ctx,
		`SELECT `+userColumns+` FROM admin_users WHERE phone = $1`, phone))
}

func (r *Repository) GetUserByID(ctx context.Context, id string) (*model.AdminUser, error) {
	return scanUser(r.pool.QueryRow(ctx,
		`SELECT `+userColumns+` FROM admin_users WHERE id = $1`, id))
}

// ListUsers returns every dashboard account, newest first.
func (r *Repository) ListUsers(ctx context.Context) ([]model.AdminUser, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT `+userColumns+` FROM admin_users ORDER BY created_at DESC`)
	if err != nil {
		return nil, fmt.Errorf("list users: %w", err)
	}
	defer rows.Close()

	users := []model.AdminUser{}
	for rows.Next() {
		u, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		users = append(users, *u)
	}
	return users, rows.Err()
}

// UpdateUserRole sets the role and returns the updated user.
func (r *Repository) UpdateUserRole(ctx context.Context, id, role string) (*model.AdminUser, error) {
	return scanUser(r.pool.QueryRow(ctx, `
		UPDATE admin_users SET role = $2 WHERE id = $1
		RETURNING `+userColumns,
		id, role))
}
