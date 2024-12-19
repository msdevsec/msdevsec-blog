# MSDEVSEC Blog Backend

A TypeScript-based backend for the MSDEVSEC blog platform, featuring secure authentication, role-based access control, and content management.

## Security Features

- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Password hashing with bcrypt
- Input validation and sanitization
- Protected admin routes
- Secure admin creation (database-only)
- Request rate limiting (TODO for production)

## Admin Account Creation

For security reasons, admin account creation is disabled through the API. Instead, follow these steps to create an admin account:

1. Start the services:
```bash
docker-compose up -d
```

2. Generate a password hash:
```bash
docker-compose exec backend node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_ADMIN_PASSWORD', 10).then(hash => console.log(hash));"

# Example:
docker-compose exec backend node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin123456', 10).then(hash => console.log(hash));"
# Output: $2a$10$2G6IgUGEXfFyGX6.ENbxQ.wuP2ceG2fOliU0BeDgrA9hgKeajGqlq
```

3. Open Prisma Studio:
```bash
docker-compose exec backend npx prisma studio
```

4. Create admin user in Prisma Studio (http://localhost:5555):
   - Click on "User" model
   - Click "Add record"
   - Fill in the fields:
     * email: admin@msdevsec.com
     * firstName: MSDEVSEC
     * lastName: (leave empty)
     * password: (paste the hashed password from step 2)
     * role: "ADMIN"
     * isPremium: false
     * createdAt and updatedAt will be auto-filled

5. Verify admin login:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@msdevsec.com",
    "password": "Admin123456"
  }'
```

## API Documentation

### Authentication Endpoints

```bash
POST /api/auth/register
# Register new user (admin registration disabled)
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}

POST /api/auth/login
# Login user
{
  "email": "string",
  "password": "string"
}
```

### Posts Endpoints

```bash
# Public Routes
GET /api/posts
# Get all published posts
Query params:
- category: "CODE_TUTORIAL" | "PENTESTING"

GET /api/posts/:identifier
# Get single post by ID or slug
# Public users: only published posts
# Admin: all posts

# Admin Only Routes (requires admin token)
POST /api/posts
# Create new post
{
  "title": "string",
  "content": "string",
  "category": "CODE_TUTORIAL" | "PENTESTING",
  "published": boolean,
  "excerpt": "string" (optional)
}

PUT /api/posts/:id
# Update post
{
  "title": "string" (optional),
  "content": "string" (optional),
  "category": "CODE_TUTORIAL" | "PENTESTING" (optional),
  "published": boolean (optional),
  "excerpt": "string" (optional)
}

DELETE /api/posts/:id
# Delete post and its comments

PATCH /api/posts/:id/toggle-visibility
# Toggle post published status (hide/show)
```

### Comments Endpoints

```bash
# User Routes (requires auth)
POST /api/comments
# Create comment on published post
{
  "postId": "string",
  "content": "string"
}

# Admin Only Routes
GET /api/comments/all
# Get all comments

PUT /api/comments/:id
# Update comment
{
  "content": "string"
}

DELETE /api/comments/:id
# Delete comment
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@db:5432/msdevsec_blog"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
PORT=4000
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

## Docker Setup

1. Build and start services:
```bash
docker-compose up --build
```

2. Run migrations in container:
```bash
docker-compose exec backend npx prisma migrate dev
```

## Security Considerations for Production

For a production environment, consider implementing:
- Rate limiting
- CORS configuration
- HTTPS
- Environment-specific JWT secrets
- Database connection pooling
- Input validation timeouts
- Request size limits
- Security headers
- API documentation (Swagger/OpenAPI)
- Logging and monitoring
- Error tracking
- Database backups
- CI/CD pipeline

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma     # Database schema
├── src/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth & validation middleware
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities
│   ├── validators/      # Input validation
│   └── index.ts         # Entry point
├── .env                 # Environment variables
└── docker-compose.yml   # Docker configuration
