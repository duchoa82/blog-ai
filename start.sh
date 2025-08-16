#!/bin/bash
# Build frontend
cd frontend
npm ci
npm run build
cd ..

# Copy frontend dist to backend
cp -r frontend/dist backend/

# Install backend
cd backend
npm ci
cd ..

# Start backend server
node backend/server-mock.js
