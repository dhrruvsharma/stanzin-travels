# Stanzin Travels — Backend

Go API for trip requests, backed by PostgreSQL.

## Run

```sh
createdb stanzin_travels   # or CREATE DATABASE stanzin_travels;
cp .env.example .env       # adjust DATABASE_URL if needed
DATABASE_URL="postgres://postgres:postgres@localhost:5432/stanzin_travels?sslmode=disable" go run ./cmd/server
```

Migrations in `internal/database/migrations/` are embedded in the binary and
applied automatically on startup (tracked in `schema_migrations`). The fleet
shown on the home page is seeded by the first migration.

## Endpoints

Public (customer site):

| Method | Path                    | Description                      |
| ------ | ----------------------- | -------------------------------- |
| GET    | `/healthz`              | Liveness check                   |
| GET    | `/api/v1/vehicles`      | Active fleet, in home-page order |
| POST   | `/api/v1/trip-requests` | Create a trip request            |

Dashboard auth (JWT, phone + password):

| Method | Path                    | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| POST   | `/api/v1/auth/register` | Create an account — always starts with role `user` |
| POST   | `/api/v1/auth/login`    | Returns access + refresh tokens and the user       |
| POST   | `/api/v1/auth/refresh`  | Bearer refresh token → new access token            |
| GET    | `/api/v1/auth/me`       | The authenticated account (role read live from DB) |

Dashboard data (Bearer access token; roles: `admin` sees everything,
`editor` sees bookings only, `user` sees nothing):

| Method | Path                       | Roles         | Description                          |
| ------ | -------------------------- | ------------- | ------------------------------------ |
| GET    | `/api/v1/trip-requests`    | admin, editor | Latest 100 bookings with day plans   |
| GET    | `/api/v1/users`            | admin         | All dashboard accounts               |
| PATCH  | `/api/v1/users/{id}/role`  | admin         | Change a role (not your own)         |

`GET /api/v1/trip-requests` filters (query params): `created_from`,
`created_to` (YYYY-MM-DD, on submission date), `min_group`, `max_group`,
`min_days`, `max_days` (trip length), `phone` (customer phone substring).

The second migration seeds the owner's admin account (phone `9045358209`).

`POST /api/v1/trip-requests` body:

```json
{
  "customer_name": "Tenzin Dorjay",
  "customer_phone": "+91 98765 43210",
  "group_size": 4,
  "service_type": "driver_only",
  "start_date": "2026-08-01",
  "end_date": "2026-08-03",
  "vehicle_slug": "innova-crysta",
  "day_plans": [
    { "day_number": 1, "place": "Leh" },
    { "day_number": 2, "place": "Nubra Valley" },
    { "day_number": 3, "place": "Pangong Tso" }
  ]
}
```

`service_type` is one of `driver_only`, `hotel_only`, `complete_itinerary`.
For `driver_only` and `hotel_only` a place is required for every trip day;
for `complete_itinerary` the day plans are omitted — the team builds the route.

## Environment

| Variable          | Default                 | Purpose                              |
| ----------------- | ----------------------- | ------------------------------------ |
| `PORT`            | `8080`                  | Listen port                          |
| `DATABASE_URL`    | — (required)            | PostgreSQL connection string         |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001` | Comma-separated CORS origins |
| `JWT_SECRET`      | dev-only default        | HMAC secret for dashboard JWTs       |
