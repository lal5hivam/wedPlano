# Quick Test Guide - Frontend + Production Backend

## Setup Complete ✓

**Frontend Dev Server:** http://localhost:5174/
**Backend Production:** https://wedplano-production.up.railway.app/
**Proxy:** Vite dev server proxies `/api` requests to production backend

## How It Works

1. Frontend makes request to `http://localhost:5174/api/auth/login`
2. Vite dev server intercepts the request
3. Vite proxies it to `https://wedplano-production.up.railway.app/api/auth/login`
4. Response comes back through the proxy (no CORS issues)

## Test Steps

### 1. Open Frontend
Navigate to: **http://localhost:5174/**

### 2. Test Registration
1. Click "Sign Up" or go to signup page
2. Fill in form:
   - **Name:** Test User
   - **Email:** testuser@example.com
   - **Password:** TestPassword123 (must have uppercase, lowercase, number)
   - **Phone:** +1234567890
3. Click "Register"
4. Expected: User created and logged in

### 3. Test Login
1. Logout if logged in
2. Go to login page
3. Enter:
   - **Email:** testuser@example.com
   - **Password:** TestPassword123
4. Click "Login"
5. Expected: Logged in successfully

### 4. Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Try any action (login, register, etc.)
4. Look for API requests
5. Expected: Requests show as `http://localhost:5174/api/...` in the URL bar
6. But they're actually proxied to the production backend

### 5. Test Error Handling
- Try wrong password → Should see "Invalid credentials"
- Try weak password → Should see password complexity error
- Try duplicate email → Should see "Email already registered"

## Troubleshooting

### Frontend won't load
```bash
# Check if dev server is running
npm run dev
# Should show: ➜  Local:   http://localhost:5174/
```

### API requests still failing
1. Check browser console (F12) for errors
2. Check Network tab to see actual request/response
3. Verify backend is running: https://wedplano-production.up.railway.app/health
4. Check that proxy is configured in vite.config.js

### CORS errors still appearing
- This shouldn't happen with the proxy
- If it does, check that vite.config.js has the proxy configured
- Restart dev server: `npm run dev`

### Backend returning 500 errors
- Check Railway logs
- Verify all environment variables are set
- Check that Firebase and Cloudinary are configured

## Next Steps

Once testing is complete:

1. **Deploy Frontend to Netlify**
   ```bash
   npm run deploy
   ```

2. **Update Backend FRONTEND_URL**
   - Add your Netlify domain to Railway environment variables
   - Format: `http://localhost:5173,http://localhost:5174,https://your-netlify-domain.netlify.app`

3. **Test Production Deployment**
   - Visit your Netlify domain
   - Verify it connects to production backend
   - Test full flow

## Environment Variables

### Frontend (.env.development)
```
VITE_API_URL=/api
```
This tells frontend to use the `/api` proxy.

### Frontend (.env.production)
```
VITE_API_URL=https://wedplano-production.up.railway.app/api
```
This is used when deployed to Netlify.

### Backend (Railway)
```
FRONTEND_URL=http://localhost:5173,http://localhost:5174,https://your-netlify-domain.netlify.app
NODE_ENV=production
```
This tells backend which origins are allowed.

## Performance Notes

- Proxy adds minimal latency (usually < 50ms)
- All requests go through Vite dev server
- Perfect for development and testing
- Not suitable for production (use direct API URL in production)

## Success Criteria

✓ Frontend loads without errors
✓ Can register new user
✓ Can login with credentials
✓ API requests reach production backend
✓ No CORS errors
✓ No JavaScript errors in console
✓ Dashboard loads with data
