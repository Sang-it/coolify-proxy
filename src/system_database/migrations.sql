CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS USERS (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'engine') THEN
        CREATE TYPE engine AS ENUM ('mongodb', 'postgresql', 'redis');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS databases (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  engine ENGINE NOT NULL,
  connection_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
