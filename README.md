# Coolify Proxy API

A Deno-based proxy API that provides a secure interface to manage Coolify resources including applications, databases, and projects. This API acts as a middleware layer between client applications and Coolify, handling authentication, validation, and resource management.

## Features

- **Application Management**: Create, update, delete, and manage application deployments
- **Database Management**: Provision and manage database instances
- **Project Organization**: Create and manage projects to organize resources
- **Environment Variables**: Manage application environment configurations
- **User Authentication**: JWT-based authentication with user session management
- **Email Notifications**: Integration with Resend for email communications
- **Resource Control**: Start, stop, and restart applications and databases

## Prerequisites

- Deno runtime (latest version)
- PostgreSQL database for user management
- Access to a Coolify instance
- Coolify API access token
- Resend API key for email services

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coolify-proxy
```

2. Copy and configure the environment file:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```
COOLIFY_BASE_URL=https://your-coolify-instance.com
COOLIFY_ACCESS_TOKEN=your_coolify_api_token
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
RESEND_API_KEY=your_resend_api_key
JWT_SECRET=your_jwt_secret_key
PRIV_TOKEN=your_privileged_access_token
```

## Usage

### Development Mode
```bash
deno task dev
```

### Production Mode
```bash
deno task start
```

The server will start on `http://localhost:8000` by default.

## Project Structure

```
src/
├── coolify/              # Coolify API integration layer
│   ├── application.ts    # Application management
│   ├── database.ts       # Database management
│   ├── project.ts        # Project management
│   ├── server.ts         # Server configuration
│   └── constant.ts       # API constants
├── email/                # Email service integration
│   └── index.ts          # Resend email handler
├── routes/               # API route handlers
│   ├── application/      # Application endpoints
│   │   ├── env/          # Environment variable management
│   │   └── *.ts          # CRUD and control operations
│   ├── database/         # Database endpoints
│   ├── project/          # Project endpoints
│   └── user/             # User management endpoints
├── system_database/      # Database abstraction layer
│   ├── application/      # Application data operations
│   ├── database/         # Database data operations
│   ├── project/          # Project data operations
│   ├── user/             # User data operations
│   ├── migrations.sql    # Database schema migrations
│   └── types.ts          # TypeScript type definitions
├── utils/                # Utility functions
│   ├── safe-async.ts     # Error handling wrapper
│   └── throws-env.ts     # Environment variable validation
└── main.ts               # Application entry point
```

## API Endpoints

### Applications
- `POST /create-application` - Deploy a new application
- `GET /get-application/:uuid` - Get application details
- `GET /list-application` - List all applications
- `DELETE /delete-application/:uuid` - Remove an application
- `POST /restart-application/:uuid` - Restart an application
- `POST /start-application/:uuid` - Start an application
- `POST /stop-application/:uuid` - Stop an application

### Environment Variables
- `GET /list-env/:application_uuid` - List environment variables
- `POST /create-env` - Add environment variable
- `PUT /update-env` - Update environment variable
- `DELETE /delete-env` - Remove environment variable

### Databases
- `POST /create-database` - Create a new database
- `GET /get-database/:uuid` - Get database details
- `GET /list-database` - List all databases
- `DELETE /delete-database/:uuid` - Remove a database
- `POST /restart-database/:uuid` - Restart a database
- `POST /start-database/:uuid` - Start a database
- `POST /stop-database/:uuid` - Stop a database

### Projects
- `POST /create-project` - Create a new project
- `GET /get-project/:uuid` - Get project details
- `GET /list-project` - List all projects
- `DELETE /delete-project/:uuid` - Remove a project

### Users
- `POST /create-user` - Register a new user
- `POST /signin-user` - User authentication
- `GET /list-user` - List all users (admin only)
- `DELETE /delete-user/:id` - Remove a user (admin only)

## Authentication

The API uses JWT tokens for authentication. Protected endpoints require a valid JWT token in the cookie named `auth-token`. The token is issued upon successful user sign-in and contains user identification claims.

Administrative endpoints may require additional authorization via the `PRIV_TOKEN` for system-level operations.

## Database Schema

The application uses PostgreSQL for persistent storage of user data, application metadata, and system configurations. Run the migrations in `src/system_database/migrations.sql` to set up the required tables.

## Development

### Import Aliases

The project uses path aliases for cleaner imports:
- `@src/` - Source directory root
- `@coolify/` - Coolify integration modules
- `@routes/` - API route handlers
- `@sysdb/` - System database operations
- `@utils/` - Utility functions

### Dependencies

- **Hono**: Web framework for building the API
- **PostgreSQL**: Database for persistent storage
- **Resend**: Email service provider
- **Zod**: Schema validation library
- **JWT**: Authentication token management

## Security Considerations

- All sensitive credentials should be stored in environment variables
- JWT secrets should be strong and regularly rotated
- Database connections use SSL in production
- Input validation is performed on all API endpoints
- Rate limiting should be implemented in production environments

## License

[Specify your license here]

## Support

For issues, questions, or contributions, please [specify contact method or issue tracker]
