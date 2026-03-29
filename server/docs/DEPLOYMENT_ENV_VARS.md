# Backend Environment Variables for Deployment

## Required Variables

When deploying your backend, set these environment variables in your hosting platform:

### Database
```env
DB_HOST=your-production-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=5432
DB_SSL=true
```

### Supabase
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

### Server
```env
PORT=3000
NODE_ENV=production
```

### CORS (IMPORTANT!)
```env
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**Note**: Replace `your-frontend-domain.vercel.app` with your actual Vercel domain.

## How to Find Your Frontend Domain

1. Deploy frontend to Vercel
2. Vercel will show you the domain (e.g., `atl-frontend.vercel.app`)
3. Copy that **exact** domain (with `https://`)
4. Set it as `FRONTEND_URL` in your backend environment variables

## Multiple Domains

If you have multiple frontend domains (custom domain + Vercel):

```env
FRONTEND_URL=https://your-app.vercel.app,https://your-custom-domain.com
```

## Setting Variables in Different Platforms

### Render
1. Go to your service → Environment
2. Click "Add Environment Variable"
3. Add each variable one by one
4. Save and redeploy

### Railway
1. Go to your project → Variables
2. Click "New Variable"
3. Add each variable
4. Auto-deploys on save

### Heroku
```bash
heroku config:set FRONTEND_URL=https://your-app.vercel.app
heroku config:set DB_HOST=...
# ... etc
```

### DigitalOcean App Platform
1. Go to App Settings → Environment Variables
2. Add variables
3. Save and redeploy

## Testing After Deployment

1. Check backend logs - should show allowed CORS origins
2. Try making a request from frontend
3. Check browser console for CORS errors
4. If CORS error, verify `FRONTEND_URL` matches frontend domain exactly


