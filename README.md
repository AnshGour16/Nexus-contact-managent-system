# Nexus Contacts - Premium Contact Management System

Welcome to the **Nexus Contacts** platform. This project has been significantly upgraded from a basic contact manager into a highly featured, visually stunning application built on the **MERN** stack (MongoDB, Express, React, Node.js). 

## 🌟 Key Features

### Premium UI/UX Design
*   **Aesthetic Theme**: Features a sophisticated "Soft Frost & Pearl" light theme with subtle gradients.
*   **True Glassmorphism**: High-end frosted glass cards (`backdrop-filter`) provide depth and elegance.
*   **Interactive Elements**: Floating animations on hover, neo-morphic shadows, animated gradient text headers, and premium styled input components.
*   **Responsive**: Full mobile responsiveness for seamless interaction on desktop or phone.

### Robust Backend & Security
*   **JWT Authentication**: Secure user registration and login using JSON Web Tokens (JWT) and Bcrypt hashing.
*   **Dynamic Password Strength**: Real-time password strength validation enforcing strict minimum requirements for security.
*   **Data Isolation**: Every contact is strictly tied# Nexus Contact Management System

A full-stack Contact Management application allowing users to securely register, login, and manage their professional network dynamically.

![Nexus Contacts](https://via.placeholder.com/800x400?text=Nexus+Contacts+Management+System)

## 🚀 Live Demo
- **Frontend** (Vercel): [https://nexus-contact-managemnt-system.vercel.app](https://nexus-contact-managemnt-system.vercel.app)
- **Backend** (Render API): [https://nexus-contact-managent-system.onrender.com](https://nexus-contact-managent-system.onrender.com)

## ✨ Features
- **Secure Authentication:** JWT-based user registration and login with encrypted passwords.
- **Full CRUD Operations:** Add, read, update, and securely delete contacts.
- **Dynamic Search:** Filter contacts in real time by name or phone number.
- **Smart Validation:** Frontend and backend validation for required fields, email formatting, and numeric phone inputs.
- **Password Strength:** Real-time visual password strength meter during registration.
- **Responsive UI:** Modern, responsive design built with React.

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Axios, Custom CSS
- **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens, bcryptjs
- **Database:** MongoDB
- **Hosting:** Vercel (Client) & Render (Server)

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnshGour16/Nexus-contact-managent-system.git
   cd Nexus-contact-managent-system
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MONGO_URI, PORT (5000), and JWT_SECRET
   npm start
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   # (Optional) Create a .env file to set VITE_API_URL if your backend is NOT running on port 5000
   npm run dev
   ```

## 🚀 Deployment Guide
This project is configured natively for serverless and standard hosting.

### Backend (Render)
Make sure to configure the Web Service with the `server` root directory, and set your environment variables (`MONGO_URI` and `JWT_SECRET`).

### Frontend (Vercel)
Deploy as a standard Vite project using the `client` root directory. Ensure you set the `VITE_API_URL` environment variable (e.g. `https://nexus-contact-managent-system.onrender.com`) **before** deploying so Vite can embed the URL during build time.gged-in user via `userId` associations. Users cannot access or modify contacts they do not own.
*   **REST API**: Clean external API routes verified by an Express backend.

## 🛠️ Technology Stack
*   **Frontend**: React (Vite.js), Tailwind CSS basics, Custom Advanced CSS, Axios.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ORM).
*   **Security**: bcryptjs, jsonwebtoken, express-validator.

---

## 🚀 How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
You will need a MongoDB URI connection string.

### 1. Backend Setup

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. The `.env` file should be located in the `server` folder and look like this:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Open a **second terminal window** and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React/Vite development server:
   ```bash
   npm run dev
   ```

### 3. Usage
Navigate to `http://localhost:5173` in your browser. 
Register a new account (ensure your password meets the strength requirements), and start managing your professional network!
