# Healthcare Management System

A full-stack web application for managing patients, doctors, and appointments in a healthcare environment.

## Table of Contents
- [Docker Setup](#docker-setup)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 🐳 Docker Setup (RECOMMENDED)

### How Docker Works in This Project

Docker allows you to run the entire application in isolated containers without installing Node.js or any dependencies on your machine.

**Architecture:**

```
┌─────────────────────────────────────────┐
│         Nginx (Port 80)                 │
│      Reverse Proxy / Load Balancer     │
└──────────┬──────────────────┬───────────┘
           │                  │
    ┌──────▼──────┐    ┌─────▼──────┐
    │  Frontend   │    │  Backend   │
    │  (Port 5173)│    │ (Port 3000)│
    │   React +   │    │  Express   │
    │   Vite      │    │  Node.js   │
    └─────────────┘    └────────────┘
          
```

**Three containers:**
1. **nginx**: Reverse proxy on port 80 (entry point)
2. **frontend**: React app 
3. **backend**: Express API server

**Why Nginx?**
- Solves CORS issues by serving everything from same origin
- Routes `/` to frontend
- Routes `/api/*` to backend
- Production-ready setup

### Prerequisites

- Docker 20.x or higher
- Docker Compose 2.x or higher

### Installation

```bash
# Check Docker installation
docker --version
docker compose --version

# If not installed, visit: https://docs.docker.com/get-docker/
```

### Running with Docker

#### Production Mode

```bash
# 1. Make sure you're in the project root directory
cd healthcare-management-system

# 2. Start all services
docker-compose up -d

# 3. View logs (optional)
docker-compose logs -f

# 4. Access the application
# Open browser: http://localhost
```

---

## 🚀 Backend Setup

### How the Backend Works

The backend is a **Node.js Express** server that provides a REST API for managing healthcare data. It uses **in-memory storage** (no database required), which means:

- Data is stored in JavaScript arrays/objects
- Data persists only while the server is running

**Key Features:**
- RESTful API endpoints for CRUD operations
- JSON request/response format
- No authentication required 

### Prerequisites

- Node.js 20.x or higher
- npm 

### Installation & Running

```bash
# 1. Navigate to the backend directory
cd server

# 2. Install dependencies
npm install

# 3. Start the development server
npm run start

# The server will start on http://localhost:3000
```

### Testing the Backend

open in browser:
- http://localhost:3000/patients
- http://localhost:3000/doctors
- http://localhost:3000/appointments

---

## 💻 Frontend Setup

### How the Frontend Works

The frontend is a **React Single Page Application (SPA)** built with Vite. It provides a modern, responsive UI for managing healthcare data.

**Key Features:**
- React 20 with hooks (useState, useEffect, useMemo)
- React Query for data fetching and caching
- RSuite component library for UI
- Custom routing implementation
- Real-time search and pagination

**Architecture:**
```
User Interface (RSuite Components)
        ↓
React Components (Pages & Modals)
        ↓
Custom Hooks (usePatients, useDoctors, useAppointments)
        ↓
API Layer (HTTP requests)
        ↓
Backend API
```

### Prerequisites

- Node.js 20.x or higher
- npm 
- Backend server running on http://localhost:3000

### Installation & Running

```bash
# 1. Navigate to the frontend directory
cd client/healthcare

# 2. Install dependencies
npm install

# 3. Create environment file
export VITE_API_URL=/api # for development

# 4. Start the development server
npm run dev

# The app will open at http://localhost:5173
```

---

### Vite Configuration

The `vite.config.js` includes a proxy to avoid CORS issues in development:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

**How the proxy works:**
- Frontend calls `/api/patients`
- Vite intercepts and removes `/api` prefix
- Forwards to `http://localhost:3000/patients`
- No CORS errors!

---

## Features

### Patient Management
- ✅ View, create, edit, and delete patient records
- ✅ Track patient medical history
- ✅ Search patients by name
- ✅ Pagination support

### Doctor Management
- ✅ View, create, edit, and delete doctor profiles
- ✅ Track doctor specialties and biographies
- ✅ View doctor's appointments
- ✅ Search doctors by name or specialty

### Appointment Management
- ✅ Create, view, edit, and delete appointments
- ✅ Link appointments to patients and doctors
- ✅ Filter appointments by patient or doctor
- ✅ Search appointments
- ✅ Pagination support

### Navigation
- ✅ Multi-page application with routing
- ✅ URL-based navigation with query parameters
- ✅ Browser back/forward support

---

## Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Data Storage**: In-memory (no database required)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: @tanstack/react-query
- **UI Library**: RSuite
- **Styling**: Custom CSS

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx (for Docker deployment)

---

## 📁 Project Structure

```
healthcare-management-system/
├── server/                          # Backend application
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   ├── Dockerfile                   # Production Docker image
│   └── .dockerignore                # Docker ignore file
│
├── client/
│   └── healthcare/                  # Frontend application
│       ├── src/                     # React source code
│       │   ├── App.jsx              # Main React component
│       │   ├── main.jsx             # React entry point
│       │   └── ...
│       ├── public/                  # Static assets
│       ├── index.html               # HTML template
│       ├── package.json             # Frontend dependencies
│       ├── vite.config.js           # Vite configuration
│       ├── Dockerfile               # Production Docker image
│       └── .dockerignore            # Docker ignore file
│
├── docker-compose.yaml              # Production Docker setup
├── nginx.conf                       # Nginx reverse proxy config
└── README.md                        # This file
```


---

## 📚 API Documentation

### Base URL
- **Local Development**: `http://localhost:3000`
- **Docker**: `http://localhost/api`

### Patients Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/patients` | Get all patients | - |
| GET | `/patients/:id` | Get patient by ID | - |
| POST | `/patients` | Create new patient | `{ name, age, gender, medicalHistory }` |
| PUT | `/patients/:id` | Update patient | `{ name, age, gender, medicalHistory }` |
| DELETE | `/patients/:id` | Delete patient | - |

### Doctors Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/doctors` | Get all doctors | - |
| GET | `/doctors/:id` | Get doctor by ID | - |
| POST | `/doctors` | Create new doctor | `{ name, specialty, bio }` |
| PUT | `/doctors/:id` | Update doctor | `{ name, specialty, bio }` |
| DELETE | `/doctors/:id` | Delete doctor | - |

### Appointments Endpoints

| Method | Endpoint | Description | Query Params | Request Body |
|--------|----------|-------------|--------------|--------------|
| GET | `/appointments` | Get all appointments | `?patientId=X` or `?doctorId=Y` | - |
| GET | `/appointments/:id` | Get appointment by ID | - | - |
| POST | `/appointments` | Create new appointment | - | `{ patientId, doctorId, dateTime, reason }` |
| PUT | `/appointments/:id` | Update appointment | - | `{ patientId, doctorId, dateTime, reason }` |
| DELETE | `/appointments/:id` | Delete appointment | - | - |
