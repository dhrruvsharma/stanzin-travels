CREATE TABLE IF NOT EXISTS reviews (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    rating     INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
    body       TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- Seed a handful of testimonials so the home page and back office have
-- something to show before real reviews come in.
INSERT INTO reviews (name, email, rating, body, created_at) VALUES
    ('Ananya Rao',      'ananya.rao@example.com',     5,
     'Namsras drove us from Leh to Turtuk and back — never once did we worry about the road. He knew every chai stop and every viewpoint. Easily the best part of our Ladakh trip.',
     now() - INTERVAL '42 days'),
    ('Rohit Menon',     'rohit.menon@example.com',    5,
     'Booked the complete itinerary for a group of six. Everything from hotels in Nubra to the Pangong campsite was sorted. One phone number for the whole trip, exactly as promised.',
     now() - INTERVAL '31 days'),
    ('Sarah Whitfield', 'sarah.whitfield@example.com',4,
     'Rode a Himalayan 450 that Stanzin Travels arranged. Bike was in great shape and the backup support over Khardung La gave me a lot of confidence. Would ride with them again.',
     now() - INTERVAL '20 days'),
    ('Vikram Singh',    'vikram.singh@example.com',   5,
     'Grew up hearing about Ladakh, finally went with my parents. Namsras was patient with the elders, planned easy days for acclimatisation, and treated us like family. Julley!',
     now() - INTERVAL '12 days'),
    ('Mei Lin',         'mei.lin@example.com',        4,
     'Smooth stay bookings across Leh, Nubra and Tso Moriri. Local rates, clean rooms, and someone who actually picks up the phone. Took the stress out of a high-altitude trip.',
     now() - INTERVAL '5 days')
ON CONFLICT (email) DO NOTHING;
