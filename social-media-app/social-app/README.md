# Pulse — Mini Social App

A full-stack social media application built with **React + Node.js + MongoDB**.

---

## Project Structure

```
social-app/
├── backend/                   # Node.js + Express API
│   ├── models/
│   │   ├── User.js            # User schema (username, email, password)
│   │   └── Post.js            # Post schema (text, image, likes, comments)
│   ├── routes/
│   │   ├── auth.js            # /api/auth — signup, login, me
│   │   └── posts.js           # /api/posts — CRUD, like, comment
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── config/
│   │   └── multer.js          # Image upload configuration
│   ├── server.js              # App entry point
│   ├── .env.example           # Environment variable template
│   └── package.json
│
└── frontend/                  # React.js client
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js       # Axios instance + all API calls
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state (user, token)
    │   ├── components/
    │   │   ├── Navbar.js      # Top navigation bar
    │   │   ├── CreatePost.js  # Post creation form
    │   │   └── PostCard.js    # Individual post with like/comment
    │   ├── pages/
    │   │   ├── LoginPage.js   # Sign-in page
    │   │   ├── SignupPage.js  # Registration page
    │   │   └── FeedPage.js    # Main public feed
    │   ├── theme.js           # MUI dark theme config
    │   ├── App.js             # Router + layout
    │   └── index.js
    └── package.json
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm run dev
```

Backend starts at **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend starts at **http://localhost:3000**

---

## Environment Variables

### backend/.env

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/social-app
JWT_SECRET=change_this_to_a_long_random_secret
NODE_ENV=development
```

---

## MongoDB Collections

Only **two collections** are used:

| Collection | Fields |
|------------|--------|
| `users`    | `_id, username, email, password (bcrypt hashed), createdAt` |
| `posts`    | `_id, userId, username, text, image, likes[], comments[], createdAt` |

---

## API Overview

### Auth
- `POST /api/auth/signup` — Register
- `POST /api/auth/login` — Login → returns JWT
- `GET  /api/auth/me` — Get current user (JWT required)

### Posts
- `GET    /api/posts` — Public feed (newest first)
- `POST   /api/posts` — Create post (JWT, multipart/form-data)
- `DELETE /api/posts/:id` — Delete own post
- `POST   /api/posts/:id/like` — Toggle like
- `POST   /api/posts/:id/comment` — Add comment
- `DELETE /api/posts/:id/comment/:commentId` — Delete own comment

---

## Features

- Email + password authentication (JWT, bcrypt)
-  Create posts with text, image, or both
-  Public feed — all users' posts visible
-  Like / unlike with instant UI update
-  Comment with instant UI update
-  Usernames stored on likes and comments
-  Delete own posts and comments
-  Image upload (max 5MB, stored in /uploads)
-  Dark mode UI with MUI v5
-  Responsive layout
