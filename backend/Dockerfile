FROM golang:1.26-alpine AS build

WORKDIR /src

# Cached separately so dependency downloads survive source-only changes.
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Static binary: the runtime image has no libc.
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./cmd/server

# distroless/static ships CA certificates, which pgx needs for Supabase's TLS.
FROM gcr.io/distroless/static-debian12:nonroot

COPY --from=build /server /server

EXPOSE 8080
ENTRYPOINT ["/server"]
