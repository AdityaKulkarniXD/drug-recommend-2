package router

import (
	"github.com/gofiber/fiber/v2"
	"github.com/AdityaKulkarniXD/drug-recommend-2/backend/internal/handler"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Post("/predict", handler.PredictHandler)
}
