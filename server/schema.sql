-- =============================================================================
-- schema.sql — Solstice Sanctuary Airbnb-Clone
-- Run AFTER creating the database and app user (see server/README.md).
-- Usage: mysql -u airbnb_app -p airbnb_db < schema.sql
-- =============================================================================

CREATE TABLE IF NOT EXISTS listings (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255)   NOT NULL,
  subtitle         VARCHAR(255),
  description      TEXT,
  property_type    VARCHAR(100),
  location         VARCHAR(255),
  price_per_night  DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  guests           INT            NOT NULL DEFAULT 1,
  bedrooms         INT            NOT NULL DEFAULT 1,
  beds             INT            NOT NULL DEFAULT 1,
  baths            INT            NOT NULL DEFAULT 1,
  rating           DECIMAL(3,2)   DEFAULT 0.00,
  review_count     INT            DEFAULT 0,
  host_name        VARCHAR(255),
  host_since       YEAR,
  host_is_superhost TINYINT(1)    DEFAULT 0,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listing_photos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  listing_id  INT          NOT NULL,
  url         VARCHAR(500) NOT NULL,
  room_label  VARCHAR(100),
  caption     VARCHAR(255),
  sort_order  INT          DEFAULT 0,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS amenities (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  listing_id  INT          NOT NULL,
  label       VARCHAR(150) NOT NULL,
  icon_key    VARCHAR(100),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255)        NOT NULL,
  created_at     TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlists (
  user_id     INT NOT NULL,
  listing_id  INT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, listing_id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
