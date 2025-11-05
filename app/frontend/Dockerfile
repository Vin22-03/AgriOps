# ------------------------------
# 🌾 AgroSphere Frontend (Next.js)
# Multi-stage build (Builder + Runner)
# ------------------------------

# 🧱 1️⃣ Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# ✅ Copy env file (must come BEFORE build)
COPY .env.local .env.local


# Build production app
RUN npm run build

# 🏃‍♂️ 2️⃣ Runner stage (lightweight)
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only what’s needed for runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Optional: copy config if exists
RUN if [ -f /app/next.config.js ]; then cp /app/next.config.js .; fi
RUN if [ -f /app/next.config.mjs ]; then cp /app/next.config.mjs .; fi

# Environment setup
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
