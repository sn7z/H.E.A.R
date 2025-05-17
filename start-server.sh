#!/bin/bash

# Install required packages if not already installed
echo "Installing required Python packages..."

# Start Flask backend in background
echo "Starting Flask backend server..."
python test_app.py &
FLASK_PID=$!
echo "Flask running with PID: $FLASK_PID on http://localhost:5173"

echo "Starting report generator (FastAPI)..."
uvicorn final_back:app --reload --port 8001 &
FINAL_BACK_PID=$!
echo "Report generator running with PID: $FINAL_BACK_PID"

# Wait a bit to ensure Flask server starts
sleep 2

# Start npm dev server in background
echo "Starting frontend dev server..."
npm run dev &
NPM_PID=$!
echo "Frontend dev server running with PID: $NPM_PID"

# Start SMS module backend in background
echo "Running SMS Module..."
uvicorn sos_backend:app --reload &
SOS_PID=$!

# Start chatbot backend in background
echo "Running chatbot backend..."
python -m uvicorn chat_app:app --host 127.0.0.1 --port 5100 --reload &
CHAT_PID=$!

echo "All servers are running."
echo "Access frontend at http://localhost:5173"
echo "Chatbot backend at http://127.0.0.1:5100"
echo "Press Ctrl+C to stop all servers"

# Handle termination
trap "echo 'Stopping servers...'; kill $FLASK_PID $NPM_PID $SOS_PID $CHAT_PID; exit" SIGINT SIGTERM

# Keep script running
wait
