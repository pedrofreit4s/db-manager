// Package http provides the HTTP server and routes for the application
package http

import (
	"github.com/go-chi/chi/v5"
	"github.com/pedrofreit4s/db-manager/internal/modules/account"
)

// SetupRoutes sets up the routes for the application
func SetupRoutes(r *chi.Mux) {
	account.SetupRoutes(r)
}
