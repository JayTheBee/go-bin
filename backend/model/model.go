package model

import (
	"fmt"
	"log"
	"time"

	"github.com/JayTheBee/go-bin/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

type Gobin struct {
	ID    uint   `json:"-" gorm:"primaryKey"`
	URL   string `json:"url" gorm:"unique;not null"`
	Title string `json:"title" gorm:"default:Untitled"` //or untitled
	Body  string `json:"body" gorm:"not null"`
	Views uint   `json:"views" gorm:"default:0"` //incremental
	// Privacy      bool      `json:"privacy" gorm:"default:false"`
	Password     string    `json:"password,omitempty" gorm:"default:null"`
	CreatedAt    time.Time `json:"created" gorm:"not null"`
	ExpiresAfter int64     `json:"expiry,omitempty" gorm:"type:int;default:-1"` //stored as minutes
}

func Setup() {
	// dsn := "host=192.168.100.219 port=5432 user=admin password=8723 dbname=admin sslmode=disable"
	var err error
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		utils.GetEnv("DB_ADDRESS", "127.0.0.1"),
		utils.GetEnv("DB_PORT", "5432"),
		utils.GetEnv("DB_USER", "admin"),
		utils.GetEnv("DB_PASSWORD", "1234"),
		utils.GetEnv("DB_NAME", "admin"))
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.AutoMigrate(&Gobin{})
	if err != nil {
		log.Fatal(err)
	}
}
