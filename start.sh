#!/bin/bash
set -e

echo "🏗 Building frontend..."
cd frontend
bun install
bun run build

echo "🚀 Starting backend..."
cd ../backend
bun install --production
bun run start
