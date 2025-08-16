#!/bin/bash
# Build frontend
cd frontend
npm ci
npm run build
cd ..

# Install backend
cd backend
npm ci
cd ..

# Start backend server
node backend/server-mock.js
