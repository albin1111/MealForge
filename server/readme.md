# Flask Server for MealForge

This is the backend server built with Flask for a React Native application. The server handles user authentication, token management, and database interactions.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Server](#running-the-server)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [License](#license)

### Features

- User Signup and Login
- JWT Authentication with Access and Refresh Tokens
- Secure handling of user data
- Database interactions using SQLAlchemy
- CORS support for secure cross-origin requests

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**
- **pip** (Python package installer)
- **Git** (optional, for cloning the repository)
- **Database** (MySQL)

### Setup Instructions

1. Clone the project

   ```bash
   git clone https://github.com/Aeceu/MealForge.git
   ```

2. Go to the project directory

   ```bash
   cd MealForge
   ```

3. Set Up a Virtual Environment

   ```bash
   python -m venv .venv
   ```

4. Activate the virtual environment

   ```bash
source .venv/Scripts/activate
   ```

5. Install Dependencies
   ```bash
   pip install -r requirements.txt
   pip install joblib
   pip install pandas
   pip install scikit-learn
   ```

### Environment Variables

Create a `.env` file in the root directory of the project. Use the `.env.example` file as a template.

### Running the Server

To run the Flask development server, use the following command:

```bash
py src/app.py
python app.py
```

cd server
npx expo start
cd client

npx expo start

mysql -h 127.0.0.1 -P 3306 -u root -p