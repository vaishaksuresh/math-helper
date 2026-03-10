# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Build requires a placeholder API key during build (not used at runtime)
ENV ANTHROPIC_API_KEY=build-placeholder
ENV DATABASE_URL=/app/data/sqlite.db
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=/app/data/sqlite.db
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN mkdir -p /app/data

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
