CREATE TABLE IF NOT EXISTS therapies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ailment_therapies (
  ailment_id INTEGER NOT NULL REFERENCES ailments (id),
  therapy_id INTEGER NOT NULL REFERENCES therapies (id),
  PRIMARY KEY (ailment_id, therapy_id)
);
