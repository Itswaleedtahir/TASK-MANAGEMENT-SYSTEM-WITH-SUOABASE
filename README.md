# Task Management System API

A robust task management system built with Node.js, Express, and Supabase.

## Features

- User authentication with Supabase Auth
- CRUD operations for tasks and categories
- Task assignment and status management
- Analytics and reporting
- Daily digest emails (simulated)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks

- `GET /api/tasks` - List all tasks (with filters)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/assign` - Assign task to user

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Analytics

- `GET /api/analytics/stats` - Get task statistics
- `GET /api/analytics/overdue` - List overdue tasks
- `GET /api/analytics/trends` - Get task completion trends

## Database Schema

### Users
- id (UUID, primary key)
- email (string)
- created_at (timestamp)

### Categories
- id (UUID, primary key)
- name (string)
- user_id (UUID, foreign key)
- created_at (timestamp)

### Tasks
- id (UUID, primary key)
- title (string)
- description (text)
- due_date (timestamp)
- status (enum: pending, in_progress, completed, overdue)
- priority (enum: low, medium, high)
- category_id (UUID, foreign key)
- user_id (UUID, foreign key)
- assigned_to (UUID, foreign key, nullable)
- created_by (UUID, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Error Handling

The API uses a consistent error handling approach:
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Scheduled Jobs

- Daily Digest: Runs at 9 AM every day
  - Lists overdue tasks
  - Shows today's tasks
  - Displays completion statistics

## Security

- JWT-based authentication
- Role-based access control
- Input validation using Joi
- CORS enabled
- Secure password handling through Supabase Auth

## Testing

To run tests:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 