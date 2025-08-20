# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install root dependencies (without postinstall script)
RUN npm install --ignore-scripts

# Copy all source files
COPY . .

# Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
