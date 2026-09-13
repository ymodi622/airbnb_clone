# Solstice Sanctuary — Backend API

Node.js + Express + MySQL backend for the Solstice Sanctuary Airbnb-clone.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `4000`) |
| `NODE_ENV` | `development` or `production` |
| `DB_HOST` | MySQL host (e.g. `localhost`) |
| `DB_PORT` | MySQL port (default: `3306`) |
| `DB_USER` | Least-privilege app user (see below) |
| `DB_PASSWORD` | App user password |
| `DB_NAME` | Database name (`airbnb_db`) |
| `JWT_SECRET` | Long random string for signing JWTs |
| `CLIENT_URL` | Exact frontend origin, e.g. `http://localhost:5173` |

---

## MySQL Setup

### 1. Create the database and app user (run as root)

```sql
CREATE DATABASE airbnb_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'airbnb_app'@'localhost' IDENTIFIED BY 'your-strong-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON airbnb_db.* TO 'airbnb_app'@'localhost';
FLUSH PRIVILEGES;
```

> **Do NOT grant GRANT OPTION, DROP, or ALL PRIVILEGES.**
> The app user has least-privilege access only.

### 2. Run the schema

```bash
mysql -u airbnb_app -p airbnb_db < schema.sql
```

### 3. Seed sample data

```bash
mysql -u airbnb_app -p airbnb_db < seed.sql
```

The seed is idempotent — safe to re-run to reset to the initial state.

---

## Starting the Server

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:4000`.

---

## API Reference

### Health
```
GET /api/health → { status: "ok" }
```

### Listings
```
GET /api/listings/:id → { listing, photos[], amenities[] }
```

### Auth
```
POST /api/auth/register  { email, password } → 201 { message }
POST /api/auth/login     { email, password } → 200 { message } + sets httpOnly cookie
POST /api/auth/logout    → 200 { message } + clears cookie
GET  /api/auth/me        → 200 { user }  (requires valid cookie)
```

> **Rate limiting:** `/auth/register` and `/auth/login` are limited to **5 requests/minute per IP**.

### Wishlist
```
POST /api/wishlist/:listingId         → { saved: boolean }  (auth required)
GET  /api/wishlist/:listingId/status  → { saved: boolean }  (returns false if not logged in)
```

---

## Frontend Integration Notes

1. **Add `credentials: 'include'` to every `fetch` call** so the browser sends the `httpOnly` cookie cross-origin:
   ```js
   fetch('http://localhost:4000/api/listings/1', { credentials: 'include' })
   ```

2. **Wishlist (heart icon):** On mount, call `GET /api/wishlist/1/status` to get the initial saved state. On click, call `POST /api/wishlist/1` and read the returned `{ saved }` to update the UI.

3. **Auth:** After `POST /api/auth/login` succeeds (status 200), call `GET /api/auth/me` to confirm the session and get the user object.

---

## Security Checklist

- [x] All SQL queries are parameterized — no string concatenation with user input
- [x] All route inputs validated with Zod (params, body)
- [x] Passwords hashed with bcrypt cost factor 12; never logged or returned in responses
- [x] JWT stored in `httpOnly`, `Secure`, `SameSite=Strict` cookie; never in response body or localStorage
- [x] CORS locked to `CLIENT_URL` — never `*`
- [x] Rate limiting on `/auth/login` and `/auth/register` (5 req/min/IP)
- [x] Centralized error handler: full errors in server logs only; generic messages to client
- [x] `.env` is gitignored; `.env.example` contains placeholders only
- [x] MySQL app user has least-privilege grants (SELECT, INSERT, UPDATE, DELETE only — no DROP)
