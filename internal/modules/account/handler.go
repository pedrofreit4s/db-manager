package account

import (
	"net/http"

	"github.com/pedrofreit4s/db-manager/internal/template"
)

func Login(w http.ResponseWriter, r *http.Request) {
	template.Templ.Render("screens/auth/login", nil, w, r)
}
