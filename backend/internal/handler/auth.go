package handler

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"

	"stanzin-travels-backend/internal/auth"
	"stanzin-travels-backend/internal/middleware"
	"stanzin-travels-backend/internal/repository"
)

const minPasswordLength = 8

type registerRequest struct {
	Name     string `json:"name"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

type loginRequest struct {
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

type authResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         any    `json:"user"`
}

func (h *Handler) issueTokens(userID string) (access, refresh string, err error) {
	if access, err = auth.GenerateToken(h.jwtSecret, userID, auth.TokenTypeAccess); err != nil {
		return "", "", err
	}
	refresh, err = auth.GenerateToken(h.jwtSecret, userID, auth.TokenTypeRefresh)
	return access, refresh, err
}

// Register handles POST /api/v1/auth/register. New accounts get the 'user'
// role and see nothing until an admin promotes them.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	req.Phone = strings.TrimSpace(req.Phone)

	switch {
	case req.Name == "" || len(req.Name) > maxNameLength:
		writeError(w, http.StatusBadRequest, "Tell us your name")
		return
	case !phonePattern.MatchString(req.Phone):
		writeError(w, http.StatusBadRequest, "Phone number doesn't look valid")
		return
	case len(req.Password) < minPasswordLength:
		writeError(w, http.StatusBadRequest, "Password must be at least 8 characters")
		return
	}

	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		log.Printf("hash password: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not create the account")
		return
	}

	user, err := h.repo.CreateUser(r.Context(), req.Name, req.Phone, hash)
	if errors.Is(err, repository.ErrPhoneTaken) {
		writeError(w, http.StatusConflict, "That phone number is already registered")
		return
	}
	if err != nil {
		log.Printf("create user: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not create the account")
		return
	}

	access, refresh, err := h.issueTokens(user.ID)
	if err != nil {
		log.Printf("issue tokens: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not sign you in")
		return
	}
	writeSuccess(w, http.StatusCreated, authResponse{
		AccessToken: access, RefreshToken: refresh, User: user,
	})
}

// Login handles POST /api/v1/auth/login.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, err := h.repo.GetUserByPhone(r.Context(), strings.TrimSpace(req.Phone))
	if errors.Is(err, repository.ErrNotFound) ||
		(err == nil && !auth.CheckPassword(user.PasswordHash, req.Password)) {
		writeError(w, http.StatusUnauthorized, "Wrong phone number or password")
		return
	}
	if err != nil {
		log.Printf("get user: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not sign you in")
		return
	}

	access, refresh, err := h.issueTokens(user.ID)
	if err != nil {
		log.Printf("issue tokens: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not sign you in")
		return
	}
	writeSuccess(w, http.StatusOK, authResponse{
		AccessToken: access, RefreshToken: refresh, User: user,
	})
}

// Refresh handles POST /api/v1/auth/refresh. It expects the refresh token as
// a Bearer header and returns a fresh access token.
func (h *Handler) Refresh(w http.ResponseWriter, r *http.Request) {
	token, ok := strings.CutPrefix(r.Header.Get("Authorization"), "Bearer ")
	if !ok || token == "" {
		writeError(w, http.StatusUnauthorized, "Missing refresh token")
		return
	}
	claims, err := auth.ParseToken(h.jwtSecret, token, auth.TokenTypeRefresh)
	if err != nil {
		writeError(w, http.StatusUnauthorized, "Session expired — sign in again")
		return
	}
	if _, err := h.repo.GetUserByID(r.Context(), claims.Subject); err != nil {
		writeError(w, http.StatusUnauthorized, "Account no longer exists")
		return
	}

	access, err := auth.GenerateToken(h.jwtSecret, claims.Subject, auth.TokenTypeAccess)
	if err != nil {
		log.Printf("issue access token: %v", err)
		writeError(w, http.StatusInternalServerError, "Could not refresh the session")
		return
	}
	writeSuccess(w, http.StatusOK, map[string]string{"access_token": access})
}

// Me handles GET /api/v1/auth/me for the authenticated account.
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	writeSuccess(w, http.StatusOK, middleware.CurrentUser(r))
}
