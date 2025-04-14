# Chatbot AIUDA Chatbot de Asistencia Médica - Proyecto Fullstack
Este proyecto consiste en una aplicación web para asistencia médica a todo usuario, principalmente para estudiantes UTP.

## 🧠 Arquitectura

### 📁 frontend/
- App React desarrollada con Vite.
- Usa Supabase para autenticación y almacenamiento de registros de usuarios.
- Desplegada en Vercel.

### 📁 backend/
- API con FastAPI.
- Usa pandas para análisis de síntomas.
- Desplegada en Render.
- Uso de base de datos de Kaggle.
- Python

## 🚀 Cómo iniciar el proyecto

### Frontend

```bash

# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>
cd frontend
# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

```

### Backend

```bash
cd backend
```

### Desarrollado con:
- Vite + React + TypeScript
- Supabase (Auth, DB) (PostgreSQL) [API REST] - SUPABASE_URL + SUPABASE_ANON_KEY 
[Realtime REST API] - Row Level Security (RLS) (Para proteger datos por usuario)
- TailwindCSS + shadcn/ui

- FastAPI
- Render
- Python (pandas (para procesar dataset de Kaggle))

