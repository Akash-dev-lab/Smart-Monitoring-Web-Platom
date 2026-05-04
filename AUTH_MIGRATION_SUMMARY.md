# Authentication Migration: localStorage JWT → HTTP-only Cookies

## Overview
Successfully migrated from localStorage-based JWT authentication to HTTP-only cookie-based authentication for enhanced security.

## Backend Changes

### 1. **Installed cookie-parser**
```bash
npm install cookie-parser
```

### 2. **Updated `backend/src/app.js`**
- Added `cookie-parser` middleware
- Already had `credentials: true` in CORS config ✓

### 3. **Updated `backend/src/modules/auth/auth.controller.js`**
- **Login**: Sets `accessToken` and `refreshToken` as HTTP-only cookies
- **Refresh**: Reads refresh token from cookies, sets new access token cookie
- **Logout**: Clears both cookies
- Returns only user info (no tokens in response body)

### 4. **Updated `backend/src/modules/auth/auth.middleware.js`**
- Changed from reading `Authorization` header to reading `accessToken` from cookies
- Validates JWT from cookie

## Frontend Changes

### 1. **Installed axios**
```bash
npm install axios
```

### 2. **Created `frontend/src/services/axiosInstance.js`**
- Configured axios with `withCredentials: true`
- Added response interceptor for automatic token refresh on 401 errors
- Redirects to `/signin` if refresh fails

### 3. **Updated `frontend/src/services/authApi.js`**
- Migrated from `fetch` to `axios`
- Removed localStorage token storage
- Only stores user info in localStorage (not tokens)
- Added helper functions: `getCurrentUser()`, `setCurrentUser()`

### 4. **Updated `frontend/src/services/monitorApi.js`**
- Migrated from `fetch` to `axios`
- Uses `axiosInstance` with credentials

### 5. **Updated `frontend/src/services/logApi.js`**
- Migrated from `fetch` to `axios`
- Uses `axiosInstance` with credentials

### 6. **Updated `frontend/src/services/dashboardApi.js`**
- Migrated from `fetch` to `axios`
- Uses `axiosInstance` with credentials

### 7. **Updated `frontend/src/pages/auth/SignInPage.jsx`**
- Removed localStorage token storage
- Only stores user info via `setCurrentUser()`
- Improved error handling with axios error format

### 8. **Updated `frontend/src/pages/auth/SignUpPage.jsx`**
- Improved error handling with axios error format
- Email normalization (trim + lowercase)

### 9. **Updated `frontend/src/pages/auth/ProtectedRoute.jsx`**
- Implemented proper authentication check
- Redirects to `/signin` if no user found

## Security Improvements

### Before (localStorage)
- ❌ Tokens accessible via JavaScript
- ❌ Vulnerable to XSS attacks
- ❌ Manual token management required

### After (HTTP-only Cookies)
- ✅ Tokens inaccessible to JavaScript
- ✅ Protected from XSS attacks
- ✅ Automatic token sending with requests
- ✅ Automatic token refresh on 401 errors
- ✅ Secure flag in production
- ✅ SameSite protection

## Cookie Configuration

```javascript
{
  httpOnly: true,                              // Not accessible via JavaScript
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict",                          // CSRF protection
  maxAge: 60 * 60 * 1000                       // 1 hour for access token
}
```

## Token Refresh Flow

1. User makes authenticated request
2. If 401 error received:
   - Axios interceptor automatically calls `/auth/refresh`
   - Backend reads `refreshToken` from cookie
   - Backend sets new `accessToken` cookie
   - Original request is retried
3. If refresh fails:
   - User is redirected to `/signin`
   - User info cleared from localStorage

## Testing Checklist

- [ ] Sign up new user
- [ ] Sign in with credentials
- [ ] Access protected routes (dashboard)
- [ ] Token refresh on 401 (wait 1 hour or manually expire token)
- [ ] Logout clears cookies
- [ ] Protected routes redirect to signin when not authenticated
- [ ] All API calls (monitors, logs, dashboard) work with cookies

## Environment Variables

Ensure these are set in backend `.env`:
```
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
NODE_ENV=development  # or production
FRONTEND_URL=http://localhost:5173
```

## Next Steps

1. **Restart backend server** to load cookie-parser
2. **Clear browser cookies** from previous localStorage implementation
3. **Test complete auth flow** (signup → signin → dashboard → logout)
4. **Monitor browser DevTools** → Application → Cookies to verify HTTP-only cookies

## Production Considerations

- ✅ Cookies set with `secure: true` in production (HTTPS only)
- ✅ SameSite protection enabled
- ✅ Short-lived access tokens (1 hour)
- ✅ Longer refresh tokens (7 days)
- ⚠️ Ensure backend and frontend are on same domain or proper CORS setup
- ⚠️ Consider adding CSRF tokens for additional protection
