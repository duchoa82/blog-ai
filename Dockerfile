# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install root dependencies
RUN npm install

# Copy frontend source files
COPY frontend/ ./frontend/

# Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# Copy remaining files (if any)
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
