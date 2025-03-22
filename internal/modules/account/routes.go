package account

import chi "github.com/go-chi/chi/v5"

func SetupRoutes(r *chi.Mux) {
	r.Get("/login", Login)
}
