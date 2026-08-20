# Task Management System

A full-stack Task Tracker web app with authentication, task CRUD, filtering/search, and basic analytics.

**Stack:** React (frontend) · Node.js + Express (backend) · MongoDB (database) · JWT auth

**Live:** [frontend-five-dusky-49.vercel.app](https://frontend-five-dusky-49.vercel.app) · API: [backend-eight-pi-njbsk4ld74.vercel.app/api](https://backend-eight-pi-njbsk4ld74.vercel.app/api)

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
cp .env.example .env   # then fill in MONGO_URI, JWT_SECRET, and EMAIL_USER/EMAIL_PASS (Gmail App Password, for forgot-password emails)
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
| POST | `/forgot-password` | Send a password reset link to the given email | No |
| POST | `/reset-password/:token` | Set a new password using the token from the reset email | No |

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

### Admin (`/api/admin`) — all require `Authorization: Bearer <token>` **and** an `admin` role
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | System-wide totals: users, tasks, completed, pending |
| GET | `/users` | List every user with their task count |
| GET | `/tasks` | List every user's tasks (paginated), with owner name/email populated |

## Design Decisions

- **JWT auth**, stateless, stored client-side; `protect` middleware verifies the token and attaches `req.user` on every task route.
- **Ownership scoping**: every task query is filtered by `user: req.user._id`, so users can only ever see/modify their own tasks — enforced at the query level, not just the UI.
- **Compound MongoDB indexes** on `(user, status)`, `(user, priority)`, `(user, dueDate)` and a text index on `title` to keep the common filter/sort/search queries fast as data grows.
- **Priority sorting** uses an in-memory rank map (`High > Medium > Low`) since MongoDB has no native ordering for arbitrary enum strings.
- **Global error middleware** (`errorHandler.js`) normalizes Mongoose cast/validation/duplicate-key errors into consistent JSON error responses; all controllers use an `asyncHandler` wrapper so thrown errors are forwarded automatically instead of needing try/catch everywhere.
- **Pagination** capped at 100 items/page server-side to prevent abuse via `limit`.
- **Analytics charts**: status breakdown uses a horizontal stacked bar (not a pie/donut) since it reads proportions more precisely at a glance; priority uses a single-hue amber ramp (light→dark = Low→High) since priority is an ordered scale, not arbitrary categories. Both are hand-built SVG/HTML (no charting library) with hover tooltips, a legend, and direct value labels so identity never depends on color alone.
- **Password reset** uses a random token, stored server-side only as a SHA-256 hash with a 30-minute expiry (mirrors how sessions typically store hashed secrets, so a DB leak alone can't be used to reset accounts). The forgot-password endpoint always returns the same generic message whether or not the email exists, to avoid leaking which emails are registered. Reset emails are sent via Gmail SMTP (nodemailer).
- **Role-based access**: `User.role` (`user` | `admin`) is never settable from the client — `register` always creates `role: 'user'`, so promotion to admin only happens directly in the database. Admin routes are enforced server-side via a `restrictTo('admin')` middleware (403 for non-admins), not just hidden in the UI; the frontend's `AdminRoute` wrapper is a UX convenience on top of that, not the actual security boundary.

## License

For assignment/demo purposes.
