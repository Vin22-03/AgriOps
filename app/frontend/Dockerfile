
# ------------------------------
# 🌾 AgroSphere Frontend (Next.js)
# ------------------------------

# 1️⃣ Base Image
FROM node:20-alpine AS builder

# 2️⃣ Working directory
WORKDIR /app

# 3️⃣ Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4️⃣ Copy source code
COPY . .

# 5️⃣ Build production app
RUN npm run build

# 6️⃣ Runtime image
FROM node:20-alpine
WORKDIR /app

# Copy from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 7️⃣ Expose port
EXPOSE 3000

# 8️⃣ Start Next.js
CMD ["npm", "start"]
