# Task Management System

A full-stack Task Tracker web app with authentication, task CRUD, filtering/search, and basic analytics.

**Stack:** React (frontend) · Node.js + Express (backend) · MongoDB (database) · JWT auth

## Project Structure

```
Task_management_system/
├── backend/     Express API server
└── frontend/    React client (Vite)
```

## Setup Steps

### Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # starts on http://localhost:5173
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Create a new account | No |
| POST | `/login` | Log in, returns JWT | No |
| GET | `/me` | Get current user | Yes |

### Tasks (`/api/tasks`) — all require `Authorization: Bearer <token>`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List tasks — supports `status`, `priority`, `search`, `sortBy` (`dueDate`\|`priority`\|`createdAt`\|`title`), `order` (`asc`\|`desc`), `page`, `limit` |
| GET | `/:id` | Get a single task |
| POST | `/` | Create a task |
| PUT | `/:id` | Update a task |
| PATCH | `/:id/complete` | Mark a task as Done |
| DELETE | `/:id` | Delete a task |
| GET | `/analytics/summary` | Total / completed / pending counts + completion percentage |

## Design Decisions

- **JWT auth**, stateless, stored client-side; `protect` middleware verifies the token and attaches `req.user` on every task route.
- **Ownership scoping**: every task query is filtered by `user: req.user._id`, so users can only ever see/modify their own tasks — enforced at the query level, not just the UI.
- **Compound MongoDB indexes** on `(user, status)`, `(user, priority)`, `(user, dueDate)` and a text index on `title` to keep the common filter/sort/search queries fast as data grows.
- **Priority sorting** uses an in-memory rank map (`High > Medium > Low`) since MongoDB has no native ordering for arbitrary enum strings.
- **Global error middleware** (`errorHandler.js`) normalizes Mongoose cast/validation/duplicate-key errors into consistent JSON error responses; all controllers use an `asyncHandler` wrapper so thrown errors are forwarded automatically instead of needing try/catch everywhere.
- **Pagination** capped at 100 items/page server-side to prevent abuse via `limit`.

## License

For assignment/demo purposes.
