# Authentication Middleware

## Overview

This middleware provides secure token-based authentication using Supabase JWT tokens, replacing the insecure header-based authentication.

## Middleware Functions

### `authenticateToken`

Validates Supabase JWT token from Authorization header.

**Usage:**
```javascript
const { authenticateToken } = require('../middleware/auth');

router.post('/protected-route', authenticateToken, (req, res) => {
  // req.user is available here
  const userId = req.user.id;
  const email = req.user.email;
});
```

**Request Format:**
```
Authorization: Bearer <supabase-access-token>
```

**Response on Success:**
- Attaches `req.user` with:
  - `id`: User ID
  - `email`: User email
  - `authUid`: Supabase auth UID

**Response on Failure:**
- `401 Unauthorized` if token is missing or invalid

### `requireRole(allowedRoles)`

Checks if authenticated user has required role. Must be used after `authenticateToken`.

**Usage:**
```javascript
const { authenticateToken, requireRole } = require('../middleware/auth');

// Only admin and chief-judge can access
router.post('/admin-route', 
  authenticateToken, 
  requireRole(['admin', 'chief-judge']), 
  (req, res) => {
    // req.user.role and req.user.code are available
  }
);
```

**Parameters:**
- `allowedRoles`: Array of allowed roles (e.g., `['admin', 'chief-judge']`)

**Response on Success:**
- Attaches to `req.user`:
  - `role`: User's role
  - `code`: User's code (e.g., admin_code, judge_code)
  - `data`: Full user data from database

**Response on Failure:**
- `403 Forbidden` if user doesn't have required role

### `authenticateOptional`

For backward compatibility - accepts either token or headers.

**Usage:**
```javascript
const { authenticateOptional } = require('../middleware/auth');

router.post('/route', authenticateOptional, (req, res) => {
  // Works with both token and headers
});
```

## Migration Guide

### Before (Insecure - Header Based)
```javascript
router.post("/", async (req, res) => {
  const role = req.headers["x-role"];          
  const userCode = req.headers["x-user-code"]; 
  
  if (!role || !userCode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // ... rest of code
});
```

### After (Secure - Token Based)
```javascript
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post("/", authenticateToken, requireRole(['admin']), async (req, res) => {
  const role = req.user.role;      // From authenticated token
  const userCode = req.user.code; // From authenticated token
  // ... rest of code
});
```

## Frontend Changes Required

### Before
```javascript
fetch('/api/endpoint', {
  headers: {
    'x-role': 'admin',
    'x-user-code': 'ADM-01'
  }
});
```

### After
```javascript
// Get token from login response
const token = loginResponse.session.access_token;

fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Protected Routes

Routes that should use authentication:

1. **Admin Routes:**
   - `/add-case` - `requireRole(['admin', 'chief-judge'])`
   - `/register-user` - `requireRole(['admin'])`
   - `/delete-user` - `requireRole(['admin'])`
   - `/update-user` - `requireRole(['admin'])`

2. **Judge Routes:**
   - `/jcases` - `requireRole(['judge'])`
   - `/approve-transcript` - `requireRole(['judge'])`
   - `/approve-ordersheet` - `requireRole(['judge'])`

3. **Stenographer Routes:**
   - `/sthearings` - `requireRole(['stenographer'])`
   - `/save-transcript` - `requireRole(['stenographer'])`

4. **Chief Judge Routes:**
   - `/cjcases` - `requireRole(['chief-judge'])`
   - `/register-court` - `requireRole(['chief-judge'])`

## Security Benefits

1. ✅ **Token Validation**: Tokens are cryptographically signed by Supabase
2. ✅ **Cannot be Spoofed**: Unlike headers, tokens cannot be easily faked
3. ✅ **Expiration**: Tokens expire automatically
4. ✅ **Revocable**: Tokens can be invalidated by Supabase
5. ✅ **Role Verification**: Roles are verified against database, not trusted from client


