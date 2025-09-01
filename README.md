# COOLIFY PROXY API

A Deno-based REST API for managing users, administrators, and applications with Coolify integration.

## Prerequisites

- Deno installed on your system
- Access to a Coolify instance
- Coolify API credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Copy the environment file and configure:
```bash
cp .env.example .env
```

3. Set your environment variables in `.env`:
```
COOLIFY_API_URL=your_coolify_instance_url
COOLIFY_API_TOKEN=your_coolify_api_token
```

## Usage

### Development
```bash
deno task dev
```

### Production
```bash
deno task start
```

## Project Structure

```
src/
├── coolify/          # Coolify API integration
├── db/               # Database models and schemas
├── middlewares/      # Authentication middleware
├── routes/           # API route handlers
│   ├── admin/        # Admin-specific routes
│   └── user/         # User-specific routes
│       └── application/ # Application management
├── utils/            # Utility functions
└── main.ts           # Application entry point
```

## Data Storage

The application uses JSON files for data persistence:
- `user-db.json` - Stores user emails and application associations
- `admin-db.json` - Stores admin user emails

## Authentication

The API uses bearer token authentication for privileged endpoints. Admin routes are protected and require a valid bearer token in the Authorization header.

## Development

The project uses path mapping for clean imports:
- `@src/` - Source directory
- `@db/` - Database modules
- `@coolify/` - Coolify integration
- `@routes/` - Route handlers
- `@middleware/` - Middleware functions
- `@utils/` - Utility functions
