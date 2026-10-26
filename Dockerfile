# ==============================================================================
# MEDISUTRA PRODUCTION MULTI-STAGE DOCKERFILE
# Longitudinal Personal Health Intelligence Platform & Universal HRC
# ==============================================================================

# STAGE 1: Frontend Build Environment
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps || npm install

COPY frontend/ ./
RUN npm run build

# STAGE 2: Backend Build Environment
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci || npm install

COPY backend/ ./
RUN npm run build

# STAGE 3: Production Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies for backend only
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy compiled backend artifact
COPY --from=backend-builder /app/backend/dist ./backend/dist

# Copy compiled frontend SPA for static serving by Express
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy SQL migrations for automated container init
COPY backend/src/database/migrations ./backend/src/database/migrations

# Create non-root healthcare HIPAA / DPDPA compliance user
RUN addgroup -g 1001 -S medisutra && \
    adduser -u 1001 -S medisutra -G medisutra && \
    chown -R medisutra:medisutra /app

USER medisutra

EXPOSE 5000

# Health check against dedicated API health route
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "backend/dist/server.js"]
