@echo off
SETLOCAL

echo "Detected Windows environment"

:: Start backend in a new Command Prompt window
echo "Starting backend in a new terminal..."
start cmd /k "cd backend && env\Scripts\activate && python app.py"

:: Start frontend in the current window
echo "Starting frontend..."
cd frontend
npm run start

ENDLOCAL