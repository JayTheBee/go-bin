package server

import (
	"time"

	"github.com/JayTheBee/go-bin/model"
	"github.com/JayTheBee/go-bin/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func checkPrivate(c *fiber.Ctx) error {
	url := c.Params("url")
	x, err := model.FindByURL(url)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error could not retreive gobin from db " + err.Error(),
		})
	}
	//check privacy settings and authenticate password
	if len(x.Password) > 0 {
		return c.Status(fiber.StatusOK).SendString("true")
	}
	return c.Status(fiber.StatusOK).SendString("false")
}

func checkPassword(c *fiber.Ctx) error {
	c.Accepts("application/json")
	//every get request has a url param and a password payload (default nil)
	payload := struct {
		Password string `json:"password"`
	}{}
	// get payload
	err := c.BodyParser(&payload)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error parsing JSON " + err.Error(),
		})
	}
	// get model from param
	url := c.Params("url")
	x, err := model.FindByURL(url)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error could not retreive gobin from db " + err.Error(),
		})
	}

	//authenticate password
	ok := utils.VerifyEncode(payload.Password, x.Password)
	if ok {
		return c.Status(fiber.StatusOK).SendString("true")
	} else {
		return c.Status(fiber.StatusOK).SendString("false")
	}

}

func getAllGobins(c *fiber.Ctx) error {
	gobins, err := model.GetAllGobins()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error getting all gobins " + err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(gobins)
}

func getGobin(c *fiber.Ctx) error {
	url := c.Params("url")
	x, err := model.FindByURL(url)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error could not retreive gobin from db " + err.Error(),
		})
	}

	x.Views += 1

	err = model.UpdateGobin(x)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error updating gobin to db " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(x)
}

func createGobin(c *fiber.Ctx) error {
	c.Accepts("application/json")

	var x model.Gobin
	err := c.BodyParser(&x)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error parsing JSON " + err.Error(),
		})
	}

	x.URL = utils.GenerateURL(8)
	x.CreatedAt = time.Now()
	if len(x.Password) > 0 {
		x.Password = utils.HashPassword(x.Password)
	}
	err = model.CreateGobin(x)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "could not create gobin in db " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(x)

}

func updateGobin(c *fiber.Ctx) error {
	c.Accepts("application/json")

	var x model.Gobin

	err := c.BodyParser(&x)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "could not parse json " + err.Error(),
		})
	}

	err = model.UpdateGobin(x)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "could not update gobin in DB " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(x)
}

func deleteGobin(c *fiber.Ctx) error {
	url := c.Params("url")

	x, err := model.FindByURL(url)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "error could not retreive gobin from db " + err.Error(),
		})
	}

	err = model.DeleteGobin(x.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "could not delete from db " + err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "gobin deleted.",
	})
}

func Setup() {

	router := fiber.New()

	router.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	router.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	router.Get("/gobin", getAllGobins)
	router.Get("/gobin/checkvis/:url", checkPrivate)
	router.Post("/gobin/checkpass/:url", checkPassword)
	router.Get("/gobin/:url", getGobin)
	router.Post("/gobin", createGobin)
	router.Patch("/gobin", updateGobin)
	router.Delete("/gobin/:url", deleteGobin)

	router.Listen(":3002")

}
