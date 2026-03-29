# CORS Configuration Guide

## Overview

The backend now has proper CORS (Cross-Origin Resource Sharing) configuration to restrict which origins can access the API.

## Configuration

### Environment Variable

Set `FRONTEND_URL` in your `.env` file:

```env
# Single origin
FRONTEND_URL=http://localhost:5173

# Multiple origins (comma-separated)
FRONTEND_URL=http://localhost:5173,https://staging.yourdomain.com,https://yourdomain.com
```

### Default Behavior

If `FRONTEND_URL` is not set, the following origins are allowed by default:
- `http://localhost:5173` (Vite default dev server)
- `http://localhost:3000` (Alternative dev port)

## Security Features

1. **Origin Whitelist**: Only specified origins can make requests
2. **Credentials Support**: Cookies and auth headers are allowed
3. **Method Restrictions**: Only specified HTTP methods are allowed
4. **Header Restrictions**: Only specified headers are allowed

## Allowed Methods

- GET
- POST
- PUT
- DELETE
- OPTIONS
- PATCH

## Allowed Headers

- Content-Type
- Authorization
- x-role
- x-user-code
- x-judge-code
- x-steno-code
- x-cjudge-code

## Development Setup

1. Copy `.env.example` to `.env`
2. Set `FRONTEND_URL=http://localhost:5173` (or your Vite dev server port)
3. Restart the backend server

## Production Setup

1. Set `FRONTEND_URL=https://your-production-domain.com`
2. For multiple environments, use comma-separated values
3. Ensure HTTPS is used in production

## Troubleshooting

### CORS Error: "Not allowed by CORS"

**Solution**: Add your frontend URL to `FRONTEND_URL` in `.env`

### Requests from Mobile App Fail

**Solution**: Mobile apps typically don't send an origin header. The configuration allows requests with no origin, so this should work automatically.

### Multiple Environments

**Solution**: Use comma-separated values:
```env
FRONTEND_URL=http://localhost:5173,https://staging.yourdomain.com,https://yourdomain.com
```

## Testing

To test CORS configuration:

1. Start backend server
2. Check console output - it will show which origins are allowed
3. Make a request from your frontend
4. Check browser console for CORS errors


