# Issue #5 Fix Summary: Authentication Middleware Implementation

## ✅ What Was Created

### 1. **Authentication Middleware** (`backend/middleware/auth.js`)

Created secure token-based authentication middleware using Supabase JWT tokens.

**Key Features:**
- ✅ Validates Supabase JWT tokens
- ✅ Extracts user information from tokens
- ✅ Role-based access control
- ✅ Database role verification
- ✅ Backward compatibility option

**Middleware Functions:**

1. **`authenticateToken`** - Validates JWT token
   - Checks `Authorization: Bearer <token>` header
   - Verifies token with Supabase
   - Attaches user info to `req.user`

2. **`requireRole(allowedRoles)`** - Checks user role
   - Must be used after `authenticateToken`
   - Verifies role against database
   - Attaches role and code to `req.user`

3. **`authenticateOptional`** - Backward compatibility
   - Accepts either token or headers
   - For gradual migration

### 2. **Example Implementation**

Updated `backend/addCase.js` as an example of how to use the middleware.

**Before (Insecure):**
```javascript
router.post("/", async (req, res) => {
  const role = req.headers["x-role"];  // ❌ Can be spoofed!
  const userCode = req.headers["x-user-code"]; // ❌ Can be spoofed!
  // ...
});
```

**After (Secure):**
```javascript
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post("/", 
  authenticateToken, 
  requireRole(['admin', 'chief-judge']), 
  async (req, res) => {
    const role = req.user.role;      // ✅ From verified token
    const userCode = req.user.code;  // ✅ From verified token
    // ...
  }
);
```

## 🔄 Migration Required

### Backend Routes to Update

The following routes need to be updated to use the new middleware:

**High Priority (Admin Functions):**
- ✅ `addCase.js` - Already updated as example
- ⏳ `registerUser.js` - Needs `requireRole(['admin'])`
- ⏳ `deleteUser.js` - Needs `requireRole(['admin'])`
- ⏳ `updateUser.js` - Needs `requireRole(['admin'])`
- ⏳ `deleteCase.js` - Needs `requireRole(['admin', 'chief-judge'])`
- ⏳ `updateCase.js` - Needs `requireRole(['admin', 'chief-judge'])`

**Judge Routes:**
- ⏳ `judgeCases.js` - Needs `requireRole(['judge'])`
- ⏳ `judgePendingTranscript.js` - Needs `requireRole(['judge'])`
- ⏳ `judgeReviewTranscript.js` - Needs `requireRole(['judge'])`
- ⏳ `judgeApproveTranscript.js` - Needs `requireRole(['judge'])`
- ⏳ `judgeApproveOrdersheet.js` - Needs `requireRole(['judge'])`

**Stenographer Routes:**
- ⏳ `stenoHearing.js` - Needs `requireRole(['stenographer'])`
- ⏳ `saveTranscript.js` - Needs `requireRole(['stenographer'])`
- ⏳ `stenoSaveOrdersheet.js` - Needs `requireRole(['stenographer'])`

**Chief Judge Routes:**
- ⏳ `cjcases.js` - Needs `requireRole(['chief-judge'])`
- ⏳ `chiefJudgeAddCourt.js` - Needs `requireRole(['chief-judge'])`

### Frontend Changes Required

**1. Update Login to Store Token:**

```javascript
// In Login.jsx - after successful login
const response = await fetch(`${API_BASE_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, role }),
});

const data = await response.json();

if (data.success) {
  // Store token instead of just user data
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("access_token", data.session.access_token); // ✅ Store token
  localStorage.setItem("refresh_token", data.session.refresh_token);
}
```

**2. Create API Helper Function:**

Create `vite-project/src/api.js`:
```javascript
import { API_BASE_URL } from './config';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add token to headers if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    // Token expired - redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/';
    return;
  }
  
  return response.json();
}
```

**3. Update All API Calls:**

**Before:**
```javascript
fetch(`${API_BASE_URL}/add-case`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-role": user.role,
    "x-user-code": user.id
  },
  body: JSON.stringify(formData)
});
```

**After:**
```javascript
import { apiRequest } from './api';

apiRequest('/add-case', {
  method: "POST",
  body: JSON.stringify(formData)
});
```

## 🔒 Security Improvements

### Before (Insecure)
- ❌ Headers can be spoofed by anyone
- ❌ No token validation
- ❌ No expiration checking
- ❌ Roles trusted from client

### After (Secure)
- ✅ Tokens cryptographically signed by Supabase
- ✅ Tokens validated on every request
- ✅ Tokens expire automatically
- ✅ Roles verified against database
- ✅ Cannot be spoofed

## 📋 Implementation Steps

### Phase 1: Backend Middleware (✅ Done)
1. ✅ Create authentication middleware
2. ✅ Update one route as example (`addCase.js`)
3. ⏳ Update remaining routes gradually

### Phase 2: Frontend Updates (⏳ Pending)
1. ⏳ Update login to store tokens
2. ⏳ Create API helper function
3. ⏳ Update all API calls to use tokens
4. ⏳ Remove header-based auth from frontend

### Phase 3: Testing (⏳ Pending)
1. ⏳ Test authentication flow
2. ⏳ Test role-based access
3. ⏳ Test token expiration
4. ⏳ Test error handling

## 🚨 Important Notes

1. **Gradual Migration**: You can use `authenticateOptional` middleware for routes that need to support both methods during migration

2. **Token Storage**: Store tokens securely in localStorage (or better: httpOnly cookies in production)

3. **Token Refresh**: Implement token refresh logic when tokens expire

4. **Error Handling**: Handle 401 errors by redirecting to login

## 📚 Documentation

- `backend/middleware/README.md` - Complete middleware documentation
- `backend/middleware/auth.js` - Middleware implementation

## Status

✅ **Middleware Created**
✅ **Example Route Updated** (`addCase.js`)
⏳ **Remaining Routes Need Update**
⏳ **Frontend Needs Update**

## Next Steps

1. Update remaining backend routes to use middleware
2. Update frontend to use tokens instead of headers
3. Test authentication flow
4. Remove header-based auth once migration is complete


