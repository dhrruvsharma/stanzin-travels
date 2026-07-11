package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"stanzin-travels-backend/internal/config"
	"stanzin-travels-backend/internal/database"
	"stanzin-travels-backend/internal/handler"
	"stanzin-travels-backend/internal/middleware"
	"stanzin-travels-backend/internal/model"
	"stanzin-travels-backend/internal/repository"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	pool, err := database.Connect(ctx, cfg.DatabaseURL)
	cancel()
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()

	ctx, cancel = context.WithTimeout(context.Background(), 30*time.Second)
	err = database.Migrate(ctx, pool)
	cancel()
	if err != nil {
		log.Fatalf("migrate: %v", err)
	}

	repo := repository.New(pool)
	h := handler.New(repo, cfg.JWTSecret)

	authed := middleware.Auth(cfg.JWTSecret, repo)
	staff := func(next http.HandlerFunc) http.Handler {
		return authed(middleware.RequireRole(model.RoleAdmin, model.RoleEditor)(next))
	}
	adminOnly := func(next http.HandlerFunc) http.Handler {
		return authed(middleware.RequireRole(model.RoleAdmin)(next))
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	// Public — used by the customer-facing site.
	mux.HandleFunc("GET /api/v1/vehicles", h.ListVehicles)
	mux.HandleFunc("POST /api/v1/trip-requests", h.CreateTripRequest)

	// Dashboard auth.
	mux.HandleFunc("POST /api/v1/auth/register", h.Register)
	mux.HandleFunc("POST /api/v1/auth/login", h.Login)
	mux.HandleFunc("POST /api/v1/auth/refresh", h.Refresh)
	mux.Handle("GET /api/v1/auth/me", authed(http.HandlerFunc(h.Me)))

	// Dashboard data — bookings for admin+editor, users for admin only.
	mux.Handle("GET /api/v1/trip-requests", staff(h.ListTripRequests))
	mux.Handle("GET /api/v1/users", adminOnly(h.ListUsers))
	mux.Handle("PATCH /api/v1/users/{id}/role", adminOnly(h.UpdateUserRole))

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           middleware.CORS(cfg.AllowedOrigins)(mux),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       30 * time.Second,
		WriteTimeout:      30 * time.Second,
	}

	go func() {
		log.Printf("listening on :%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("server: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown: %v", err)
	}
}
