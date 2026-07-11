package config

import (
	"fmt"
	"os"
)

// Config holds everything the server needs from the environment.
type Config struct {
	Port           string
	DatabaseURL    string
	AllowedOrigins string
	JWTSecret      string
}

// Load reads configuration from environment variables, applying
// development-friendly defaults where a value is optional.
func Load() (*Config, error) {
	cfg := &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:    os.Getenv("DATABASE_URL"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001"),
		JWTSecret:      getEnv("JWT_SECRET", "dev-only-secret-change-in-production"),
	}

	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
