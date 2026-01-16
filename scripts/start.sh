#!/bin/bash

# Kill background processes on exit
trap "kill 0" EXIT

echo "Starting Obsidian Cobra..."

# Start Backend
cd backend && npm start &
BACKEND_PID=$!

# Start Frontend
cd frontend && npm run dev &
FRONTEND_PID=$!

wait
