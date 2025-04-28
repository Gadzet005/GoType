package main

import (
	_ "github.com/Gadzet005/GoType/backend/docs"
	"github.com/Gadzet005/GoType/backend/internal/handler"
	"github.com/Gadzet005/GoType/backend/internal/repository"
	"github.com/Gadzet005/GoType/backend/internal/service"
	pkg "github.com/Gadzet005/GoType/backend/pkg"
	//"github.com/Gadzet005/GoType/backend/pkg"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"os"
	"path/filepath"
)

const (
	saltEnvName         = "SALT"
	signingKeyName      = "SIGNING_KEY"
	refreshTokenTTLName = "REFRESH_TOKEN_TTL" //hours
	accessTokenTTLName  = "ACCESS_TOKEN_TTL"  //minutes
)

// @title GoType App API
// @version 1.0.0
// @description API Server for GoType game and website

// @host 158.160.179.2:8080
// @BasePath/

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

func main() {
	logrus.SetFormatter(new(logrus.JSONFormatter))

	if err := initConfig(); err != nil {
		logrus.Fatalf("Error reading config file, %s", err.Error())
	}

	initLogger()

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
		Host:         viper.GetString("cache.host"),
		Port:         viper.GetString("cache.port"),
		Password:     os.Getenv("REDIS_PASSWORD"),
		Maxmemory:    viper.GetString("cache.maxmemory"),
		MaxMemPolicy: viper.GetString("cache.maxmemory_policy"),
	})

	if err != nil {
		logrus.Fatalf("Error connecting to redis, %s", err.Error())
	}

	repos := repository.NewRepository(db, redisClient, viper.GetInt("cache.level_user_top_ttl"), viper.GetInt("cache.level_stats_ttl"), viper.GetInt("cache.rating_ttl"))
	services := service.NewService(repos, viper.GetInt("security.refreshTokenTTL"), viper.GetInt("security.accessTokenTTL"), os.Getenv("wiu8s7]df9s&di9230ss894w90g2092v[d"), os.Getenv("pqlpwisd5786vhdf27675da"))
	handlers := handler.NewHandler(services)

	admName := os.Getenv("SENIOR_ADMIN_NAME")
	admPwd := os.Getenv("SENIOR_ADMIN_PASSWORD")

	err = services.Authorization.CreateSeniorAdmin(admName, admPwd)

	if err != nil && err.Error() != pkg.ErrUserExists {
		logrus.Fatal("Failed to add Senior admin: " + err.Error())
	}

	srv := new(pkg.Server)
	if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
		logrus.Fatalf("Error occured while running http server: %s", err.Error())
	}
}

func initConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}

func initLogger() {
	mode := viper.GetString("logs.mode")
	if mode == "file" {
		logFile := viper.GetString("logs.file")

		logDir := filepath.Dir(logFile)
		if err := os.MkdirAll(logDir, os.ModePerm); err != nil {
			logrus.Fatalf("Failed to create log directory: %s", err.Error())
		}

		f, err := os.OpenFile(logFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
		if err != nil {
			logrus.Fatalf("Failed to open log file: %s", err.Error())
		}
		logrus.SetOutput(f)
	}
	logrus.SetFormatter(new(logrus.JSONFormatter))
}
