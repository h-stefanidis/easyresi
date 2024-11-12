# EasyResi

EasyResi is a web application designed to predict the probability of achieving permanent residency through various Australian visas. It provides users with insights based on their specific profiles and visa options.

## Features
- **User Profile**: Input personal and professional information.
- **Visa Options**: Explore different Australian visa pathways.
- **Prediction Model**: Get probability estimates for successful residency outcomes.

## Tech Stack
- **Frontend**: JavaScript, HTML, CSS, ChakraUI
- **Backend**: Python (Flask), PostgreSQL

## Prerequisites
Before proceeding with the installation, ensure you have the following installed on your system:
- **Python** (version 3.x)
- **Node.js** and **npm** (for frontend dependencies)
- **PostgreSQL 17** (Ensure the PostgreSQL server is running)
  
Additionally, you will need to update the `config.py` file in the `backend` directory with your PostgreSQL credentials and database details.

### PostgreSQL Setup
Make sure your PostgreSQL instance is running and create a database for the project. Modify the `config.py` file to include your PostgreSQL connection details:

```python
# config.py
DATABASE = {
    'name': 'your_database_name',
    'user': 'your_username',
    'password': 'your_password',
    'host': 'localhost',
    'port': '5432'
}
```

## Installation

### For Windows

1. Clone the repository:
   ```bash
   git clone https://github.com/chaoskid/easyresi.git
   ```

2. Navigate to the project directory:
   ```bash
   cd easyresi
   ```

3. Run the installation script for Windows:
   ```bash
   install_windows.bat
   ```

This will install all frontend and backend dependencies and perform the necessary migrations.

### For MacOS or Unix-based Systems

1. Clone the repository:
   ```bash
   git clone https://github.com/chaoskid/easyresi.git
   ```

2. Navigate to the project directory:
   ```bash
   cd easyresi
   ```

3. Run the installation script for MacOS or Unix:
   ```bash
   ./install_unix.sh
   ```

This will install all frontend and backend dependencies and perform the necessary migrations.

## Usage

### For Windows

1. Run the application using the following script:
   ```bash
   run_windows.bat
   ```

This will open the backend in a new terminal window and start the frontend in the current terminal.

2. Open your browser at `http://localhost:3000` to interact with the application.

### For MacOS or Unix-based Systems

1. Run the application using the following script:
   ```bash
   ./run_unix.sh
   ```

This will open the backend in a new terminal window and start the frontend in the current terminal.

2. Open your browser at `http://localhost:3000` to interact with the application.

## Notes
- Ensure that your **PostgreSQL server** is running and that the `config.py` file in the backend is correctly configured with your PostgreSQL credentials.
- After running the installation scripts, the project will automatically handle database migration and user setup.