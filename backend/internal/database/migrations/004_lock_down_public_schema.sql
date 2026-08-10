-- Hosted Postgres providers (Supabase) expose the public schema over a REST API
-- to a browser-facing "anon" role. Nothing here is meant to be reachable that
-- way: the Go service is the only client and it connects as the table owner,
-- which is not subject to RLS. Enabling RLS without policies therefore closes
-- the REST path while leaving the backend's queries untouched.

ALTER TABLE vehicles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_request_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews           ENABLE ROW LEVEL SECURITY;

-- RLS only filters rows a role is already allowed to read, so drop the grants
-- as well. These roles do not exist outside Supabase, hence the guard.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
        REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
        REVOKE USAGE ON SCHEMA public FROM anon;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
    END IF;

    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
        REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
        REVOKE USAGE ON SCHEMA public FROM authenticated;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated;
    END IF;
END
$$;
