-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS points CASCADE;
CREATE TABLE points (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  description TEXT,
  image VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  coordinates VARCHAR(255) NOT NULL
);
