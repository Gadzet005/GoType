package main

import (
	gotype "github.com/Gadzet005/GoType/backend"
	"github.com/Gadzet005/GoType/backend/pkg/handler"
	"github.com/Gadzet005/GoType/backend/pkg/repository"
	"github.com/Gadzet005/GoType/backend/pkg/service"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"os"
)

const (
	saltEnvName         = "SALT"
	signingKeyName      = "SIGNING_KEY"
	refreshTokenTTLName = "REFRESH_TOKEN_TTL" //hours
	accessTokenTTLName  = "ACCESS_TOKEN_TTL"  //minutes
)

// @title GoType App API
// @version 0.0.1
// @description API Server for GoType game and website

// @host localhost:8000
// @BasePath/

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	if err := initConfig(); err != nil {
		logrus.Fatalf("Error reading config file, %s", err.Error())
	}

	if err := godotenv.Load(); err != nil {
		logrus.Fatalf("Error loading .env file, %s", err.Error())
	}

	db, err := repository.NewPostgresDB(repository.PostgresConfig{
		Host:     viper.GetString("db.host"),
		Port:     viper.GetString("db.port"),
		Username: viper.GetString("db.username"),
		DBName:   viper.GetString("db.dbname"),
		SSLMode:  viper.GetString("db.sslmode"),
		Password: os.Getenv("DB_PASSWORD"),
	})

	if err != nil {
		logrus.Fatalf("Error connecting to database, %s", err.Error())
	}

	redisClient, err := repository.NewRedisDB(repository.RedisConfig{
		Host:     viper.GetString("cache.host"),
		Port:     viper.GetString("cache.port"),
		Password: os.Getenv("REDIS_PASSWORD"),
	})

	if err != nil {
		logrus.Fatalf("Error connecting to redis, %s", err.Error())
	}

	repos := repository.NewRepository(db, redisClient)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	admName := os.Getenv("SENIOR_ADMIN_NAME")
	admPwd := os.Getenv("SENIOR_ADMIN_PASSWORD")

	err = services.Authorization.CreateSeniorAdmin(admName, admPwd)

	if err != nil && err.Error() != gotype.ErrUserExists {
		logrus.Fatal("Failed to add Senior admin: " + err.Error())
	}

	srv := new(gotype.Server)
	if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
		logrus.Fatalf("Error occured while running http server: %s", err.Error())
	}
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}
