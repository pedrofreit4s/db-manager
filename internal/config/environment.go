// Package config provides configuration functionality for the application
package config

import (
	"github.com/joho/godotenv"
)

// LoadEnviroment loads environment variables from .env file
// It will panic if the .env file cannot be loaded
func LoadEnviroment() {
	if err := godotenv.Load(); err != nil {
		panic("Error loading .env file")
	}
}
