# Wanderlust (project-phase)

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](./package.json)

**Wanderlust** is a home rental website prototype focused on admin-side features for managing listings (images, location, and reviews). The current implementation emphasizes listing management and review moderation; booking and payment flows are not implemented.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture (MVC)](#-architecture-mvc)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Run (Local)](#-installation--run-local)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Development Notes](#-development-notes)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- User authentication (local + Google OAuth)
- Create / Edit / Delete listings with image uploads (Cloudinary)
- Geocoding and interactive map (Mapbox)
- Reviews with rating and comments
- Server-side validation with Joi
- Flash messages and session-based auth
- Focus: Home rental website — admin-side listing management; booking/payment flows are out of scope

---

## 📌 Scope

This project is a home rental website prototype that focuses on the **admin side**. It implements tools for creating, editing, and deleting listings, uploading images, geocoding locations, and moderating reviews. While users can sign in and leave reviews, there is **no booking/reservation or payment** functionality in this implementation.

---

## 🧭 Tech Stack

- Node.js (Express)
- EJS + `ejs-mate` for templating
- MongoDB + Mongoose
- Passport for authentication (local & Google)
- Cloudinary for image storage (via `multer-storage-cloudinary`)
- Mapbox for maps and geocoding
- Joi for request validation

---

## 🏛️ Architecture (MVC)

This project follows the **Model–View–Controller (MVC)** pattern:

- **Models** (`/models`) — define schemas and interact with MongoDB via Mongoose (`listing.js`, `review.js`, `user.js`).
- **Views** (`/views`) — EJS templates that render UI (pages, partials, layouts).
- **Controllers** (`/controler`) — contain business logic and interact with Models; routes call these controllers to handle requests.
- **Routes** (`/routes`) — define URL endpoints and map them to controller actions.
- **app.js** — application entry point: config, middleware, and route wiring.

> Note: The controllers folder is named `controler/` in this project (typo preserved). You can rename it to `controllers/` if you prefer.

---

## 📁 Project Structure (short)

- `app.js` — entry point
- `routes/` — routing definitions
- `controler/` — controllers (business logic)
- `models/` — Mongoose models
- `views/` — EJS templates and layouts
- `public/` — static files (CSS, client JS)
- `cloudConfig.js` — Cloudinary config
- `passportAuthGoogle.js` — Google OAuth handler
- `utils/` — helper utilities (`ExpressError`, `WrapAsync`)

---

## ⚙️ Prerequisites

- Node.js (>= 18 recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Mapbox access token (for maps)
- Google OAuth credentials (optional)

---

## ⚡ Installation & Run (Local)

1. Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd project-phase
npm install
```

2. Create a `.env` file (see [Environment Variables](#-environment-variables)).

3. Start the server:

```bash
npm start
# or for development with hot reload (if you install nodemon):
npm run dev
```

The app runs on port **8080** by default (`http://localhost:8080`).

---

## 🧾 Environment Variables (.env)

Create a `.env` file in the project root. Example variables used by the app:

```
# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/nir

# Session
SESSION_SECRET=your_session_secret_here

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Mapbox
MAP_TOKEN=your_mapbox_token

# Google OAuth (optional for sign in)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

> 🔒 Do **not** commit real credentials to the repo. Consider adding `.env` to `.gitignore`.

I can add a `.env.example` file with safe placeholders if you'd like — tell me and I'll add it.

---

## 🧰 Scripts

Add these to `package.json` for convenience:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

---

## 💡 Development Notes

- Image uploads use Cloudinary (configured in `cloudConfig.js`) and store files under `wanderlust_dev`.
- Mapbox token is injected into views for client-side map rendering (`views/listings/show.ejs` uses `process.env.MAP_TOKEN`).
- Passport Google strategy is implemented in `passportAuthGoogle.js` and wired in `app.js`.
- Default DB connection in `app.js` points to `mongodb://127.0.0.1:27017/nir` — update to `MONGO_URI` for production.
- Current scope: Admin-side only (listing management and review moderation). No booking/reservation or payment integration is included.

---

## 🤝 Contributing

Contributions are welcome:

1. Fork the repo
2. Create a topic branch
3. Open a pull request with a clear description of changes

Please follow the existing code style and add tests where appropriate.

---

## 📜 License

This project is licensed under the **ISC** License — see `package.json`.

---

<p align="center">Made with ❤️ — Wanderlust</p>
