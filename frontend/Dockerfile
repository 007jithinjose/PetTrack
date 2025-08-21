# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Set environment variables
ENV NODE_ENV=development

# Start the development server with hot-reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]