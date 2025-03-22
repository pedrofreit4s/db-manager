package main

import (
	"github.com/pedrofreit4s/db-manager/internal/config"
	"github.com/pedrofreit4s/db-manager/internal/database"
	"github.com/pedrofreit4s/db-manager/internal/http"
	"github.com/pedrofreit4s/db-manager/internal/template"
)

func main() {
	config.LoadEnviroment()

	// Database
	database.Connect()
	defer database.Close()

	// Template
	template.Init("./web")

	// HTTP Server
	http.StartServer()
}
