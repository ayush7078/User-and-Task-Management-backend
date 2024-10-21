# User Task Manager API

This is a RESTful API for managing users and their tasks, including user registration, login (JWT authentication), task management (CRUD), and optional role-based access control for admin and user roles. The application is built using Node.js, Express.js, and JWT for secure authentication.
## Setup

1. Clone the repository:

git clone https://github.com/ayush7078/User-and-Task-Management-backend.git 
cd user-task-manager


2. Install dependencies:
npm install


3. Run the server:
npm start

## API Endpoints

### Authentication

- **POST /users/register**: Register a new user.
- **POST /users/login**: Log in and receive a JWT token.

### Users (Admin only)

- **GET /users**: Get all users.
- **GET /users/:id**: Get a user by ID.

### Tasks

- **GET /tasks**: Get all tasks for the authenticated user.
- **GET /tasks/:id**: Get a task by ID for the authenticated user.
- **POST /tasks**: Create a new task.
- **PUT /tasks/:id**: Update a task.
- **DELETE /tasks/:id**: Delete a task.