# myContacts - Contact Management REST API

A scalable, event-driven RESTful API for managing personal contacts with user authentication, authorization, and real-time email notifications. Built with Node.js, Express.js, PostgreSQL, Prisma ORM, Google Cloud Pub/Sub, and Nodemailer.

## Features

### Core Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Contact Management** - Full CRUD operations for contacts
- **Authorization** - User-specific data isolation (users can only access their own contacts)
- **Password Security** - Bcrypt hashing with 10 salt rounds
- **Token-based Sessions** - JWT with configurable expiration (5 minutes)

### Advanced Features

- **Event-Driven Architecture** - Google Cloud Pub/Sub for asynchronous event processing
- **Email Notifications** - Automated email alerts for contact operations (create/update/delete)
- **Worker Process** - Dedicated job server for background task processing
- **Microservices Pattern** - Separation of API server and background job worker
- **Local Development** - Google Cloud Pub/Sub emulator support via Docker

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Database:** PostgreSQL
- **ORM:** Prisma v7.3.0
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt v6.0.0
- **Message Queue:** Google Cloud Pub/Sub v5.2.3
- **Email Service:** Nodemailer v8.0.1
- **Utilities:** express-async-handler, dotenv

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   API Server    │────────▶│  Google Pub/Sub  │────────▶│  Worker Server  │
│   (server.js)   │         │   (Emulator)     │         │   (worker.js)   │
│                 │         │                  │         │                 │
│  - REST APIs    │         │  - Topic         │         │  - Email Jobs   │
│  - JWT Auth     │  Event  │  - Subscription  │  Event  │  - Processing   │
│  - CRUD Ops     │ Publish │                  │Consume  │  - Nodemailer   │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                                                          │
        │                                                          │
        ▼                                                          ▼
┌─────────────────┐                                      ┌─────────────────┐
│   PostgreSQL    │                                      │   Gmail SMTP    │
│   Database      │                                      │   Server        │
└─────────────────┘                                      └─────────────────┘
```

### How It Works:

1. **API Server** handles HTTP requests and performs CRUD operations
2. When a contact is created/updated/deleted, an **event is published** to Pub/Sub
3. **Worker Server** listens to the subscription and processes events
4. **Email notifications** are sent to users via Nodemailer

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **Docker** (for running Pub/Sub emulator)
- **Gmail Account** (for sending emails via SMTP)
- **npm** or yarn package manager

## Installation & Setup

### Step 1: Install Required Dependencies

After downloading the project to your local system, install all required dependencies:

```bash
npm install
```

This will install all packages listed in `package.json`.

### Step 2: Update Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Server Configuration
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mycontacts_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Prisma Database URL
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/mycontacts_db?schema=public"

# JWT Authentication Configuration
ACCESS_TOKEN_SECRET=your_strong_random_secret_key_here

# Google Cloud Pub/Sub Configuration
TOPIC_NAME="contact-events-topic"
SUBSCRIPTION_NAME="email-notification-subscription"

# Email Configuration (Gmail SMTP)
SENDER_MAIL_ADDRESS="your_email@gmail.com"
SENDER_MAIL_PASSWORD="your_gmail_app_password"
DUMMY_MAIL_ADDRESS="recipient_email@gmail.com"
```

**Important Notes:**

- For `SENDER_MAIL_PASSWORD`, use a Gmail [App Password](Generate App password for using gmail in nodemailer), not your regular password
- `DUMMY_MAIL_ADDRESS` is where notification emails will be sent (use your personal email to avoid spam / reports)

### Step 3: Generate Prisma Client for Database Operations

Run the following command to generate the Prisma Client using database configs from `.env` and `schema.prisma`:

```bash
npx prisma generate
```

This creates type-safe database query functions.

### Step 4: Set Up PostgreSQL Database

```bash
# Create the database
createdb mycontacts_db

# Run Prisma migrations to create tables
npx prisma migrate deploy
```

### Step 5: Run Google Cloud Pub/Sub Local Emulator

Run the Google Pub/Sub local emulator in a Docker container:

```bash
docker run -d -p 8085:8085 gcr.io/google.com/cloudsdktool/google-cloud-cli gcloud beta emulators pubsub start --project=my-contacts-project --host-port=0.0.0.0:8085
```

This starts the Pub/Sub emulator on port 8085.

### Step 6: Create Topic and Subscription

Run the setup script to create the Pub/Sub topic and subscription:

```bash
npm run pubsub
```

This executes `local_setup/pubsub/setup-pubsub.js`, which creates:

- **Topic:** `contact-events-topic`
- **Subscription:** `email-notification-subscription`

### Step 7: Start the Job Server (Worker)

In a **new terminal window**, start the worker server:

```bash
npm run dev_job
```

This starts the job server (`worker.js`) which listens to Pub/Sub messages and processes email notifications.

**Output:**

```
Worker process started...
```

### Step 8: Start the API Server

In **another new terminal window**, start the API server:

```bash
npm run dev_api
```

This starts the HTTP server (`server.js`) on port 5001 (or the configured PORT).

**Output:**

```
server running on port 5001
```

Now you have:

- Pub/Sub emulator running on port 8085
- Worker server listening for events
- API server ready to accept requests on port 5001

## API Documentation

### Base URL

```
http://localhost:5001/api
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

**Note:** Token expires in 5 minutes.

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

All contact endpoints require the `Authorization` header:

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

_Returns the 15 most recent contacts, ordered by ID (descending)_

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

**Side Effect:**

- Event `CONTACT_CREATED` is published to Pub/Sub
- Email notification sent to `DUMMY_MAIL_ADDRESS`

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

**Side Effect:**

- Event `CONTACT_UPDATED` is published to Pub/Sub
- Email notification sent to `DUMMY_MAIL_ADDRESS`

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

**Side Effect:**

- Event `CONTACT_DELETED` is published to Pub/Sub
- Email notification with contact details sent to `DUMMY_MAIL_ADDRESS`

## Email Notification System

### How Email Notifications Work

1. **Event Publishing:** When a contact operation occurs (create/update/delete), the API server publishes an event to Google Pub/Sub
2. **Event Consumption:** The worker server listens to the subscription and receives the message
3. **Email Processing:** The worker processes the event and sends an email via Nodemailer
4. **Acknowledgment:** After successful processing, the message is acknowledged (ACK)

### Event Types

| Event Type        | Trigger             | Email Subject           | Email Content                              |
| ----------------- | ------------------- | ----------------------- | ------------------------------------------ |
| `CONTACT_CREATED` | New contact created | "New Contact created!!" | Contact name notification                  |
| `CONTACT_UPDATED` | Contact updated     | "Contact updated!!"     | Contact name with update info              |
| `CONTACT_DELETED` | Contact deleted     | "Contact deleted!!"     | Full contact details (name, email, mobile) |

### Email Configuration

The system uses **Gmail SMTP** for sending emails. You need:

- Gmail account
- [App Password](https://support.google.com/accounts/answer/185833) (not regular password)
- Configure in `.env` file

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

- **Password Hashing:** Bcrypt
- **JWT Tokens:** 10-minute expiration (configurable)
- **Protected Routes:** Middleware validates JWT before accessing contact endpoints
- **User Isolation:** Users can only view/modify their own contacts

### Authorization Checks

- Update/Delete operations verify contact ownership
- Returns 403 Forbidden if user attempts to modify another user's contact
- Token validation on every protected endpoint

### Email Security

- Gmail App Passwords (not regular passwords)
- Environment variable protection for credentials
- Emails sent only to configured dummy address to prevent spam

## Project Structure

```
mycontacts-backend/
├── controllers/
│   ├── contactController.js    # Contact CRUD + Event Publishing
│   └── userController.js        # User authentication logic
├── middleware/
│   ├── errorHandler.js          # Centralized error handling
│   └── validateTokenHandler.js  # JWT validation middleware
├── services/
│   ├── pubsub/
│   │   ├── client.js            # Pub/Sub client configuration
│   │   └── publisher.js         # Event publishing logic
│   ├── asyncJobService.js       # Background job processing
│   └── sendMail.js              # Email service with Nodemailer
├── local_setup/
│   └── pubsub/
│       └── setup-pubsub.js      # Topic & Subscription setup script
├── prisma/
│   ├── migrations/              # Database migrations
│   └── schema.prisma            # Prisma schema definition
├── routes/
│   ├── contactRoutes.js         # Contact endpoints
│   └── userRoutes.js            # Auth endpoints
├── utils/
│   └── prismaUtil.js            # Prisma client instance
├── constants.js                 # HTTP status codes
├── server.js                    # API server entry point
├── worker.js                    # Background job worker entry point
├── package.json
└── .env                         # Environment variables
```

## Key Implementation Highlights

### 1. **Event-Driven Architecture**

- Decoupled API server and background jobs
- Asynchronous processing prevents blocking API responses
- Scalable design - can add more workers for high load

### 2. **Google Cloud Pub/Sub Integration**

- Local emulator for development (no cloud costs)
- Production-ready architecture
- Message acknowledgment for reliability
- Error handling with NACK for failed messages

### 3. **Email Notification System**

- Nodemailer with Gmail SMTP
- HTML formatted emails
- Event-based triggering
- Separate worker process for email processing

### 4. **Prisma ORM Integration**

- Type-safe database queries
- Automated migrations
- Relation management between Users and Contacts
- Built-in connection pooling

### 5. **Middleware Architecture**

- Global error handler for consistent error responses
- Token validation middleware applied to all contact routes
- Async handler wrapper to catch promise rejections

### 6. **RESTful Design**

- Clean route definitions
- Proper HTTP status codes (200, 400, 401, 403, 404, 500)
- Consistent JSON response structure

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

### Pub/Sub Error Handling

- Failed message processing triggers `NACK` for retry
- Error logs for debugging
- Graceful error handling in worker process

## Testing the Email Notifications

1. Start all services (Pub/Sub emulator, worker, API server)
2. Create a contact via API:
   ```bash
   curl -X POST http://localhost:5001/api/contacts \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","mobile":"1234567890"}'
   ```
3. Check the worker logs - you should see:
   ```
   Event [CONTACT_CREATED] published. ID: ...
   Processing Event: CONTACT_CREATED for user@example.com
   Mail sent for CONTACT_CREATED event for contact: Test User
   ```
4. Check your `DUMMY_MAIL_ADDRESS` inbox for the notification email

## Author

**Pranay Dasoju**

- GitHub: [@pranay-dasoju](https://github.com/pranay-dasoju)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/pranay-kumar-dasoju)
