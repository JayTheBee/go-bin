package main

import (
	"github.com/JayTheBee/go-bin/model"
	"github.com/JayTheBee/go-bin/server"
)

func main() {

	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }
	model.Setup()
	server.Setup()
}
