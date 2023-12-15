DROP DATABASE IF EXISTS brewery_finder_db;

CREATE DATABASE brewery_finder_db;

\c brewery_finder_db;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS breweries;
DROP TABLE IF EXISTS users_breweries;



CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1),
  location TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT username_unique UNIQUE (username)
);


CREATE TABLE breweries
(
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    location text
);

CREATE TABLE users_breweries
(
    user_id INTEGER NOT NULL REFERENCES users ON DELETE CASCADE,
    brewery_id INTEGER NOT NULL REFERENCES breweries ON DELETE CASCADE,
    PRIMARY KEY(user_id, brewery_id)
);
-- admin with username: testadmin and password: Admin!123
-- admin with username: testuser and password: User!123
INSERT INTO users (username, password, first_name, last_name, email, location, is_admin) 
    VALUES ('testadmin', '$2b$12$0fCfj0hJYbV1V8TXnLjieeBhwm4T0snhUfERLD1nYtOGGsFF7cEC6','Test', 'Admin', 'admin@brew.ch', 'New York', true),
    ('testuser', '$2b$12$bzZzm6v.iDVzY59flIa.9OkD31PSByixyjNUCfmC7BfOnTUlcoxUO','Test', 'User', 'user@brew.ch', 'New York', false);

INSERT INTO breweries (name, location) VALUES ('Active Craft', 'Brooklyn, NY'),('Local Lager', 'Cypress, TX'),('LA Local', 'Los Angeles, CA'),('Active Brew', 'Edison, NJ'),('Mountain Spring', 'Denver, CO');


INSERT INTO users_breweries VALUES (1,1), (1,2),(1,4),(2,2),(2,1),(2,3);

-- SELECT u.id, u.name, b.name, b.location
-- FROM users AS u
-- LEFT JOIN users_breweries AS ub
-- ON u.id = ub.user_id
-- LEFT JOIN breweries AS b
-- ON ub.brewery_id = b.id
-- WHERE u.id = 1