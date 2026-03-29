# Backend Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=5432
DB_SSL=false

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=3000

# Frontend URL(s) for CORS
# For development: http://localhost:5173
# For production: https://your-frontend-domain.com
# For multiple origins (comma-separated): http://localhost:5173,https://staging.yourdomain.com
FRONTEND_URL=http://localhost:5173
```

## Quick Start

1. Copy this file and create `.env` in the `backend` directory
2. Fill in your actual values
3. Restart the server

## CORS Configuration

The `FRONTEND_URL` variable controls which origins can access your API:
- **Development**: `FRONTEND_URL=http://localhost:5173`
- **Production**: `FRONTEND_URL=https://your-domain.com`
- **Multiple**: `FRONTEND_URL=http://localhost:5173,https://staging.domain.com`

If not set, defaults to `http://localhost:5173` and `http://localhost:3000` for development.


