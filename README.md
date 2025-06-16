# Home Library Service

A NestJS-based REST API service for managing a home music library with users, artists, albums, tracks, and favorites.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://docs.docker.com/get-docker/)

## Setup Instructions

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
PORT=4000

# JWT Configuration
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# Password Encryption
CRYPT_SALT=10

# Logging Configuration
LOG_LEVEL=INFO
LOG_TO_FILE=true
LOG_DIRECTORY=./logs
LOG_MAX_FILE_SIZE_KB=1024

# Database Configuration
DB_PORT=5432
DB_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=home_library
```

### 4. Start PostgreSQL Container

```bash
# Start only PostgreSQL container
docker-compose up postgres -d

# Verify PostgreSQL is running
docker-compose ps
```

### 5. Run Database Migrations

```bash
npm run migration:run
```

### 6. Run Tests

```bash
# Run tests with authorization
npm run test:auth

# Run refresh token tests
npm run test:refresh
```

### 7. Stop PostgreSQL Container

```bash
docker-compose down
```

## Logging

### Logging Levels

The `LOG_LEVEL` environment variable controls what gets logged:

- `ERROR` - Only errors
- `WARN` - Warnings and errors
- `INFO` - Informational messages, warnings, and errors (default)
- `DEBUG` - All messages including debug information

### Log Location

Logs are saved to: `./logs/app.log`

```bash
npm run docker:prod
```

2. Check running containers:

```bash
docker ps
```

3. Stop the containers:

```bash
npm run docker:down
```

### 5. Database Setup

Before running the application, you need to set up the database:

1. Add database configuration to the `.env`:

```env
POSTGRES_USER={user}
POSTGRES_PASSWORD={password}
POSTGRES_DB={db_name}
DB_HOST={db_host}
DB_PORT={db_port}
```

2. Create local database with {db_name}

3. Run migrations:

```bash
npm run migration:run       # Apply migrations to database
```

### 6. Run the application

```bash
npm run start
```

The application will start on the port specified in your `.env` file (default: 4000).

### 7. Access the API Documentation

After starting the app, you can access the interactive OpenAPI documentation:

**Swagger UI**: http://localhost:4000/doc/

For more information about OpenAPI/Swagger, visit https://swagger.io/.

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

### Run specific test suite

```bash
npm run test -- <path to suite>
```

### Run all tests with authorization

```bash
npm run test:auth
```

### Run specific test suite with authorization

```bash
npm run test:auth -- <path to suite>
```

### Example test commands

```bash
# Test specific modules
npm run test -- test/user.e2e-spec.ts
npm run test -- test/favorites.e2e-spec.ts

# Run with verbose output
npm run test -- --verbose
```

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
