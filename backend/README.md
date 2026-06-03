# Social App – Backend

Node.js + Express + MongoDB REST API

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

## API Endpoints

### Auth
| Method | Route              | Auth | Description          |
|--------|--------------------|------|----------------------|
| POST   | /api/auth/signup   | ❌   | Register new user    |
| POST   | /api/auth/login    | ❌   | Login & get token    |
| GET    | /api/auth/me       | ✅   | Get current user     |

### Posts
| Method | Route                              | Auth | Description            |
|--------|------------------------------------|------|------------------------|
| GET    | /api/posts                         | ❌   | Get public feed        |
| POST   | /api/posts                         | ✅   | Create post            |
| DELETE | /api/posts/:id                     | ✅   | Delete own post        |
| POST   | /api/posts/:id/like                | ✅   | Toggle like            |
| POST   | /api/posts/:id/comment             | ✅   | Add comment            |
| DELETE | /api/posts/:id/comment/:commentId  | ✅   | Delete own comment     |

## MongoDB Collections
- **users** – `_id, username, email, password (hashed), createdAt`
- **posts** – `_id, userId, username, text, image, likes[], comments[], createdAt`

## Image Uploads
Uploaded images are stored in `/uploads` and served statically.
Max file size: 5MB. Supported: jpeg, jpg, png, gif, webp.
