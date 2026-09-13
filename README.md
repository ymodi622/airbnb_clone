# Solstice Sanctuary - Airbnb Clone

A pixel-perfect, full-stack clone of an Airbnb listing page featuring a dynamic photo tour, interactive image galleries, and a fully integrated MySQL backend.

## 🏗️ Project Structure

The project is split into two main directories:

* **`/client`**: The Frontend. Built with React, Vite, and TailwindCSS.
* **`/server`**: The Backend API. Built with Node.js, Express, and MySQL.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

## ⚙️ Backend Architecture Note

While the primary frontend focuses on perfectly replicating the visual design and UX of the Airbnb listing page, the backend is fully built out and robust. 

**Database (MySQL)**, **Authentication (JWT)**, and **REST API services (Listings, Users, Wishlist)** are fully implemented and ready to be utilized. However, the interactive UI elements for authentication and wishlist management were intentionally omitted from the frontend to strictly adhere to the requested clone requirements.

### 1. Database Setup (MySQL)
Make sure you have MySQL installed and running on your machine.

1. Open your MySQL client or terminal and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS airbnb_db;
   ```
2. Import the schema to create the necessary tables. From the `/server` directory, run:
   ```bash
   mysql -u root -p airbnb_db < schema.sql
   ```

### 2. Start the Backend (Server)
The backend serves the listing data and photo URLs via a REST API.

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `/server` folder if it doesn't exist and add your database credentials:
   ```env
   PORT=4000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=airbnb_db
   ```
4. **Seed the database:** Run the seeding script to populate the database with the listing and all 42 photos:
   ```bash
   npm run seed-photos
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API should now be running at `http://localhost:4000`.*

### 3. Start the Frontend (Client)
The frontend dynamically fetches all photo categories and listing data from the backend.

1. Open a new terminal tab and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running at `http://localhost:5173`.*

---

## 📸 Key Features

- **Dynamic Photo Grid**: The hero section on the homepage dynamically pulls the best photos from the database.
- **Categorized Photo Tour**: The `/photo-tour` page organizes photos by room (`Living room`, `Bedroom`, `Exterior`, etc.) dynamically driven by the database schema.
- **Interactive Lightbox**: Click on any photo to open a full-screen, keyboard-navigable image slider.
- **Responsive Design**: Fluidly adapts to mobile, tablet, and desktop viewports, heavily relying on Tailwind CSS grids and flexbox to match the Airbnb aesthetic.
- **Frontend Fallback**: The client uses local fallback data and assets so the interface can still be fully showcased even if the backend is down or not configured.

---


