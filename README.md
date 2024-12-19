# MSDEVSEC Blog

A full-stack TypeScript blog application with React frontend and Node.js backend.

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Styled Components for styling
- React Router for routing

### Backend
- Node.js with TypeScript
- Express.js for API
- Prisma with PostgreSQL
- Docker for containerization

## Development

1. Clone the repository
2. Install Docker and Docker Compose
3. Run the application:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432

## Project Structure

```
msdevsec-blog/
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── Dockerfile.dev     # Development Docker configuration
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend application
│   ├── src/              # Source files
│   ├── prisma/           # Database schema and migrations
│   ├── Dockerfile.dev    # Development Docker configuration
│   └── package.json      # Backend dependencies
└── docker-compose.yml    # Docker Compose configuration
