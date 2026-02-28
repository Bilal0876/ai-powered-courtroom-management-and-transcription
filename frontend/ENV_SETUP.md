# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the `vite-project` directory with the following:

```env
# API Base URL
# For development: http://localhost:3000
# For production: https://api.yourdomain.com
VITE_API_URL=http://localhost:3000
```

## Usage

1. **Development**: 
   - Create `.env` file with `VITE_API_URL=http://localhost:3000`
   - Or leave it empty to use the default in `config.js`

2. **Production**:
   - Set `VITE_API_URL=https://your-production-api-url.com`
   - Build the app: `npm run build`
   - The environment variable will be baked into the build

## Important Notes

- Vite requires the `VITE_` prefix for environment variables to be exposed to the frontend
- After changing `.env`, restart the dev server
- Environment variables are replaced at build time, not runtime

