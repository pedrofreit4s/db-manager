// Package http provides the HTTP server and routes for the application
package http

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

// StartServer starts the HTTP server
func StartServer() {
	r := chi.NewRouter()

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("s"))
	})

	SetupRoutes(r)

	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%s", os.Getenv("APP_PORT")),
		Handler: r,
	}

	log.Printf("Http Server is running on  http://localhost:%s", os.Getenv("APP_PORT"))
	if err := server.ListenAndServe(); err != nil {
		panic(err)
	}
}
