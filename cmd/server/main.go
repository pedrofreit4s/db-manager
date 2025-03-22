package main

import (
	"github.com/pedrofreit4s/db-manager/internal/config"
	"github.com/pedrofreit4s/db-manager/internal/database"
	"github.com/pedrofreit4s/db-manager/internal/http"
)

func main() {
	config.LoadEnviroment()

	// Database
	database.Connect()
	defer database.Close()

	// HTTP Server
	http.StartServer()
}
