-- +goose Up
create extension if not exists fuzzystrmatch;
-- +goose Down
