# MSDEVSEC Blog

A modern, secure blog platform built with TypeScript, React, and Node.js. Features a robust backend with role-based access control, secure admin management, and a clean API design. Includes Docker containerization for easy development and deployment.

## Security Features

- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Password hashing with bcrypt
- Input validation and sanitization
- Protected admin routes
- Secure admin creation (database-only)
- Request rate limiting (TODO for production)

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/msdevsec/msdevsec-blog.git
cd msdevsec-blog
```

2. Start the services:
```bash
docker-compose up -d
```

## Admin Account Creation

For security reasons, admin account creation is **disabled through the API**. Instead, follow these steps to create an admin account:

1. Generate a password hash:
```bash
docker-compose exec backend node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_ADMIN_PASSWORD', 10).then(hash => console.log(hash));"

# Example:
docker-compose exec backend node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin123456', 10).then(hash => console.log(hash));"
# Output: $2a$10$2G6IgUGEXfFyGX6.ENbxQ.wuP2ceG2fOliU0BeDgrA9hgKeajGqlq
```

2. Open Prisma Studio:
```bash
docker-compose exec backend npx prisma studio
```

3. Create admin user in Prisma Studio (http://localhost:5555):
   - Click on "User" model
   - Click "Add record"
   - Fill in the fields:
     * email: admin@msdevsec.com
     * firstName: MSDEVSEC
     * lastName: (leave empty)
     * password: (paste the hashed password from step 1)
     * role: "ADMIN"
     * isPremium: false
     * createdAt and updatedAt will be auto-filled

4. Verify admin login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@msdevsec.com",
    "password": "Admin123456"
  }'
```

## Features

- **Admin Dashboard**
  - Create and manage blog posts
  - Moderate comments
  - Toggle post visibility
  - User management

- **Blog Posts**
  - Code tutorials
  - Pentesting walkthroughs
  - Rich text content
  - Comments system

- **User System**
  - Secure authentication
  - Comment on posts
  - Premium content access (TODO)

## Tech Stack

- **Frontend**
  - React with TypeScript
  - Vite for fast development
  - Modern UI components

- **Backend**
  - Node.js with Express
  - TypeScript for type safety
  - Prisma ORM
  - PostgreSQL database

- **DevOps**
  - Docker containerization
  - Docker Compose for local development

## Development

See [Backend README](backend/README.md) for detailed API documentation and development setup.

## License

MIT
