package http

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

func StartServer() {
	r := chi.NewRouter()

	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%s", os.Getenv("APP_PORT")),
		Handler: r,
	}

	log.Printf("Http Server is running on  http://localhost:%s", os.Getenv("APP_PORT"))
	if err := server.ListenAndServe(); err != nil {
		panic(err)
	}
}
