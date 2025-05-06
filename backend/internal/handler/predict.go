package handler

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type PredictRequest struct {
	Symptoms      []string `json:"symptoms"`
	MedicalHistory string   `json:"medical_history"`
	Profile        string   `json:"profile"`
}

func PredictHandler(c *fiber.Ctx) error {
	var input PredictRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Forward to Python FastAPI
	body, _ := json.Marshal(input)
	resp, err := http.Post("http://localhost:8000/predict", "application/json", bytes.NewBuffer(body))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to connect to ML API"})
	}
	defer resp.Body.Close()

	responseData, _ := ioutil.ReadAll(resp.Body)

	return c.Send(responseData)
}
