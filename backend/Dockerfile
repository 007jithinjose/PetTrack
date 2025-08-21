# Use Node.js LTS version
FROM node:20-alpine

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Start the development server with hot-reload
CMD ["npm", "run", "dev"]