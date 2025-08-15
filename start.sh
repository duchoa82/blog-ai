#!/bin/bash
set -e

echo "🏗 Building frontend..."
cd frontend
npm install
npm run build

echo "🚀 Starting backend..."
cd ../backend
npm install --omit=dev
node server.js
