# pokeLab – Pokémon Team Builder
## Video demo at: https://youtu.be/dbJWF16tDQQ

A full-stack web app that lets users explore Pokémon, build and save teams, analyze them, and manage them using a clean interface.

---

## 🛠 Tech Stack

**Frontend** (Vite + React)
- React + JSX components
- CSS Modules / Vanilla CSS
- Vite for fast dev environment

**Backend** (Flask)
- Python Flask API
- SQLAlchemy for database models
- JWT authentication (Flask-JWT-Extended)
- CORS handling for frontend-backend communication

---

## ❓ What is PokeLab? How Do I Use It?

- A Pokémon Team Builder that helps you plan and optimize teams for competitive or casual gameplay
- Enter a username and password to register or log in
- View everyone’s teams on the **Explore** tab and get inspired
- Build your own teams in the **Build** tab by adding Pokémon on the left
- See your saved teams on the right side of the interface

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) + npm
- Python 3.x
- pip

---

## 🚀 Running the App Locally

### 1. Frontend Setup

Open your terminal and run:

```bash
cd frontend
npm install
npm run dev
```
This will start the React app at http://localhost:5173

## 2. Backend Setup

Open another terminal window and run:

```bash
cd backend
pip install -r requirements.txt
python main.py
```
This will start the Flask server on http://localhost:5000
