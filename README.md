# myContacts - Contact Management REST API

A secure, production-ready RESTful API for managing personal contacts with user authentication and authorization. Built with Node.js, Express.js, PostgreSQL, and Prisma ORM.

## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Contact Management** - Full CRUD operations for contacts
- **Authorization** - User-specific data isolation (users can only access their own contacts)
- **Password Security** - Bcrypt hashing
- **Token-based Sessions** - JWT with configurable expiration
- **Database ORM** - Prisma for type-safe database queries
- **Error Handling** - Centralized error handling middleware
- **Input Validation** - Request validation for all endpoints

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Utilities:** express-async-handler, dotenv

## Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=database_name
DB_USER=postgres
DB_PASSWORD=your_password

# Prisma Database URL
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/database_name?schema=public"

# JWT Secret (use a strong, random string)
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
```

## API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication Endpoints

#### Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "user registered successfully",
  "data": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

#### Login User

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User

```http
GET /api/users/current_user
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "id": 1
}
```

### Contact Endpoints (Protected - Requires Authentication)

All contact endpoints require the `Authorization` header with a valid JWT token:

```
Authorization: Bearer <your_jwt_token>
```

#### Get All Contacts

```http
GET /api/contacts
```

**Response:**

```json
{
  "message": "Records fetched successfully",
  "status": "SUCCESS",
  "records": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "mobile": "9876543210",
      "created_at": "2026-02-13T09:30:00.000Z",
      "updated_at": "2026-02-13T09:30:00.000Z",
      "user_id": 1
    }
  ]
}
```

_Note: Returns the 15 most recent contacts_

#### Create Contact

```http
POST /api/contacts
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "mobile": "9876543210"
}
```

**Response:**

```json
{
  "message": "contact recorded successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "mobile": "9876543210",
    "user_id": 1,
    "created_at": "2026-02-13T09:30:00.000Z",
    "updated_at": "2026-02-13T09:30:00.000Z"
  }
}
```

#### Get Contact by ID

```http
GET /api/contacts/:contactId
```

**Response:**

```json
{
  "message": "contact fetched successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "mobile": "9876543210",
    "user_id": 1,
    "created_at": "2026-02-13T09:30:00.000Z",
    "updated_at": "2026-02-13T09:30:00.000Z"
  }
}
```

#### Update Contact

```http
PUT /api/contacts/:contactId
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "mobile": "9876543210"
}
```

**Response:**

```json
{
  "message": "contact updated successfully",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "mobile": "9876543210",
    "user_id": 1,
    "created_at": "2026-02-13T09:30:00.000Z",
    "updated_at": "2026-02-13T10:15:00.000Z"
  }
}
```

#### Delete Contact

```http
DELETE /api/contacts/:contactId
```

**Response:**

```json
{
  "message": "Contact delete successful",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "mobile": "9876543210",
    "user_id": 1,
    "created_at": "2026-02-13T09:30:00.000Z",
    "updated_at": "2026-02-13T10:15:00.000Z"
  }
}
```

## Database Schema

### Users Table

```sql
Table: users
├── id (Integer, Primary Key, Auto-increment)
├── username (VARCHAR(30))
├── email (VARCHAR(50))
├── password (VARCHAR(128), Hashed)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

### Contacts Table

```sql
Table: contacts
├── id (Integer, Primary Key, Auto-increment)
├── name (VARCHAR(30))
├── email (VARCHAR(50))
├── mobile (VARCHAR(10), Unique)
├── user_id (Integer, Foreign Key → users.id)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

**Relationships:**

- One User can have Many Contacts (1:N)
- Each Contact belongs to exactly one User

## Security Features

### Authentication & Authorization

- **Password Hashing:** Bcrypt with 10 salt rounds
- **JWT Tokens:** 5-minute expiration (configurable)
- **Protected Routes:** Middleware validates JWT before accessing contact endpoints
- **User Isolation:** Users can only view/modify their own contacts

### Authorization Checks

- Update/Delete operations verify contact ownership
- Returns 403 Forbidden if user attempts to modify another user's contact
- Token validation on every protected endpoint

## Project Structure

```
mycontacts/
├── controllers/
│   ├── contactController.js    # Contact CRUD logic
│   └── userController.js        # User auth logic
├── middleware/
│   ├── errorHandler.js          # Centralized error handling
│   └── validateTokenHandler.js  # JWT validation
├── prisma/
│   ├── migrations/              # Database migrations
│   └── schema.prisma            # Prisma schema definition
├── routes/
│   ├── contactRoutes.js         # Contact endpoints
│   └── userRoutes.js            # Auth endpoints
├── utils/
│   └── prismaUtil.js            # Prisma client instance
├── constants.js                 # HTTP status codes
├── server.js                    # Application entry point
├── package.json
└── .env                         # Environment variables
```

## Key Implementation Highlights

### 1. **Prisma ORM Integration**

- Type-safe database queries
- Automated migrations
- Relation management between Users and Contacts

### 2. **Middleware Architecture**

- Global error handler for consistent error responses
- Token validation middleware applied to all contact routes
- Async handler wrapper to catch promise rejections

### 3. **RESTful Design**

- Clean route definitions
- Proper HTTP status codes (200, 400, 401, 403, 404, 500)
- Consistent JSON response structure

### 4. **Data Validation**

- Required field validation
- Duplicate user detection during registration
- Contact ownership verification before updates/deletes

## Error Handling

The API returns standardized error responses:

```json
{
  "title": "Error Type",
  "message": "Detailed error message"
}
```

**Status Codes:**

- `400` - Validation Error (missing fields, invalid data)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Author

**Pranay Dasoju**

- GitHub: [@pranay-dasoju](https://github.com/pranay-dasoju)
- LinkedIn: [Connect with me](www.linkedin.com/in/pranay-kumar-dasoju)