package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"stanzin-travels-backend/internal/middleware"
	"stanzin-travels-backend/internal/model"
	"stanzin-travels-backend/internal/repository"
)

// ListUsers handles GET /api/v1/users (admin only).
func (h *Handler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.repo.ListUsers(r.Context())
	if err != nil {
		log.Printf("list users: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not load users")
		return
	}
	writeSuccess(w, http.StatusOK, users)
}

// UpdateUserRole handles PATCH /api/v1/users/{id}/role (admin only).
func (h *Handler) UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Role string `json:"role"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	switch req.Role {
	case model.RoleAdmin, model.RoleEditor, model.RoleUser:
	default:
		writeError(w, http.StatusBadRequest, "Unknown role")
		return
	}

	id := r.PathValue("id")
	if current := middleware.CurrentUser(r); current != nil && current.ID == id {
		writeError(w, http.StatusBadRequest, "You can't change your own role")
		return
	}

	user, err := h.repo.UpdateUserRole(r.Context(), id, req.Role)
	if errors.Is(err, repository.ErrNotFound) {
		writeError(w, http.StatusNotFound, "No such user")
		return
	}
	if err != nil {
		log.Printf("update role: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not update the role")
		return
	}
	writeSuccess(w, http.StatusOK, user)
}
