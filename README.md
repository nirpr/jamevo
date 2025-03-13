# 🎸 JaMoveo - Collaborative Music Web App

JaMoveo is a real-time collaborative music web application that allows an admin to select a song with lyrics and chords, and players (musicians and vocalists) to follow along live. The app is optimized for **real-time synchronization**, **multi-device accessibility**, and **responsive design**.

---

## 🌐 Live Demo

- **Frontend:** [https://jamoveo.vercel.app](https://jamoveo.vercel.app)
- **Backend:** Hosted on Railway
- API Base URL: [https://jamoveo-production-7ad2.up.railway.app](https://jamoveo-production-7ad2.up.railway.app)

---

## 🚀 Features

### **Admin Features**

- **Search for songs** and select one for the session.
- **Broadcast lyrics and chords** in real-time to all connected players.
- **Quit session** and return all players to the main menu.

### **Player Features**

- **Join a session** and view selected song lyrics & chords.
- **Auto-scroll feature** for hands-free navigation.
- **Vocals Mode:** Hides chords for vocalists, showing only lyrics.

### **WebSocket Real-Time Updates**

- Uses WebSockets to synchronize song selection and updates across all users.
- Ensures **low latency communication** between the admin and players.

---

## 🛠️ Tech Stack

### **Frontend (React & Vercel)**

- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - API requests
- **WebSockets** - Real-time updates
- **Vercel** - Deployment

### **Backend (FastAPI & Railway)**

- **FastAPI** - API framework
- **Uvicorn** - ASGI server
- **SQLite** - Database
- **Railway** - Deployment
- **CORS Middleware** - API security
- **bcrypt** - Password hashing

---

## 🔗 API Endpoints

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| `POST` | `/signup/`      | User/admin Signup    |
| `POST` | `/login/`       | User Login           |
| `GET`  | `/search/`      | Search Songs         |
| `POST` | `/choose-song/` | Admin selects a song |
| `WS`   | `/ws/`          | WebSocket connection |

---

## 👨‍💻 Author

Developed by **Nir Peretz** as part of the Moveo Coding Task.

