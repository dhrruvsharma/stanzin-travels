CREATE TABLE IF NOT EXISTS vehicles (
    slug       TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    kind       TEXT NOT NULL,
    category   TEXT NOT NULL CHECK (category IN ('car', 'bike')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS trip_requests (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name  TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    group_size     INTEGER NOT NULL CHECK (group_size >= 1),
    service_type   TEXT NOT NULL CHECK (service_type IN ('driver_only', 'hotel_only', 'complete_itinerary')),
    start_date     DATE NOT NULL,
    end_date       DATE NOT NULL,
    vehicle_slug   TEXT NOT NULL REFERENCES vehicles (slug),
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS trip_request_days (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_request_id UUID NOT NULL REFERENCES trip_requests (id) ON DELETE CASCADE,
    day_number      INTEGER NOT NULL CHECK (day_number >= 1),
    place           TEXT NOT NULL,
    UNIQUE (trip_request_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_trip_requests_created_at ON trip_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trip_request_days_request ON trip_request_days (trip_request_id);

-- Seed the fleet shown on the home page, in home-page order.
INSERT INTO vehicles (slug, name, kind, category, sort_order) VALUES
    ('maruti-ertiga',  'Maruti Ertiga',  '7-seat MPV',       'car',  1),
    ('innova-crysta',  'Innova Crysta',  '7-seat flagship',  'car',  2),
    ('maruti-eeco',    'Maruti Eeco',    'Budget van',       'car',  3),
    ('himalayan-450',  'Himalayan 450',  'Adventure tourer', 'bike', 4),
    ('himalayan-411',  'Himalayan 411',  'Adventure tourer', 'bike', 5),
    ('bullet-350',     'Bullet 350',     'Classic cruiser',  'bike', 6)
ON CONFLICT (slug) DO NOTHING;
