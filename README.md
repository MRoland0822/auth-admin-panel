# Auth + Roles + CRUD Admin Panel

A full-stack application demonstrating authentication, role-based access control, and CRUD operations.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand (TBD)
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Testing:** Jest + React Testing Library

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with Refresh Tokens
- **Validation:** class-validator
- **Testing:** Jest + Supertest

### Infrastructure
- **Containerization:** Docker
- **Version Control:** Git & GitHub
- **Backend Hosting:** Railway
- **Frontend Hosting:** Vercel
- **Database:** Railway PostgreSQL

## ✨ Features

### 🔐 Authentication & Security
- User registration with email validation
- Secure login with JWT tokens
- Access token + refresh token flow
- Automatic token refresh on expiry
- Password hashing with bcrypt (10 rounds)
- Rate limiting (prevents brute force attacks)
- CORS protection

### 👥 User Management
- List all users with pagination (10 per page)
- Create new users with role assignment
- Edit existing users (including password change)
- Delete users with confirmation
- Activate/deactivate user accounts
- Role-based access control (USER, ADMIN)

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Protected routes (authentication required)
- Admin-only sections
- Real-time form validation
- Toast notifications for user feedback
- Loading states and skeleton screens
- Error boundaries
- Active navigation highlighting

### 📊 Audit Logging
- Automatic tracking of all critical actions
- Logs: user creation, updates, deletion, login, logout
- Admin-only access to audit trail
- Filter logs by action type
- Paginated log viewing
- Detailed action information with timestamps

### 🛡️ Additional Features
- Request logging middleware
- Environment variable validation
- Health check endpoint
- Profile edit page
- Password change functionality
- Mobile-responsive design


## 🏗️ Project Structure
```
auth-admin-panel/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── common/            # Shared code (guards, decorators, middleware)
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication module
│   │   │   ├── users/        # User management module
│   │   │   └── audit/        # Audit logging module
│   │   ├── prisma/           # Prisma service
│   │   ├── config/           # Configuration files
│   │   └── main.ts           # Application entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── test/                 # E2E tests
│   └── docker-compose.yml    # PostgreSQL container
│
├── frontend/                  # Next.js Frontend
│   ├── app/                  # App Router pages
│   │   ├── (auth)/          # Public routes (login, register)
│   │   ├── (protected)/     # Protected routes (dashboard)
│   │   └── admin/           # Admin-only routes
│   ├── components/          # React components
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── users/
│   ├── lib/                 # Utilities (API client, stores)
│   └── types/               # TypeScript types
│
├── DEPLOYMENT.md            # Deployment guide
├── TESTING.md               # Testing guide
└── README.md                # This file
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Local Development

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/auth-admin-panel.git
   cd auth-admin-panel
```

2. **Setup Backend**
```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   docker-compose up -d
   npx prisma migrate dev
   npm run start:dev
```

3. **Setup Frontend** (in a new terminal)
```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   npm run dev
```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Prisma Studio: `npm run prisma:studio` (in backend folder)


## 📚 API Documentation

### Authentication Endpoints
```http
POST   /auth/register      # Register new user
POST   /auth/login         # Login
POST   /auth/refresh       # Refresh access token
POST   /auth/logout        # Logout
GET    /auth/me            # Get current user (protected)
```

### User Management (Admin Only)
```http
GET    /users              # List all users (paginated)
GET    /users/:id          # Get user by ID
POST   /users              # Create new user
PATCH  /users/:id          # Update user
DELETE /users/:id          # Delete user
```

### Audit Logs (Admin Only)
```http
GET    /audit-logs         # List audit logs (paginated, filterable)
```

### System
```http
GET    /health             # Health check
GET    /api/info           # API information
```

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Summary:**
- Backend: Deploy to Railway with PostgreSQL
- Frontend: Deploy to Vercel
- Environment variables: Update for production URLs
- Database: Run migrations automatically on Railway


## 📝 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"

# JWT Configuration
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:3000"
ALLOWED_ORIGINS="http://localhost:3000"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## 🧪 Testing
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📚 Learning Resources

This project was built as a learning exercise covering:
- Authentication & Authorization patterns
- RESTful API design
- Database modeling with Prisma
- Modern React patterns (Server Components, Client Components)
- Docker containerization
- Security best practices

## 📸 Screenshots

### Login Page
![Login](docs/screenshots/login.png)
![alt text](image.png)
### Admin Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### User Profile
![Dashboard](docs/screenshots/profile.png)

### User Management
![Users](docs/screenshots/users.png)

### Audit Logs
![Audit](docs/screenshots/audit.png)
