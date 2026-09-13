# Backend + Database Roadmap — Airbnb-Clone App

You already have full context on the frontend of this Airbnb-clone project. Now build the backend: Node.js + Express API with MySQL, supporting simple email/password auth and a wishlist (save/heart) feature, following the sequencing and security rules below exactly. Do not skip steps or reorder them.

Scope

Build only:

A read API for listing data (listing details + photos + amenities) that matches the exact JSON shape my frontend components currently expect — inspect the frontend's existing mock data / prop types first and mirror that shape precisely. Do not invent a different structure.
Simple auth: register, login, logout, "get current user."
Wishlist: toggle save/unsave a listing for the logged-in user, and a way to fetch whether the current listing is saved.

Do not build bookings, payments, messaging, reviews, or search — out of scope for this task.

Build order (follow this sequence, don't jump ahead)
Express skeleton first, returning hardcoded/mock JSON in the exact shape the frontend expects. Confirm the frontend renders correctly against these mock routes before touching the database.
Then design and create the MySQL schema, based on the data shape already proven in step 1.
Then replace the hardcoded JSON with real parameterized MySQL queries.
Then add auth (register/login/logout/me).
Then add wishlist endpoints, protected by auth.
Finally, do a dedicated security-hardening pass over everything built (checklist below) — as its own pass, not interleaved with feature work.

At the end of each numbered step, tell me it's done and what to verify before you continue to the next step.

Tech constraints
Node.js + Express, mysql2 (promise API) with a connection pool — no ORM unless I ask.
Validation with zod on every route (params, query, body).
bcrypt for password hashing, cost factor 12.
JWT for session auth: short-lived access token (15 min), delivered via httpOnly, Secure, SameSite=Strict cookie — never in response body or localStorage.
helmet, cors (locked to my frontend's exact origin, never *), express-rate-limit on auth routes (e.g. 5 requests/min/IP on login and register).
Centralized error-handling middleware: log full errors server-side, return generic messages to the client, never leak stack traces or raw SQL errors.
All DB access via parameterized queries — never string-concatenated or template-literal SQL with user input, anywhere, no exceptions.
.env for all secrets (DB creds, JWT secret, CORS origin); generate a .env.example with placeholder values; make sure .env is gitignored.
Data model (adapt field names to match the frontend's actual data shape — don't force this exactly if the frontend expects different keys)
listings — id, title, subtitle, description, property_type, location, price_per_night, guests, bedrooms, beds, baths, created_at
listing_photos — id, listing_id (FK), url, room_label, caption, sort_order
amenities — id, listing_id (FK), label, icon_key
users — id, email (unique), password_hash, created_at
wishlists — user_id (FK), listing_id (FK), created_at, composite PK (user_id, listing_id)

Use ON DELETE CASCADE on all foreign keys. Create a dedicated least-privilege MySQL app user (not root) with grants scoped only to this schema, and give me the CREATE USER/GRANT statements separately from the app migration so I can run them manually.

API surface to implement
GET /api/listings/:id — full listing + photos + amenities, joined
POST /api/auth/register — email + password, hashes password, creates user, returns success (not the token — force a separate login)
POST /api/auth/login — email + password, verifies hash, sets JWT cookie
POST /api/auth/logout — clears the cookie
GET /api/auth/me — returns current user from a valid cookie, 401 if none/invalid
POST /api/wishlist/:listingId — toggle save/unsave for the current user (auth required)
GET /api/wishlist/:listingId/status — whether current user has saved this listing (auth required; return false gracefully if not logged in rather than erroring, since the heart icon should still render for logged-out users)
Deliverables
Full server code under server/, structured as: routes/, controllers/, middleware/, db/, config/.
schema.sql (table definitions) and seed.sql (one sample listing with 8–10 photos and a handful of amenities, matching the reference screenshots I gave you earlier, so the app isn't empty on first run).
A short server/README.md: env vars needed, how to create the DB user, how to run schema + seed, how to start the server.
A frontend integration note: exactly what changes (if any) the frontend needs — e.g., fetch calls needing credentials: 'include' for the auth cookie to work, and where the heart icon component should call the wishlist endpoints.
At the very end, a self-review against this checklist — go through it explicitly and confirm each line, don't just say "done":
 Every SQL query is parameterized, none string-concatenated
 Every route validates its inputs with zod
 Passwords are hashed with bcrypt, never logged or returned in any response
 JWT is in an httpOnly/Secure/SameSite cookie, never in localStorage or response JSON
 CORS origin is locked to my exact frontend URL, not *
 Rate limiting is active on /auth/login and /auth/register
 Errors return generic messages to the client; full details only in server logs
 .env is gitignored and a .env.example exists with placeholders only
 The MySQL app user has least-privilege grants, not root
Working style
Work in the order above; pause after each numbered step and tell me what to verify (e.g., "hit GET /api/listings/1 and confirm it matches the frontend's expected shape") before continuing.
If the frontend's current mock data shape is ambiguous or inconsistent anywhere, stop and ask me rather than guessing.
Keep commits small and scoped to one step each, with clear messages, so I have a real history.



## 1. When to implement the DB (sequencing advice)

This is the part people usually get backwards under time pressure — sequence matters more than speed here.

**Do NOT start with the DB.** Reasons:
- Your frontend already renders against mock/static data — that's your working demo fallback if backend runs out of time.
- Schema decisions are easier once you know exactly what shape of data your components already consume (props/JSON structure) — reverse-engineer the schema from your frontend's data model, not the other way around.
- If MySQL setup (local install, connection issues, migrations) eats 45 minutes, you don't want that to block your only demoable artifact.

**Correct order:**
1. **Express skeleton first** (routes, middleware, security headers) — return **hardcoded JSON** matching your frontend's existing data shape. Point your frontend at this API. This alone proves the integration works end-to-end.
2. **MySQL schema + seed script second** — once the API contract is proven, swap the hardcoded JSON for real DB queries. This is a small, low-risk change if step 1 is done right (just swap what's inside the route handler).
3. **Security hardening pass third** — after functionality works, go back and add validation/rate-limiting/least-privilege — do this as a distinct pass, not interleaved, so you don't debug two things at once.

This way, at every checkpoint you have something that runs, even if you stop early.

---

## 2. Backend Roadmap

### Step 1 — Express skeleton (20–30 min)
```
server/
  src/
    app.js
    server.js
    routes/
      listings.routes.js
      wishlist.routes.js      (only if needed)
    controllers/
      listings.controller.js
    middleware/
      errorHandler.js
      validate.js
    db/
      pool.js
    config/
      env.js
  .env.example
  package.json
```
- [ ] `npm i express cors helmet express-rate-limit dotenv zod mysql2 morgan compression`
- [ ] `npm i -D nodemon`
- [ ] Wire `helmet()`, `cors({ origin: process.env.CLIENT_URL })` (never `origin: '*'`), `express.json({ limit: '10kb' })`, `morgan('dev')` for request logging.
- [ ] Global error-handling middleware last in the stack — catches thrown errors, returns generic messages, logs full error server-side only.
- [ ] Build routes returning **hardcoded JSON first** matching your frontend's props shape exactly. Confirm frontend renders correctly against this before touching MySQL.

### Step 2 — MySQL schema + connection
- [ ] Install MySQL locally (or use a free hosted instance — PlanetScale free tier or Railway — if local setup risks eating time).
- [ ] Create a **dedicated app-level DB user**, not root:
  ```sql
  CREATE DATABASE airbnb_db;
  CREATE USER 'airbnb_app'@'localhost' IDENTIFIED BY 'strong-random-password';
  GRANT SELECT, INSERT, UPDATE, DELETE ON airbnb_db.* TO 'airbnb_app'@'localhost';
  FLUSH PRIVILEGES;
  ```
- [ ] Schema (adjust field names to match your exact frontend data shape):
```sql
CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  property_type VARCHAR(100),
  location VARCHAR(255),
  price_per_night DECIMAL(10,2),
  guests INT, bedrooms INT, beds INT, baths INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listing_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  room_label VARCHAR(100),      -- e.g. "Living room 1" for Photo Tour grouping
  caption VARCHAR(255),
  sort_order INT DEFAULT 0,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  label VARCHAR(150) NOT NULL,
  icon_key VARCHAR(100),
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- Only if you're implementing the save/heart toggle:
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlists (
  user_id INT NOT NULL,
  listing_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, listing_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);
```
- [ ] Write `seed.sql` with 1 listing + 8–10 photos matching your reference screenshots (real URLs or placeholders), so graders see a populated app immediately, not an empty state.
- [ ] Connection pool (`db/pool.js`), never a single raw connection:
```js
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
module.exports = pool;
```

### Step 3 — Wire real queries
- [ ] Replace hardcoded JSON in controllers with pooled, **parameterized** queries:
```js
const [rows] = await pool.query(
  'SELECT * FROM listings WHERE id = ?',
  [listingId]
);
```
- [ ] Never build SQL via string concatenation/template literals with user input — this is the #1 injection vector.
- [ ] Validate route params/body with `zod` before they reach the query layer:
```js
const paramsSchema = z.object({ id: z.coerce.number().int().positive() });
```
- [ ] Return 404 (not a raw DB error) when a listing doesn't exist.

### Step 4 —  Auth + wishlist
- [ ] `bcrypt` for password hashing (cost factor 12).
- [ ] JWT access token, short-lived (15 min), stored in an `httpOnly`, `Secure`, `SameSite=Strict` cookie — not `localStorage` (XSS-exposed).
- [ ] `express-rate-limit` specifically on `/auth/login` and `/auth/register` (e.g. 5 requests/min per IP) to blunt brute force.
- [ ] Middleware to verify JWT on protected routes (`POST /wishlist`, `DELETE /wishlist/:id`).

### Step 5 — Security hardening pass 
Go through this checklist against your finished code:
- [ ] All queries parameterized — grep your codebase for any string-concatenated SQL.
- [ ] All route inputs validated (params, query, body).
- [ ] `helmet()` active; CORS locked to your actual frontend origin.
- [ ] Rate limiting on auth + any write endpoints.
- [ ] `.env` never committed; `.env.example` with placeholder values included in submission.
- [ ] Errors don't leak stack traces/SQL text to the client (`NODE_ENV=production` disables Express's default verbose error pages).
- [ ] DB user has least-privilege grants (no `DROP`, no cross-schema access).
- [ ] Passwords hashed, never logged or returned in any API response.
- [ ] If deploying: HTTPS enforced (Vercel/Render/Railway default to this — just confirm).

---


## 4. Quick sanity checks before you call it done

- [ ] Does the app still work if you stop the DB? (i.e., can you demo frontend independently if backend has an issue during evaluation — worth keeping a `USE_MOCK_DATA` env flag as a fallback)
- [ ] Does the seed script run cleanly on a fresh DB with one command (`mysql -u ... < seed.sql`)? Graders shouldn't have to guess your data setup.
- [ ] Is your `README.md` updated with exact setup steps (env vars, DB creation, seed command, `npm run dev` for both client/server)?

