CREATE TABLE diveData (
  id SERIAL PRIMARY KEY,
  year INTEGER,
  month INTEGER,
  day INTEGER,
  max_depth INTEGER,
  avg_depth INTEGER,
  duration INTEGER,
  dive_site VARCHAR(255),
  dive_buddy VARCHAR(50),
  gear_config VARCHAR(255)
);

CREATE TABLE dive_site (
  latitue INTEGER
  longitude INTEGER
);

-- CREATE TABLE gear_config (

-- );