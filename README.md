# Chat Station

A full‑stack, real‑time chat application with a React (Vite) frontend and a Node.js/Express backend. It includes JWT‑based authentication, message APIs, email notifications, media handling via Cloudinary, and production‑ready CORS/cookie settings.

## Contents
- Overview
- Architecture
- Tech Stack
- Quick Start
- Configuration
- Scripts
- API Reference
- Frontend Notes
- Deployment
- Troubleshooting

## Overview
Chat Station provides a clean, modern UI and a secure backend. The frontend (Vite + React + Tailwind) consumes REST APIs exposed by the backend (Express + MongoDB/Mongoose). Authentication uses HTTP‑only cookies carrying JWTs.

## Architecture
- Frontend (SPA): React 19, Vite 7, TailwindCSS, DaisyUI, Zustand for state, React Router, Axios for HTTP.
- Backend (API): Express 4, Mongoose 8, JWT auth with cookies, Resend for emails, Cloudinary for media, Arcjet for rate‑limiting/abuse protection.
- Database: MongoDB.
- Hosting (example): Frontend on Vercel, Backend on Render (see frontend/src/lib/axios.jsx).

## Tech Stack
| Layer | Libraries/Tools |
|---|---|
| Frontend | React, Vite, TailwindCSS, DaisyUI, Zustand, React Router, Axios, react‑hot‑toast |
| Backend | Node.js, Express, Mongoose, JWT, cookie‑parser, CORS, dotenv, Resend, Cloudinary, Arcjet |
| Dev | Nodemon, ESLint |

## Quick Start
### Prerequisites
- Node.js >= 20
- A MongoDB connection string
- Optional: Cloudinary account, Resend API key, Arcjet key

### Clone and install
```bash
# From project root
cd backend
npm install

cd ../frontend
npm install
```

### Run development
```bash
# Backend (port 3000 by default)
cd backend
npm run dev

# Frontend (port 5173 by default)
cd ../frontend
npm run dev
```

Open http://localhost:5173.

## Configuration
### Backend environment (.env)
Create backend/.env and set:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<random-strong-secret>
CLIENT_URL=http://localhost:5173

# Optional integrations
RESEND_API_KEY=<resend-api-key>
EMAIL_FROM=<from@example.com>
EMAIL_FROM_NAME=Chat Station
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
ARCJET_KEY=<arcjet-key>
ARCJET_ENV=dev
```
Key files:
- Backend app entry: backend/src/server.js
- Env loader: backend/src/lib/env.js
- JWT cookie settings: backend/src/lib/utils.js
- CORS allowlist: backend/src/server.js

### Frontend config
No frontend .env is required for local dev. The base API URL is selected by mode in frontend/src/lib/axios.jsx:
- development → http://localhost:3000/api
- production → https://chat-station.onrender.com/api

## Scripts
### Backend (backend/package.json)
| Script | Command | Purpose |
|---|---|---|
| dev | nodemon src/server.js | Run API with live reload |
| start | node src/server.js | Run API in production |

### Frontend (frontend/package.json)
| Script | Command | Purpose |
|---|---|---|
| dev | vite | Start Vite dev server |
| build | vite build | Build production assets to dist/ |
| preview | vite preview | Preview built assets locally |
| lint | eslint . | Run linting |

## API Reference
Base URL: http://localhost:3000/api

### Auth (backend/src/routes/auth.route.js)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /auth/signup | Public | Create a new user; sets JWT cookie |
| POST | /auth/login | Public | Authenticate user; sets JWT cookie |
| POST | /auth/logout | Protected | Clear JWT cookie |
| GET | /auth/check | Protected | Return the current authenticated user |
| PUT | /auth/update-profile | Protected | Update profile image (Cloudinary) |

### Messages (backend/src/routes/message.route.js)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /messages/contacts | Protected | List contacts you can chat with |
| GET | /messages/chats | Protected | List chat partners |
| GET | /messages/:id | Protected | Get messages with a user by id |
| POST | /messages/send/:id | Protected | Send a message to a user |

## Frontend Notes
- Protected routing is handled in frontend/src/App.jsx: the / route renders the chat page when authUser exists, otherwise it redirects to /login.
- Auth state and API calls live in frontend/src/store/useAuthStore.js. The store exposes checkAuth(), signup(), login(), and logout().
- Axios instance (with withCredentials: true) is defined in frontend/src/lib/axios.jsx.
- Example chat page uses logout() directly: see frontend/src/pages/ChatPage.jsx.

## Deployment
- Frontend: Build with npm run build in frontend/ and deploy dist/ to your static host (e.g., Vercel). Tailwind/DaisyUI are already configured.
- Backend: Deploy the Express server (e.g., Render) and set the environment variables listed above. Ensure HTTPS and correct CLIENT_URL for CORS.
- Cookies: In production (see backend/src/lib/utils.js), cookies are set with sameSite: "none" and secure: true for cross‑site usage; this requires HTTPS.

## Troubleshooting
- CORS blocked: Ensure CLIENT_URL in backend .env matches your frontend origin. The backend also allows http://localhost:5173 by default.
- Cookie not set/cleared: Verify your site uses HTTPS in production; sameSite: none requires secure: true. For logout, the API clears the jwt cookie at /auth/logout.
- Logout does not redirect: The frontend sets authUser = null on logout. The / route then navigates to /login. If this does not happen, confirm the store is imported from frontend/src/store/useAuthStore.js and that your component calls logout().
- MongoDB connection: Check MONGO_URI and server logs from backend/src/lib/db.js.
- Rate limiting: Arcjet middleware runs before auth (backend/src/middleware/arcjet.middleware.js); misconfiguration can reject requests.

---

For questions or improvements, open issues or PRs. This README aims to provide technical clarity for developers deploying and contributing to Chat Station.