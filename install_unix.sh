#!/bin/bash

# Detect OS
OS="$(uname -s)"

case "${OS}" in
    Linux*) os_type="Linux";;
    Darwin*) os_type="Mac";;
    *) os_type="UNKNOWN";;
esac

echo "Detected OS: $os_type"

# Install dependencies for both frontend and backend
if [ "$os_type" = "Mac" ] || [ "$os_type" = "Linux" ]; then
    # Navigate to the frontend folder and install npm dependencies
    echo "Installing frontend dependencies..."
    cd frontend
    if ! command -v npm &> /dev/null; then
        echo "npm could not be found. Please install Node.js and npm before proceeding."
        exit
    fi
    npm install
    echo "Frontend dependencies installed."

    # Navigate to the backend folder and set up the virtual environment
    echo "Setting up backend dependencies..."
    cd ../backend
    if ! command -v python3 &> /dev/null; then
        echo "Python3 could not be found. Please install Python3 before proceeding."
        exit
    fi
    python3 -m venv env
    source env/bin/activate
    pip install -r requirements.txt
    echo "Backend dependencies installed."

    # Run migration and add users (if necessary for backend setup)
    echo "Running migration and user setup..."
    python migrate.py
    python add_users.py

    echo "Installation completed successfully!"
else
    echo "Unsupported OS: $OS"
    exit 1
fi