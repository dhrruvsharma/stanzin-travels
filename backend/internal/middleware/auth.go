package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"slices"
	"strings"

	"stanzin-travels-backend/internal/auth"
	"stanzin-travels-backend/internal/model"
	"stanzin-travels-backend/internal/repository"
)

type contextKey struct{}

var userKey contextKey

// CurrentUser returns the authenticated account set by Auth, or nil.
func CurrentUser(r *http.Request) *model.AdminUser {
	user, _ := r.Context().Value(userKey).(*model.AdminUser)
	return user
}

func writeAuthError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]any{
		"success":    false,
		"message":    message,
		"error":      http.StatusText(status),
		"statusCode": status,
	})
}

// Auth verifies the Bearer access token and loads the account from the
// database, so role changes take effect on the very next request.
func Auth(secret string, repo *repository.Repository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			token, ok := strings.CutPrefix(header, "Bearer ")
			if !ok || token == "" {
				writeAuthError(w, http.StatusUnauthorized, "Sign in to continue")
				return
			}

			claims, err := auth.ParseToken(secret, token, auth.TokenTypeAccess)
			if err != nil {
				writeAuthError(w, http.StatusUnauthorized, "Session expired — sign in again")
				return
			}

			user, err := repo.GetUserByID(r.Context(), claims.Subject)
			if err != nil {
				writeAuthError(w, http.StatusUnauthorized, "Account no longer exists")
				return
			}

			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userKey, user)))
		})
	}
}

// RequireRole rejects authenticated accounts whose role is not listed.
func RequireRole(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := CurrentUser(r)
			if user == nil {
				writeAuthError(w, http.StatusUnauthorized, "Sign in to continue")
				return
			}
			if !slices.Contains(roles, user.Role) {
				writeAuthError(w, http.StatusForbidden, "Your account doesn't have access to this")
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
