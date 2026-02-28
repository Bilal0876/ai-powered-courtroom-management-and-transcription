# Deployment Guide - Environment Variables Setup

## Overview

This guide explains how to set up environment variables when deploying to platforms like Vercel, Render, Railway, etc.

## Deployment Workflow

### Step 1: Deploy Frontend First (Vercel)

1. **Deploy your frontend to Vercel**
   - Connect your GitHub repo
   - Vercel will automatically detect Vite and deploy
   - **Note the domain Vercel gives you** (e.g., `your-app.vercel.app`)

2. **Set Frontend Environment Variable in Vercel**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-domain.com`
   - Redeploy to apply changes

### Step 2: Deploy Backend (Render/Railway/etc.)

1. **Deploy your backend**
   - Connect your GitHub repo
   - Platform will give you a backend URL (e.g., `your-api.onrender.com`)

2. **Set Backend Environment Variables**

   In your deployment platform's environment variables section, add:

   ```env
   # Database (use your production database)
   DB_HOST=your-production-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   DB_PORT=5432
   DB_SSL=true

   # Supabase
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   SUPABASE_ANON_KEY=your-anon-key

   # Server
   PORT=3000
   NODE_ENV=production

   # CORS - Use the frontend domain from Vercel!
   FRONTEND_URL=https://your-app.vercel.app
   ```

   **Important**: Use the **exact domain** Vercel gave you (including `https://`)

### Step 3: Update Frontend with Backend URL

1. **Go back to Vercel**
2. **Update environment variable**:
   - `VITE_API_URL` = `https://your-backend-domain.onrender.com`
3. **Redeploy frontend**

## Example: Complete Setup

### Frontend (Vercel)
```
Project: atl-frontend
Domain: atl-frontend.vercel.app

Environment Variables:
VITE_API_URL=https://atl-backend.onrender.com
```

### Backend (Render)
```
Project: atl-backend
Domain: atl-backend.onrender.com

Environment Variables:
FRONTEND_URL=https://atl-frontend.vercel.app
DB_HOST=...
DB_USER=...
# ... other vars
```

## Platform-Specific Instructions

### Vercel (Frontend)

1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_API_URL` = `https://your-backend-url.com`
3. **Important**: After adding, click "Redeploy" or push a new commit

### Render (Backend)

1. Go to your service → Environment
2. Add all environment variables
3. **Key variable**: `FRONTEND_URL=https://your-frontend.vercel.app`
4. Save and redeploy

### Railway (Backend)

1. Go to your project → Variables
2. Add all environment variables
3. **Key variable**: `FRONTEND_URL=https://your-frontend.vercel.app`
4. Deploy automatically updates

## Multiple Environments

### Development
```env
# Frontend .env
VITE_API_URL=http://localhost:3000

# Backend .env
FRONTEND_URL=http://localhost:5173
```

### Staging
```env
# Frontend (Vercel Preview)
VITE_API_URL=https://atl-backend-staging.onrender.com

# Backend
FRONTEND_URL=https://atl-frontend-git-staging.vercel.app
```

### Production
```env
# Frontend (Vercel Production)
VITE_API_URL=https://atl-backend.onrender.com

# Backend
FRONTEND_URL=https://atl-frontend.vercel.app
```

## Troubleshooting

### CORS Error After Deployment

**Problem**: Frontend can't access backend API

**Solution**:
1. Check backend logs for CORS errors
2. Verify `FRONTEND_URL` in backend matches **exact** frontend domain
3. Include `https://` in the URL
4. No trailing slash: `https://domain.com` not `https://domain.com/`

### Frontend Shows "Network Error"

**Problem**: Frontend can't find backend

**Solution**:
1. Verify `VITE_API_URL` is set in Vercel
2. Check it matches your backend URL exactly
3. Redeploy frontend after changing environment variables

### Multiple Frontend Domains

If you have multiple frontend domains (e.g., custom domain + Vercel domain):

```env
# Backend FRONTEND_URL
FRONTEND_URL=https://your-app.vercel.app,https://your-custom-domain.com
```

## Quick Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render/Railway/etc.
- [ ] `VITE_API_URL` set in Vercel (points to backend)
- [ ] `FRONTEND_URL` set in backend (points to frontend)
- [ ] All other environment variables set
- [ ] Both services redeployed after setting env vars
- [ ] Test API calls from frontend
- [ ] Check browser console for CORS errors

## Security Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use platform environment variables** - Don't hardcode URLs
3. **Use HTTPS in production** - Both frontend and backend
4. **Restrict CORS** - Only allow your frontend domain(s)

