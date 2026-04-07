<div align="center">
  <h1>🧠 Quizzify</h1>

  <p>
    <strong>A comprehensive, full-stack role-based quiz platform designed to help educators easily create quizzes and students securely take them.</strong>
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
    <img alt="NodeJS" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
    <img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>
    <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
    <img alt="JWT" src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/>
  </p>
</div>

<br/>

**Quizzify** is a robust and scalable web application built on the modern MERN stack. It offers dedicated portals for **Educators/Teachers** and **Students**, providing intuitive tools for quiz creation, seamless assessment-taking experiences, and powerful performance analytics using visual charts.

---

## ✨ Key Features

- 🔐 **User Authentication:** Secure registration and secure login workflows leveraging JWT and bcrypt for password hashing.
- 👥 **Role-based Architecture:** Two distinct frontend applications meticulously crafted for **Teachers** and **Students**.
- 📝 **Interactive Quizzes:** Dynamic, seamless, and user-friendly quiz-taking interface for students.
- 📊 **Analytics & Tracking:** Visualized student performance with beautifully interactive charts powered by **Chart.js**.
- 🚀 **Lightning Fast:** Fast and reliable frontend rendering using **React** coupled with the **Vite** build tool.
- 📱 **Responsive Design:** Optimized to deliver smooth functionality and crisp visuals across all screen sizes and devices.

---

## 🛠️ Technology Stack

### Frontends (`frontend-student` & `frontend-teacher`)
- **[React 19](https://react.dev/)** - Modern library for reactive user interfaces.
- **[Vite](https://vitejs.dev/)** - Next-generation fast frontend tooling.
- **[Chart.js](https://www.chartjs.org/)** & `react-chartjs-2` - For generating beautiful data visualizations and analytics.
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client for streamlined API requests.
- **[React Router](https://reactrouter.com/)** - Declarative routing for single-page applications.

### Backend (`backend`)
- **[Node.js](https://nodejs.org/)** - Efficient scalable server runtime.
- **[Express.js](https://expressjs.com/)** - Minimalist and robust web framework for building REST APIs.
- **[MongoDB](https://www.mongodb.com/)** - Flexible NoSQL document database.
- **[Mongoose](https://mongoosejs.com/)** - Elegant MongoDB object modeling for Node.js.
- **[JWT](https://jwt.io/)** (JSON Web Tokens) - Secure stateful data transmission for user sessions.
- **Bcrypt** - Strong cryptographic hash function for securing user passwords.

---

## 📂 Project Structure

The repository utilizes a modular monorepo-style structure, clearly separating concerns between the backend server and the two distinct frontend clients:

```text
📦 Quizzify
 ┣ 📂 backend/              # Express REST API, Mongoose models, authentication logic
 ┣ 📂 frontend-student/     # React/Vite application tailored for students
 ┣ 📂 frontend-teacher/     # React/Vite application tailored for educators/teachers
 ┗ 📜 README.md             # Project documentation (You are here!)
```

---

## 🚀 Getting Started

Follow these detailed instructions to get a copy of the project up and running smoothly on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed on your system before beginning:
- **Node.js** (v18 or higher recommended)
- **npm** (Node Package Manager - comes with Node.js)
- **MongoDB** (A local instance running or a cloud cluster URL like MongoDB Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/jlakkineni25/Quizzify.git
cd Quizzify
```

### 2. Backend Setup

Launch your backend API server.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install necessary dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a new file named `.env` in the `backend/` root folder and populate it with your configuration:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the development server:
   ```bash
   npm start
   # Using nodemon, the server should spin up and watch for changes on http://localhost:5000
   ```

### 3. Frontend App Setup

You will need to open **two new separate terminal windows** to run both the Student and Teacher frontend applications concurrently.

#### Running the Student Portal

1. From the project root, navigate into the student frontend directory:
   ```bash
   cd frontend-student
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   # The application will typically be accessible at http://localhost:5173
   ```

#### Running the Teacher Portal

1. From the project root, open a new terminal and navigate into the teacher frontend directory:
   ```bash
   cd frontend-teacher
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   # The application will typically be accessible at an available port like http://localhost:5174
   ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are very welcome!

If you want to contribute, feel free to check the [issues page](https://github.com/jlakkineni25/Quizzify/issues). Let's build something great together.

---

<div align="center">
  <sub>Built with ❤️</sub>
</div>
