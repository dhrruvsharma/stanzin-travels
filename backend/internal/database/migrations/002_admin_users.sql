CREATE TABLE IF NOT EXISTS admin_users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    phone         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the owner's admin account (password set at project setup).
INSERT INTO admin_users (name, phone, password_hash, role) VALUES
    ('Namsras Stanzin', '9045358209', '$2a$10$oVEDNSHa3hmdvmWqWUNu2.nOdooZFayMqt.1e5Rp2.I.FAqwnHqAa', 'admin')
ON CONFLICT (phone) DO NOTHING;
