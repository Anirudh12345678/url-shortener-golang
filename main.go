package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/teris-io/shortid"
)

type Response struct {
	Url string `json:"url"`
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
	context := context.Background()
	pong, err := client.Ping(context).Result()
	error := client.Set(context, "foo", "bar", 0).Err()
	if error != nil {
		panic(error)
	}

	val, err := client.Get(context, "foo").Result()
	if err != nil {
		panic(err)
	}
	fmt.Println("foo", val)
	fmt.Println(pong, err)
	r := gin.Default()
	r.POST("/shorten", func(ctx *gin.Context) {
		res := Response{}
		if err := ctx.BindJSON(&res); err != nil {
			ctx.AbortWithError(http.StatusBadRequest, err)
			return
		}
		shortuid, _ := shortid.Generate()
		err := client.Set(context, shortuid, res.Url, 300*time.Second).Err()
		if err != nil {
			fmt.Println(err)
		}
		ctx.JSON(200, gin.H{"url": "http://localhost:8080/get/" + shortuid})
	})

	r.GET("/get/:shortid", func(ctx *gin.Context) {
		id := ctx.Param("shortid")
		fmt.Println(id)
		val, err := client.Get(context, id).Result()
		if err != nil {
			ctx.JSON(400, gin.H{"error": "Cannot find the required URL"})
		}
		ctx.Redirect(http.StatusMovedPermanently, val)
	})
	r.Run(":8080")
}
