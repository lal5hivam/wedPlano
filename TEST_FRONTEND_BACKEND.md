# Frontend-Backend Integration Test

## Setup Complete ✓

**Frontend Dev Server:** http://localhost:5174/
**Backend Production:** https://wedplano-production.up.railway.app/api

## Test Steps

### 1. Health Check
Test that the backend is accessible:
```bash
curl https://wedplano-production.up.railway.app/health
```

Expected response:
```json
{"status":"ok","service":"Wedplano API"}
```

### 2. Open Frontend in Browser
Navigate to: http://localhost:5174/

### 3. Test Authentication Flow

#### Test Registration (User)
1. Click "Sign Up" or navigate to signup page
2. Fill in the form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPassword123 (must have uppercase, lowercase, number)
   - Phone: +1234567890
3. Click "Register"
4. Expected: User is created and logged in, redirected to dashboard

#### Test Registration (Partner)
1. Click "Partner Sign Up" or navigate to partner signup
2. Fill in the form:
   - Name: Test Partner
   - Email: testpartner@example.com
   - Password: PartnerPass123
   - Phone: +0987654321
3. Click "Register"
4. Expected: Partner is created and logged in

#### Test Login
1. Logout if logged in
2. Navigate to login page
3. Enter credentials:
   - Email: testuser@example.com
   - Password: TestPassword123
4. Click "Login"
5. Expected: User is logged in and redirected to dashboard

### 4. Test API Calls

Open browser DevTools (F12) and check the Network tab:

#### Check API Requests
1. After login, look for API calls in Network tab
2. Verify requests go to: `https://wedplano-production.up.railway.app/api/...`
3. Check response status is 200 (success)
4. Verify response contains expected data

#### Common API Endpoints to Test
- `GET /api/auth/me` - Get current user (should work after login)
- `GET /api/venues` - List venues
- `GET /api/dashboard` - Get dashboard data (partner only)

### 5. Test Error Handling

#### Test Invalid Credentials
1. Go to login page
2. Enter wrong password
3. Expected: Error message "Invalid credentials"

#### Test Weak Password
1. Go to signup page
2. Try password: "weak"
3. Expected: Error message "Password must contain uppercase, lowercase, and numbers"

#### Test Duplicate Email
1. Try to register with an email that already exists
2. Expected: Error message "Email already registered"

### 6. Test CORS

If you see CORS errors in browser console:
```
Access to XMLHttpRequest at 'https://wedplano-production.up.railway.app/api/...' 
from origin 'http://localhost:5174' has been blocked by CORS policy
```

This means CORS is not configured correctly. Check:
1. Backend `FRONTEND_URL` environment variable includes `http://localhost:5174`
2. Backend `NODE_ENV` is set correctly
3. Restart backend after changing environment variables

### 7. Test File Upload (if applicable)

If your app has file upload:
1. Try uploading an image (JPEG, PNG, or WebP)
2. Expected: File is uploaded to Cloudinary
3. Check browser Network tab for upload request

If upload fails:
- Check file size (max 10MB)
- Check file type (only JPEG, PNG, WebP allowed)
- Verify Cloudinary credentials are set

### 8. Monitor Console for Errors

Keep browser DevTools open and watch for:
- JavaScript errors (red X)
- Network errors (red status codes)
- CORS errors
- 401 Unauthorized errors (auth issues)

## Troubleshooting

### Frontend won't load
- Check that Vite dev server is running: `npm run dev` in `wedplano/frontend`
- Check port 5174 is accessible
- Clear browser cache (Ctrl+Shift+Delete)

### API calls failing with 401
- User is not authenticated
- Token might be expired
- Try logging in again

### API calls failing with 403
- User doesn't have permission for this action
- Check user role (user vs partner)

### API calls failing with 404
- Endpoint doesn't exist
- Check API URL is correct
- Verify backend is running

### API calls failing with 500
- Backend error
- Check Railway logs: `railway logs`
- Check backend error middleware output

### CORS errors
- Backend CORS not configured for localhost:5174
- Add `http://localhost:5174` to backend `FRONTEND_URL`
- Restart backend

### File upload fails
- Check file size (max 10MB)
- Check file type (JPEG, PNG, WebP only)
- Check Cloudinary credentials

## Performance Testing

### Check Bundle Size
```bash
cd wedplano/frontend
npm run build
```

Check the output for bundle size. Should be reasonable (< 500KB for main bundle).

### Check Network Performance
1. Open DevTools Network tab
2. Throttle to "Slow 3G" or "Fast 3G"
3. Reload page
4. Check that app still loads and is usable

### Check API Response Times
1. Open DevTools Network tab
2. Look at "Time" column for API requests
3. Should be < 1 second for most requests
4. If > 2 seconds, there might be performance issues

## Success Criteria

✓ Frontend loads without errors
✓ User can register (both user and partner)
✓ User can login with correct credentials
✓ User cannot login with wrong credentials
✓ API calls reach the production backend
✓ No CORS errors
✓ No JavaScript errors in console
✓ File uploads work (if applicable)
✓ Dashboard loads with data
✓ Logout works and clears auth state

## Next Steps

If all tests pass:
1. Deploy frontend to Netlify: `npm run deploy`
2. Set up monitoring and error tracking
3. Configure production environment variables
4. Set up automated backups
5. Monitor logs regularly

If tests fail:
1. Check error messages in browser console
2. Check backend logs in Railway dashboard
3. Verify environment variables are set correctly
4. Check CORS configuration
5. Review API responses in Network tab
