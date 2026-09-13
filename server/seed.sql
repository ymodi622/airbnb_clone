-- =============================================================================
-- seed.sql — Sample data for Solstice Sanctuary
-- Matches the reference screenshots exactly (images, amenities, meta).
-- Usage: mysql -u airbnb_app -p airbnb_db < seed.sql
-- Safe to re-run (idempotent deletes before inserting).
-- =============================================================================

-- ── Default root user (always valid for testing) ───────────────────────────
-- Login: root@solstice.com / root1234
INSERT INTO users (id, email, password_hash)
VALUES (
  1,
  'root@solstice.com',
  '$2b$12$I3yRBqbKSi9EQHsaSno7o.tJgmm/4.TDhMxkCOud.CR./ARqhDB6u'
)
ON DUPLICATE KEY UPDATE
  email         = VALUES(email),
  password_hash = VALUES(password_hash);

-- Clear dependent tables first so re-seeding is idempotent
DELETE FROM wishlists    WHERE listing_id = 1;
DELETE FROM amenities    WHERE listing_id = 1;
DELETE FROM listing_photos WHERE listing_id = 1;
DELETE FROM listings     WHERE id = 1;

-- ── Listing ────────────────────────────────────────────────────────────────
INSERT INTO listings
  (id, title, subtitle, description, property_type, location,
   price_per_night, guests, bedrooms, beds, baths,
   rating, review_count, host_name, host_since, host_is_superhost)
VALUES (
  1,
  'The Solstice Sanctuary — Desert Pavilions & Natural Springs',
  'Architectural Sanctuary No. 04',
  'An extraordinary rammed-earth modernist villa nested in the boulders of Joshua Tree Highlands. Floor-to-ceiling pivot glass walls dissolve the boundary between interior and desert. Sunrise turns the pavilions into lanterns of warm terracotta light. Three independent rammed-earth sleeping pavilions, a geothermal plunge pool, cedar soaking tub, outdoor volcanic shower, and a sunken fire pit under an ocean of stars.',
  'Villa',
  'Yucca Valley, Joshua Tree Highlands, California',
  680.00,
  8, 3, 4, 3,
  4.98, 124,
  'Soren & Maya',
  2019,
  1
);

-- ── Hero gallery photos ────────────────────────────────────────────────────
INSERT INTO listing_photos (listing_id, url, room_label, caption, sort_order) VALUES
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2e12FdSYQRHhnM8ffJ_ph44fEmCSDD2ooP1O0a35BIdfKMm2_Ez88gtglxwfxTC7xhlaX4dn1u96sEgRxpRkSLaXE_Ftp1XP31ujqRxUX5HR1MmtyXajcJnKcj4igpIXso75Rhm0DCBJ9V1ruVwJ6t-8qQDjsx7MUgFlER7MqQ-uVQPA8QK25da8IRMgKLC_dI1LyUYhLmbieh_IdYtD4brhQT6w_u7t-xpOVjy9eSV5QsWfTgl5h', 'Exterior', 'Main Residence — rammed-earth facade at golden hour', 1),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfiQGTs3PuPeCnCK--ixchPYxP4ZgOYCG88MB_MEyb9qRwhGG8ESg8A0at0dDjJPgDX6S1_gWhhs5qT7JUWCXyHUerlfgsPishEEliiI3-Q7goRluZrbHL1w9LUJdpxX0HSv5Sm8RqEOjruiTW9MqJRZXm3fGgirwfPPMDFqXiM9d3HwuNybd4iEixoNtL_fgRX_Trio3zJC6eDPak-xBVxDQI_QNmr0uj_yPVjoalyhcTDDYI33s9', 'Pool', 'Desert plunge pool — ochre travertine at dawn', 2),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpHDywmeC5iZUaQ8EAGhVAg_KNinsBnrvseiieuvbrFzheaNs0SpgHZzVbN39X2XUZZFqIW6Mt7EsXUqb-jRe2lHGBNVAxk5_uR5GbjlQ2Bs0QbL2bfMCwIsybOV7GVA1nNt_PwIGDE4WZWgpYQC-YbsCQQwSJYegKBl1-xzb9fBvlw3sRHuyEKF7JlMtgZOS1-70pScwHLaeXgiXxyTSZNsUEPs5U0NQtCSLMU_ZNWzzz7eaPRbo8', 'Primary Suite', 'Primary Pavilion Suite — minimalist oak bed', 3),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCznvq9jy1W7-Ann4MG-dCuJFnNVY8nwVcQJuBzuSp7nfS9J6RqTOryfGSz7kT0_3E6buUqlBy50s1PtFeIWuCQj5IGincFeMFC0ZF7nY61I9zscTSOcyq8sZZNcrXd_lJSyuP4uZN6XdeFzV0rdxtOnm9S1nIO0Tpq83nDDfws2yxc_zpFHgbkEa_eV8sIvjOtdtcKRGOkPYnLJDL8TjWjB7yfFKl9oyj7vRvN1_8aF0jDqi_X0KnM', 'Kitchen', 'Artisanal chef''s kitchen — basalt stone countertops', 4),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0sSdCbpp7jVPcOQT41dgVmS3U-zyii89PwCpJPd4vBKCJ4UuwJKeD5ENGjnfLZlQkDbb-uIbMOZymSeYVqz995Fte8XoKVh4SjoLWloOlT_3JZ-_wE9cUe-iFZlyARVMrmQqSykQOVIicb1XVbzRzId1v-PrixE9EZQbvI3QqQv_JvrWNaSqwvw3FAHpkOsoCCrrTRJ-BqzDOO4q8muUs4A6_Hwzw_P2UsYiXS-sfmqrXaCvb3v77', 'Landscape', 'Evening desert landscape — Joshua Trees at twilight', 5),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4gXlScf2BWj4G8hQjXsbGpQQXPvZuFSimbaLY0jf9PM45Gnlig9KHCY0q4IWbzFDqePQ3JjelbZMHqcxeHj9AaE1-svdctu440p4ujv4KSKb8n2wKuNa89ZXifBuOxHLGzfjlqGx2lDzkq7Puy1lTZfXFxPFqzEtTfZGYyB6SxX7ELbVEiePqevlmnKi9lrVQfsak4rN_mQQFycEPToDBqbjp-IXVjldOT3L8uYlgX_eHMNNMelnB', 'Primary Suite Interior', 'Primary Suite — raw oak timber joinery', 6),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAT5wuAx-n5398NvlroJ3Wz4yC2Xrk8XBirEmmKJTT2iejLmYrzaj0-OhtZzzCxV1WXyalay_TIE6dGEgnXtqOLgZKcuUp-L7xJgNl25uWuKvB2dCbATl-F8QgBv7TJcLDwjrWhnq2448pTbABfIo9g_YSg9i8mqL9lAQZHvjzk41vW0sZ2NhhBHTMKDa9OTTvbLgrDMnhxU3t89Nu2VfcZE1Q5DTIn4AQMYwR0DKnA9wR6rTD9oXw', 'Sun Terrace', 'Sun Terrace Lounge — linen daybeds at dusk', 7),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfdEenYz3BhxFE26k0Y0EIBCG6MDftKz0OZknB_7HKYk1CFdkjRi8gWDZpSZPjn6DQ0ABmSEsL3-8PpiuFfz8iMhutlCfoAHJUjVA0z-88jtbxX_FrtVGsu2ATadhACldkwZ7-2Y-IOR2Hg8KeYLX8Oiej6gC_s6XCKwb1Kc-o8kR4CehyPzKFooLxTE6NfJlP2GNJEUCDhbsvOI_P1_tStmuA9nLgE5BecDyWTUeGi5uqPUKwnbKS', 'Outdoor Plunge Pool', 'Outdoor Plunge Pool — geothermal heated, concrete steps', 8),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQMWdJLeFXrYDeIvS9sJGVNiiXUYnrPTw16n47OWjb5ukR4k8UeorD3RAlFfGEato1LgASL3vcNKhPSkEiphEdn1Gj4PFQ7Ae7amWlGeDgZfvW3wmVvbqCcwPBipyP6ZYgFJjS2RILizwxsoodmMGwc674lN2VyLBpiUB6j4n8hR3nbAtvUeJopKK8VZq-OsMzAebq6MDcZzXxdSsy2lL0JC5LGRMqJ5C2gC9dWlIWODMR78IouNFL', 'Fire Pit', 'Sunken fire pit — midnight desert under stars', 9),
(1, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEFH37uA_wA_j-SWFoXcJ0exLOgq2TsbQR_9LKxh6fwMyRXAbzolXR1LkwR86dX2e-kUW49fYbT1eo-nTFbUdqjwoZ6NziOI-LaxJF_pDZpKIyALAOKrEUOVGs3TtrmxdvjAI2J5PVAZHBt6X_jQ5Em1rqpDICg6n1PksHfnVc1QNQxKluZVjhqhkkZUPuK9skasuACuRcMy8bYnt1RJ_CHi--zc6PPXLGpcdiTrWz3S0B76Bgc_x5', 'Panorama Sauna', 'Private cedar sauna — bronze-tinted panoramic glass', 10);

-- ── Amenities ──────────────────────────────────────────────────────────────
INSERT INTO amenities (listing_id, label, icon_key) VALUES
(1, 'High-speed Starlink satellite WiFi (220 Mbps)', 'wifi'),
(1, 'Custom Cedar soaking tub & natural spring pool', 'hot_tub'),
(1, 'Sunken outdoor fire pit with piñon wood', 'local_fire_department'),
(1, 'Level 2 EV charger (Tesla & J1772)', 'ev_station'),
(1, 'Fully equipped artisanal chef''s kitchen', 'soup_kitchen'),
(1, 'Panoramic desert valley & boulder park view', 'landscape'),
(1, 'Geothermal climate control & HEPA air scrubbers', 'air'),
(1, 'Cast-iron indoor wood-burning hearth', 'nest_heat_link_gen_3'),
(1, 'Bang & Olufsen multi-room soundscape system', 'speaker'),
(1, 'Outdoor yoga deck with Manduka cork mats', 'self_improvement');
