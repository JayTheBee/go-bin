package utils

import (
	"math/rand"
	"os"

	"github.com/matthewhartstonge/argon2"
)

var runes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
var argon = argon2.DefaultConfig()

func GenerateURL(size int) string {
	str := make([]rune, size)

	for i := range str {
		str[i] = runes[rand.Intn(len(runes))]
	}

	return string(str)
}

func HashPassword(pass string) string {
	encoded, err := argon.HashEncoded([]byte(pass))
	if err != nil {
		panic(err)

	}
	return string(encoded)
}

func VerifyEncode(pass string, encode string) bool {
	ok, err := argon2.VerifyEncoded([]byte(pass), []byte(encode))
	if err != nil {
		panic(err) // 💥
	}
	return ok
}

func GetEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

// // only parsing until minutes
// func TimeDiffs(start time.Time, end time.Time) uint64 {
// 	m := end.Sub(start)
// 	return uint64(m.Minutes())
// }

// // get minutes and start time then return end time
// func TimeAdd(mins int64, start time.Time) time.Time {
// 	if mins < 0 {
// 		return start
// 	}
// 	end := start.Add(time.Minute * time.Duration(mins))
// 	return end
// }
