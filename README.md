# 🚀 TaskFlow - MERN Stack Task Management Application

A modern full-stack Task Management Application built using the MERN Stack with secure authentication, advanced task management features, clean architecture, and responsive UI.

Designed with scalability, maintainability, and real-world development practices in mind.

---

## 📌 Overview

TaskFlow helps users organize, prioritize, and track tasks efficiently through an intuitive dashboard.

The application provides secure user authentication, protected routes, task categorization, filtering, sorting, and real-time state management.

---

## ✨ Features

### 🔐 Authentication & Security

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* Password Hashing using bcryptjs
* Authentication Middleware
* Session Persistence
* Automatic Logout Support
* Secure API Access

---

### 📋 Task Management

* Create Tasks
* Read Tasks
* Update Tasks
* Delete Tasks
* Toggle Task Status
* Set Task Priority

  * Low
  * Medium
  * High
* Due Date Management
* Task Completion Tracking

---

### 🔍 Search, Filter & Sort

* Search Tasks by Title
* Search Tasks by Description
* Filter by Status

  * All
  * Pending
  * Completed
* Sort by:

  * Most Recent
  * Oldest
  * Priority
  * Due Date

---

### 📊 Dashboard Analytics

* Total Tasks
* Completed Tasks
* Pending Tasks
* High Priority Tasks

---

### 🎨 User Experience

* Fully Responsive Design
* Mobile Friendly Layout
* Modern UI Design
* Clean User Feedback
* Error Notifications
* Loading Indicators
* Smooth User Interactions

---

## 🏗️ Architecture

The backend follows a modular MVC-inspired architecture.

```text
backend/
│
├── src/
│   ├── app.js
│   ├── server.js
│
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│
│   ├── models/
│   │   ├── user.model.js
│   │   └── task.model.js
│
│   ├── routes/
│   │   ├── auth.route.js
│   │   └── task.route.js
│
│   ├── middleware/
│   │   └── auth.middleware.js
│
│   ├── DB/
│   │   └── db.js
│
│   └── utils/
│       ├── ApiError.js
│       ├── ApiResponse.js
│       └── asyncHandler.js
```

---

## ⚙️ Tech Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Zustand
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* dotenv
* cookie-parser
* cors

---

## 🗄️ Database Models

### User Model

```javascript
{
    name: String,
    email: String,
    password: String
}
```

### Task Model

```javascript
{
    title: String,
    description: String,
    status: String,
    priority: String,
    dueDate: Date,
    userId: ObjectId
}
```

---

## 🔑 Authentication Flow

1. User Registers
2. Password gets Hashed
3. User Logs In
4. Access Token Generated
5. Token Stored on Client
6. Protected APIs verified using Middleware
7. User-specific Tasks returned

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register User    |
| POST   | /api/auth/login    | Login User       |
| GET    | /api/auth/me       | Get Current User |

---

### Tasks

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| GET    | /api/tasks            | Get All Tasks   |
| GET    | /api/tasks/:id        | Get Single Task |
| POST   | /api/tasks            | Create Task     |
| PUT    | /api/tasks/:id        | Update Task     |
| DELETE | /api/tasks/:id        | Delete Task     |
| PATCH  | /api/tasks/:id/toggle | Toggle Status   |

---

## 📂 Environment Variables

Create a `.env` file inside backend:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_secret_key

ACCESS_TOKEN_EXPIRY=1d

NODE_ENV=development
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/taskflow.git

cd taskflow
```

---

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🌐 Application URLs

Frontend

```bash
http://localhost:5173
```

Backend

```bash
http://localhost:5000
```

Health Check

```bash
http://localhost:5000/health
```

---

## 📈 Future Enhancements

* Task Categories
* Task Labels
* File Attachments
* Team Collaboration
* Dark Mode
* Email Notifications
* Reminder System
* Activity Logs
* Analytics Dashboard
* Drag & Drop Tasks
* Kanban Board View

---

## 👨‍💻 Developer

**Digvijay Tripathy**

B.Tech CSE Student

National Institute of Technology (NIT), Bhubaneswar

---

## ⭐ Project Highlights

✔ JWT Authentication

✔ Secure Password Hashing

✔ Zustand State Management

✔ Axios Interceptors

✔ Protected Routes

✔ Custom Error Handling

✔ Modular Backend Architecture

✔ Responsive UI

✔ CRUD Operations

✔ Production-Ready Structure

---

### If you found this project helpful, consider giving it a ⭐ on GitHub.
