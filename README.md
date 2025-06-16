# Home Library Service

A NestJS-based REST API service for managing a home music library with users, artists, albums, tracks, and favorites.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/zenitfan19/nodejs2025Q2-service
cd nodejs2025Q2-service
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following configuration:

```env
# Server Configuration
PORT=4000

# Database Configuration (for Docker setup)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
DB_HOST=postgres
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_ACCESS_TOKEN_EXPIRE_TIME=1h
JWT_REFRESH_TOKEN_EXPIRE_TIME=24h

# Logging Configuration
LOG_LEVEL=INFO
LOG_TO_FILE=true
LOG_DIRECTORY=./logs
LOG_MAX_FILE_SIZE_KB=1024
```

### 4. Running with Docker/Podman (Recommended)

#### Prerequisites

- Docker or Podman - [Download & Install Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/getting-started/installation)
- Docker Compose or Podman Compose

#### Start the Application

```bash
# Using Docker
docker-compose up --build -d

# Using Podman
podman compose up --build -d

# Alternative: Using npm scripts
npm run docker:dev     # Development mode with hot reload
npm run docker:prod    # Production mode
```

#### Verify containers are running

```bash
# Docker
docker ps

# Podman
podman compose ps
```

You should see:

- `home-library-app` - The NestJS application (port 4000)
- `home-library-postgres` - PostgreSQL database (port 5432)

#### Stop the application

```bash
# Docker
docker-compose down

# Podman
podman compose down

# Alternative: Using npm scripts
npm run docker:down
```

### 5. Access the Application

Once the containers are running, you can access:

- **API**: http://localhost:4000
- **Swagger UI Documentation**: http://localhost:4000/doc
- **Health Check**: http://localhost:4000 (should return "Hello World!")
- **OpenAPI JSON**: http://localhost:4000/doc-json

### 6. Verify Installation

```bash
# Check containers are running
podman compose ps

# Test health endpoint
curl http://localhost:4000

# Test Swagger UI is accessible
curl -s http://localhost:4000/doc | grep -i swagger

# Verify OpenAPI includes authentication
curl -s http://localhost:4000/doc-json | jq '.components.securitySchemes'
```

Expected responses:

- Health check: `Hello World!`
- Swagger check: Should return HTML with "swagger" references
- Security schemes: Should show JWT bearer configuration

### 7. Database Setup

The database is automatically set up when using Docker/Podman:

- PostgreSQL container starts automatically
- Database schema is created via TypeORM migrations
- Migrations run automatically on application startup
- No manual database setup required

**Manual setup (if running without containers):**

```bash
# Install PostgreSQL locally
# Create database: home_library
# Update .env with your credentials

# Run migrations manually
npm run build
npm run migration:run
```

## Authentication System

The application uses JWT (JSON Web Tokens) for authentication with access and refresh tokens.

### Authentication Endpoints

#### Sign Up

```bash
POST /auth/signup
Content-Type: application/json

{
  "login": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "id": "uuid-of-created-user"
}
```

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "login": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refresh Token

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

**Response:**

```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

### Using Authentication with Swagger UI

1. Open Swagger UI: http://localhost:4000/doc
2. Click the **"Authorize"** button (🔒 lock icon) at the top right
3. Enter your access token (without "Bearer" prefix)
4. Click **"Authorize"** then **"Close"**
5. All protected endpoints will now include your JWT token automatically

**Swagger UI Features:**

- Interactive API testing
- Request/response examples
- Automatic JWT token inclusion for protected endpoints
- Persistent authorization across browser sessions
- Real-time API documentation

### Testing Authentication with curl

```bash
# 1. Create a user
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"login": "testuser", "password": "testpass123"}'

# 2. Login to get tokens
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login": "testuser", "password": "testpass123"}')

# 3. Extract access token (requires jq)
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.accessToken')

# 4. Use token for protected endpoints
curl -X GET http://localhost:4000/user \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# 5. Test refresh token
REFRESH_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.refreshToken')
curl -X POST http://localhost:4000/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"$REFRESH_TOKEN\"}"
```

### Protected Endpoints

All endpoints except authentication are protected and require a valid JWT token:

- All `/user` endpoints
- All `/artist` endpoints
- All `/album` endpoints
- All `/track` endpoints
- All `/favs` endpoints

### Token Information

- **Access Token**: Valid for 1 hour (configurable via `JWT_ACCESS_TOKEN_EXPIRE_TIME`)
- **Refresh Token**: Valid for 24 hours (configurable via `JWT_REFRESH_TOKEN_EXPIRE_TIME`)
- **Format**: Bearer token in Authorization header
- **Algorithm**: HMAC SHA256

## API Endpoints

### Base URL

All endpoints are prefixed with `/api`:

### Users (`/api/user`)

- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get user by ID
- `POST /api/user` - Create new user
- `PUT /api/user/:id` - Update user password
- `DELETE /api/user/:id` - Delete user

### Artists (`/api/artist`)

- `GET /api/artist` - Get all artists
- `GET /api/artist/:id` - Get artist by ID
- `POST /api/artist` - Create new artist
- `PUT /api/artist/:id` - Update artist
- `DELETE /api/artist/:id` - Delete artist

### Albums (`/api/album`)

- `GET /api/album` - Get all albums
- `GET /api/album/:id` - Get album by ID
- `POST /api/album` - Create new album
- `PUT /api/album/:id` - Update album
- `DELETE /api/album/:id` - Delete album

### Tracks (`/api/track`)

- `GET /api/track` - Get all tracks
- `GET /api/track/:id` - Get track by ID
- `POST /api/track` - Create new track
- `PUT /api/track/:id` - Update track
- `DELETE /api/track/:id` - Delete track

### Favorites (`/api/favs`)

- `GET /api/favs` - Get all favorites
- `POST /api/favs/artist/:id` - Add artist to favorites
- `DELETE /api/favs/artist/:id` - Remove artist from favorites
- `POST /api/favs/album/:id` - Add album to favorites
- `DELETE /api/favs/album/:id` - Remove album from favorites
- `POST /api/favs/track/:id` - Add track to favorites
- `DELETE /api/favs/track/:id` - Remove track from favorites

## Data Models

### User

```typescript
interface User {
  id: string; // UUID v4
  login: string;
  password: string; // Excluded from responses
  version: number; // Increments on update
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}
```

### Artist

```typescript
interface Artist {
  id: string; // UUID v4
  name: string;
  grammy: boolean;
}
```

### Album

```typescript
interface Album {
  id: string; // UUID v4
  name: string;
  year: number;
  artistId: string | null; // Reference to Artist
}
```

### Track

```typescript
interface Track {
  id: string; // UUID v4
  name: string;
  duration: number; // In seconds
  artistId: string | null; // Reference to Artist
  albumId: string | null; // Reference to Album
}
```

## Testing

After the application is running, open a new terminal and enter:

### Run all tests without authorization

```bash
npm run test
```

### Run all tests with authorization (excludes refresh token tests)

```bash
npm run test:auth
```

### Run refresh token tests specifically

```bash
npm run test:refresh
```

### Run specific test suites

```bash
# Individual test files (without authorization)
npm run test -- users.e2e.spec.ts
npm run test -- artists.e2e.spec.ts
npm run test -- albums.e2e.spec.ts
npm run test -- tracks.e2e.spec.ts
npm run test -- favorites.e2e.spec.ts

# Individual test files (with authorization)
npm run test:auth -- auth/users.e2e.spec.ts
npm run test:auth -- auth/artists.e2e.spec.ts
npm run test:auth -- auth/albums.e2e.spec.ts
npm run test:auth -- auth/tracks.e2e.spec.ts
npm run test:auth -- auth/favorites.e2e.spec.ts
```

### Additional test options

```bash
# Run with coverage
npm run test:cov

# Run in watch mode (for development)
npm run test:watch

# Debug tests
npm run test:debug
```

### Test Environment

- Tests run against the containerized application at `http://localhost:4000`
- Database is automatically seeded/cleaned between tests
- Auth tests create temporary users and clean up after themselves
- All tests run in band (sequentially) to avoid conflicts

## Development

### Code Quality

#### Auto-fix and format code

```bash
npm run lint
npm run format
```

#### Type checking

```bash
npm run build
```

### Debugging in VSCode

1. Open the project in VSCode
2. Press <kbd>F5</kbd> to start debugging
3. Set breakpoints in your TypeScript files

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (Invalid UUID, missing fields)
- `403` - Forbidden (Wrong password)
- `404` - Not Found (Entity doesn't exist)
- `422` - Unprocessable Entity (Referenced entity doesn't exist)

## Logging

The application includes a comprehensive logging system that:

- **Always enabled**: Logs all requests, responses, errors, and exceptions
- **Multiple levels**: ERROR, WARN, INFO, DEBUG (configurable via `LOG_LEVEL`)
- **Dual output**: Console (stdout) and file (`logs/app.log`)
- **File rotation**: Overwrites log file when size limit is reached
- **Global coverage**: HTTP requests, exceptions, and process-level errors

### Log Viewing

```bash
# View real-time logs from containers
podman compose logs -f app

# View log file directly
tail -f logs/app.log

# Search logs for specific events
grep "ERROR" logs/app.log
grep "JWT" logs/app.log
grep "signup\|login" logs/app.log
```
