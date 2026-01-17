#!/bin/bash

# Kill background processes on exit
trap "kill 0" EXIT


echo "Starting Obsidian Cobra..."

# Check and kill port 3001 if in use
if lsof -i :3001 -t >/dev/null; then
  echo "Port 3001 is in use. Killing blocking process..."
  lsof -ti :3001 | xargs kill -9
fi


# Start Backend
cd backend && npm start &
BACKEND_PID=$!

# Start Frontend
cd frontend && npm run dev &
FRONTEND_PID=$!

wait
