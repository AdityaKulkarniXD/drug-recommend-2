package main

import (
	"log"
	"github.com/AdityaKulkarniXD/drug-recommend-2/internal/router"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	// Setup all routes
	router.SetupRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
