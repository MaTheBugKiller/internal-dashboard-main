# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

#ARG NEXT_PUBLIC_AAM_BACKEND_URL="https://mobapp-bkend-cont-001-gxhrf6b5b3evfuhu.westeurope-01.azurewebsites.net/api/v1"

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

# Set environment variables
#ENV NODE_ENV=production
ENV PORT=3000
#ENV NEXT_PUBLIC_BASE_URL="https://aam-qa-lin.azurewebsites.net"

# Copy only the necessary files from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.env ./.env

# Install only production dependencies
#RUN npm ci --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]