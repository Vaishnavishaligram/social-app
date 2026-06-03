# Social App – Frontend

React.js + Material UI (MUI v5) client

## Setup

```bash
cd frontend
npm install
```

Create a `.env` file (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Then run:
```bash
npm start
```

App runs at **http://localhost:3000**

## Pages & Routes

| Route     | Page        | Auth Required |
|-----------|-------------|---------------|
| /signup   | SignupPage  | No            |
| /login    | LoginPage   | No            |
| /feed     | FeedPage    | Yes           |

## Tech

- React 18 + React Router v6
- Material UI v5 (dark theme, custom MUI components)
- Axios (with JWT interceptors)
- DM Sans + Space Mono (Google Fonts)
- dayjs (relative time for post timestamps)

## Features

- Signup / Login with JWT auth (token stored in localStorage)
- Create posts with text, image, or both
- Public feed of all posts (newest first)
- Real-time like toggle with instant UI update
- Add / delete comments with instant UI update
- Delete own posts and own comments
- Responsive layout (mobile-friendly)
