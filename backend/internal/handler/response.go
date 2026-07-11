package handler

import (
	"encoding/json"
	"log"
	"net/http"
)

// successBody is the envelope for 2xx responses.
type successBody struct {
	Success bool `json:"success"`
	Data    any  `json:"data"`
}

// errorBody matches the shape the frontend response parser expects.
type errorBody struct {
	Success    bool   `json:"success"`
	Message    string `json:"message"`
	Error      string `json:"error"`
	StatusCode int    `json:"statusCode"`
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("write response: %v", err)
	}
}

func writeSuccess(w http.ResponseWriter, status int, data any) {
	writeJSON(w, status, successBody{Success: true, Data: data})
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, errorBody{
		Success:    false,
		Message:    message,
		Error:      http.StatusText(status),
		StatusCode: status,
	})
}
