# Full-Stack User Manager

This repository contains a full-stack web application designed for managing a list of users. It demonstrates the integration of a **Node.js/Express REST API** connected to a **MySQL** database on the backend, alongside a beautifully designed vanilla **HTML/CSS/JS** frontend.

## 🚀 Features

- **Backend (REST API)**: Built with Node.js and Express. Handles Create, Read, Update, and Delete (CRUD) operations.
- **MySQL Database Integration**: Uses `mysql2` with connection pooling. The database and tables are generated automatically on startup!
- **Premium Frontend UI**: A responsive, dark-mode layout featuring modern glassmorphism design, vibrant gradients, custom typography (Outfit), and micro-animations.
- **Asynchronous Fetching**: The vanilla JavaScript frontend seamlessly communicates with the backend using the `fetch` API.

---

## 📂 Project Structure

```text
CodVeda_L1_T2/
├── Backend/
│   ├── index.js          # Express server and CRUD API routes
│   ├── database.js       # MySQL connection pool and auto-initialization
│   ├── .env              # Environment variables (MySQL credentials)
│   ├── package.json      # Node dependencies
│   └── README.md         # API-specific documentation
└── Frontend/
    ├── index.html        # Main application layout
    ├── style.css         # UI styling (Glassmorphism, animations)
    └── script.js         # API integration (fetching, adding, deleting users)
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A running **MySQL** server (e.g., XAMPP, Docker, or standalone MySQL).

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables:
   - Open the `.env` file located in the `Backend` folder.
   - Update `DB_HOST`, `DB_USER`, and `DB_PASSWORD` to match your local MySQL credentials. (The database `DB_NAME` will be created automatically).

4. Start the backend server:
   ```bash
   npm start
   ```
   > **Note:** Upon starting, the server will automatically connect to MySQL, create the `code_veda` database if it doesn't exist, and prepare the `users` table. It will run on `http://localhost:3000`.

### 2. Frontend Setup

The frontend requires no build steps or dependencies. 
1. Open the `Frontend` folder.
2. Double-click `index.html` to open it in any modern web browser.
   - Alternatively, you can serve it using a local development server like VS Code's "Live Server" extension.
3. You can now interact with the UI to view, add, and delete users dynamically!

---

## 🔌 API Endpoints Reference

If you want to test the API directly (e.g., using Postman or Thunder Client), here are the available endpoints running on `http://localhost:3000`:

| Method | Endpoint       | Description                 | JSON Request Body            |
|--------|----------------|-----------------------------|------------------------------|
| `GET`  | `/users`       | Get all users               | *None*                       |
| `GET`  | `/users/:id`   | Get a specific user by ID   | *None*                       |
| `POST` | `/users`       | Create a new user           | `{"name": "...", "email": "..."}` |
| `PUT`  | `/users/:id`   | Update a user by ID         | `{"name": "...", "email": "..."}` |
| `DELETE`| `/users/:id`  | Delete a user by ID         | *None*                       |
