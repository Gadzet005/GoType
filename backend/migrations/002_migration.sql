-- +goose Up
CREATE TABLE Users (
                       id serial PRIMARY KEY,
                       name varchar(255) UNIQUE NOT NULL,
                       access int constraint available_level check (access >= 0 and access <= 4) default 1,
                       password_hash varchar(255) NOT NULL,
                       refresh_token varchar(255),
                       expires_at timestamp,
                       ban_expiration timestamp default '2000-01-01 00:00:00',
                       ban_reason text default 'no ban',
                       multiplayer_priority numeric,
                       avatar_path text
);

CREATE TABLE LevelComplete (
                               id serial PRIMARY KEY,
                               level_id int NOT NULL,
                               player_id int NOT NULL,
                               time timestamp NOT NULL,
                               num_press_err_by_char JSONB NOT NULL,
                               average_velocity numeric NOT NULL,
                               accuracy numeric NOT NULL,
                               max_combo int NOT NULL,
                               placement int NOT NULL,
                               points int NOT NULL
);

CREATE TABLE UserStatistic (
                               user_id int PRIMARY KEY not null,
                               num_press_err_by_char_by_lang JSONB DEFAULT '{}',
                               num_level_relax int DEFAULT 0,
                               num_level_classic int DEFAULT 0,
                               num_games_mult int DEFAULT 0,
                               num_chars_classic int DEFAULT 0,
                               num_chars_relax int DEFAULT 0,
                               average_accuracy_classic numeric DEFAULT 0,
                               average_accuracy_relax numeric DEFAULT 0,
                               win_percentage numeric DEFAULT 0,
                               average_delay numeric DEFAULT 1000,
                               num_classes_classic integer[] default '{0, 0, 0, 0, 0}',
                               sum_points int default 0
);

CREATE TABLE Level (
                       id serial PRIMARY KEY,
                       name text NOT NULL,
                       author int NOT NULL,
                       author_name text NOT NULL,
                       description text NOT NULL,
                       duration int NOT NULL,
                       language text NOT NULL,
                       type text NOT NULL,
                       preview_path text NOT NULL,
                       archive_path text NOT NULL,
                       is_banned bool,
                       num_played int DEFAULT 0,
                       preview_type text NOT NULL,
                       difficulty int CONSTRAINT available_difficulty CHECK (difficulty >= 1 and difficulty <= 10) NOT NULL,
                       creation_time timestamp NOT NULL
);

CREATE TABLE UserComplaint (
                               id serial PRIMARY KEY,
                               user_id int NOT NULL,
                               author int NOT NULL,
                               time timestamp,
                               given_to int DEFAULT -1,
                               reason varchar(32),
                               message text
);

CREATE TABLE LevelComplaint (
                                id serial PRIMARY KEY,
                                level_id int NOT NULL,
                                author int NOT NULL,
                                time timestamp,
                                given_to int DEFAULT -1,
                                reason varchar(32) NOT NULL,
                                message text
);

CREATE TABLE Tag (
                     name varchar(100) PRIMARY KEY
);

CREATE TABLE LevelTag (
                          level_id int,
                          tag_name varchar(100),
                          PRIMARY KEY (level_id, tag_name)
);

CREATE UNIQUE INDEX ON Users (name, password_hash);

ALTER TABLE UserStatistic ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE LevelComplete ADD FOREIGN KEY (player_id) REFERENCES Users (id);

ALTER TABLE UserComplaint ADD FOREIGN KEY (user_id) REFERENCES Users (id);

ALTER TABLE LevelComplete ADD FOREIGN KEY (level_id) REFERENCES Level (id);

ALTER TABLE LevelComplaint ADD FOREIGN KEY (level_id) REFERENCES Level (id);

ALTER TABLE LevelTag ADD FOREIGN KEY (level_id) REFERENCES Level (id);

ALTER TABLE LevelTag ADD FOREIGN KEY (tag_name) REFERENCES Tag (name);

CREATE INDEX LevelCompleteOnLevelId ON LevelComplete (level_id);


-- +goose Down
