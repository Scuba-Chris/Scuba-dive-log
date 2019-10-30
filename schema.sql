CREATE TABLE divedata (
  id SERIAL PRIMARY KEY,
  date INTEGER,
  max_depth INTEGER,
  avg_depth INTEGER,
  duration INTEGER,
  dive_site VARCHAR(255),
  dive_buddy VARCHAR(50),
  gear_config VARCHAR(255)
);

CREATE TABLE dive_site (
  latitude INTEGER,
  longitude INTEGER
);

-- CREATE TABLE gear_config (

-- );

INSERT INTO divedata (date, max_depth, avg_depth, duration, dive_site, dive_buddy, gear_config) values (10232019, 110, 60, 55, 'cozumel mexico', 
'kevin ceder', 'BP&W');