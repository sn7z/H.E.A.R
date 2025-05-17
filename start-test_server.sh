#!/bin/bash

# Function to check if a port is already in use
is_port_in_use() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -i:"$1" >/dev/null 2>&1
    return $?
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tuln | grep ":$1 " >/dev/null 2>&1
    return $?
  else
    echo "Warning: Can't check if port $1 is in use (missing lsof/netstat)"
    return 1
  fi
}

echo "Installing required Python packages..."
# pip install -r requirements.txt   # Uncomment if needed

echo "Starting main Flask backend..."
python test_app.py > main.log 2>&1 &
MAIN_FLASK_PID=$!
echo "Main Flask PID: $MAIN_FLASK_PID"

echo "Starting chatbot Flask backend..."
python chat_test.py > chatbot.log 2>&1 &
CHATBOT_FLASK_PID=$!
echo "Chatbot Flask PID: $CHATBOT_FLASK_PID"

# Check if port 8001 is already in use
if is_port_in_use 8001; then
  echo "ERROR: Port 8001 is already in use. Cannot start report generator."
  echo "Try: lsof -i:8001 or netstat -tuln | grep 8001 to see what's using it."
else
  echo "Starting report generator backend..."
  # More verbose output to help diagnose the issue
  echo "Command: uvicorn final_back:app --reload --port 8001"
  
  # Check if the module exists first
  if python -c "import final_back" 2>/dev/null; then
    echo "Module final_back found, starting service..."
    uvicorn final_back:app --reload --port 8001 > report.log 2>&1 &
    REPORT_PID=$!
    echo "Report generator PID: $REPORT_PID"
  else
    echo "ERROR: Cannot import module 'final_back'. Check the file exists and is importable."
    echo "Current directory: $(pwd)"
    echo "Python path: $PYTHONPATH"
    ls -la | grep final_back || echo "final_back.py not found in current directory"
    REPORT_PID=""
  fi
fi

sleep 2

echo "Starting frontend dev server..."
npm run dev > frontend.log 2>&1 &
NPM_PID=$!
echo "Frontend PID: $NPM_PID (http://localhost:5173)"

echo "All servers running."
echo "Main:      http://localhost:5000"
echo "Chatbot:   http://localhost:5100"
if [ -n "$REPORT_PID" ]; then
  echo "Reports:   http://localhost:8001"
else
  echo "Reports:   NOT RUNNING (see errors above)"
fi
echo "Frontend:  http://localhost:5173"

echo "To check logs:"
echo "  Main log:      tail -f main.log"
echo "  Chatbot log:   tail -f chatbot.log"
echo "  Report log:    tail -f report.log"
echo "  Frontend log:  tail -f frontend.log"

echo "Press Ctrl+C to stop everything."

# Handle termination
trap "echo 'Stopping servers...'; kill $MAIN_FLASK_PID $CHATBOT_FLASK_PID $REPORT_PID $NPM_PID 2>/dev/null; exit" SIGINT SIGTERM

# Wait for all processes
wait