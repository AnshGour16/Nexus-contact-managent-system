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
*   **Data Isolation**: Every contact is strictly tied to the logged-in user via `userId` associations. Users cannot access or modify contacts they do not own.
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
