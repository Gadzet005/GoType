-- +goose Up
create extension if not exists fuzzystrmatch;
create extension if not exists pg_trgm;
-- +goose Down
