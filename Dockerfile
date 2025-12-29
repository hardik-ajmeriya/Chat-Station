# Multi-stage Dockerfile to build React frontend and run Express backend

# Build stage: use Node 22 to build frontend
FROM node:22.12.0-alpine AS build-frontend
WORKDIR /app

# Install frontend deps from lockfile
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN npm ci --prefix ./frontend

# Copy source and build
COPY frontend ./frontend
RUN npm run build --prefix ./frontend

# Runtime stage: run backend and serve built frontend
FROM node:22.12.0-alpine AS runtime

# Set working dir to backend so path.resolve() in server.js joins correctly
WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3000

# Install backend deps (omit dev)
COPY backend/package.json ./
RUN npm ci --omit=dev

# Copy backend source
COPY backend ./

# Copy built frontend assets
COPY --from=build-frontend /app/frontend/dist ../frontend/dist

EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]
