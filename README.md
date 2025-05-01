# ReTask - User Data Management

## 📌 Overview

ReTask is a web application designed to facilitate the management of user data.  It includes user authentication, a credit points system, a feed aggregator, and a user dashboard.  It provides functionalities to view, update, and delete user information, offering a streamlined interface for administrative tasks, user profile management, and social feed interaction.

## 🚀 Live Demo

<https://newretask.web.app/>

## ✨ Features

* **User Authentication**
    * Register/Login with JWT
    * Role-based access (User, Admin)
* **Credit Points System**
    * Earn points for logging in daily, completing profile, and interacting with feed
    * Track credits on the dashboard
    * Admin panel to view/update user credit balances
* **Feed Aggregator**
    * Fetch posts (use at least 2 public APIs from Twitter, Reddit, LinkedIn only)
    * Display them in a scrollable feed
    * Users can:
        * Save content
        * Share content (copy link or simulate)
        * Report inappropriate posts
* **Dashboard**
    * Users see credit stats, saved feeds, and recent activity
* **View User Data**: Retrieve and display user information.
* **Update User Data**: Modify existing user information.
* **Delete User Data**: Remove user records from the system.
* **Admin Access**: Includes an administrative user with the following credentials:
    * Email: `anantabanikofficial@gmail.com`
    * Password: `Ananta00@`

## 🛠️ Installation

To run ReTask locally, follow these steps:

### 1️⃣ Prerequisites

Make sure you have the following installed on your system:

* **Node.js** (version >= 14 recommended)
* **npm** or **yarn** (package managers for Node.js)
* **MongoDB** (Ensure you have a MongoDB instance running locally or have access to a remote instance)

### 2️⃣ Clone the Repository

git clone https://github.com/AnantaBG/TaskJobcd TaskJob
### 3️⃣ Install Client Dependencies

cd clientnpm install
### 4️⃣ Environment Configuration

**Client Configuration (`/client`)**

1.  If using Create React App, create a `.env.local` file in the `/client` directory. For other frameworks, follow their specific convention.
2.  Add the server base URL:

    ```
    REACT_APP_API_BASE_URL=http://localhost:5000
    ```

    \*Adjust the URL if your server is running on a different port or host.\*

### 5️⃣ Run the Application

1.  **Start the client:**

    ```
    cd client
    npm start
    ```

2.  **Access the application:** Open your browser and navigate to `http://localhost:3000` (or the appropriate URL).

## 🔑 Admin User

The application includes a pre-configured administrative user:

* **Email**: `anantabanikofficial@gmail.com`
* **Password**: `Ananta00@`

Use these credentials to log in and access administrative functionalities.

## ⚙️ API Endpoints

(Please provide the API endpoints so I can add them to the README)

## ➕ Contributing

(Please provide contribution guidelines so I can add them to the README)

## 📄 License

(Please provide the license information so I can add it to the README)
