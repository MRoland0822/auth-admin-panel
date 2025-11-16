# Auth + Roles + CRUD Admin Panel

A full-stack application demonstrating authentication, role-based access control, and CRUD operations.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand (TBD)

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT with Refresh Tokens

### Infrastructure
- **Containerization:** Docker
- **Version Control:** Git & GitHub

## 📋 Features

- [x] User registration and login
- [x] JWT-based authentication with refresh tokens
- [x] Role-based authorization (Admin, User)
- [x] Protected routes (frontend + backend)
- [x] User CRUD operations (Admin only)
- [x] Audit logging for critical actions
- [x] Rate limiting and security best practices
- [x] Docker development environment

## 🏗️ Project Structure
```
auth-admin-panel/
├── backend/          # NestJS API
├── frontend/         # Next.js application
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/auth-admin-panel.git
cd auth-admin-panel

# Backend setup
cd backend
npm install
cp .env.example .env
docker-compose up -d
npx prisma migrate dev
npm run dev

# Frontend setup (in a new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 📝 Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

### Frontend (.env.local)
```
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

## 📄 License

MIT

## 👤 Author

Your Name - [GitHub](https://github.com/YOUR_USERNAME)