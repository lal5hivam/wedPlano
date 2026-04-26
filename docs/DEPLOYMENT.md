# Wedplano Deployment Guide

Guide for deploying Wedplano to production.

## Overview

This guide covers deploying:
- Backend API to a Node.js hosting service
- Frontend to a static hosting service
- Database (Firestore) - already cloud-hosted
- Media storage (Cloudinary) - already cloud-hosted

## Recommended Hosting Options

### Backend
- **Render** (Free tier available)
- **Railway** (Free tier available)
- **Heroku** (Paid)
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

### Frontend
- **Vercel** (Free tier, recommended)
- **Netlify** (Free tier)
- **GitHub Pages**
- **Cloudflare Pages**

## Pre-Deployment Checklist

- [ ] Firebase project set up and Firestore enabled
- [ ] Cloudinary account configured
- [ ] All environment variables documented
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] Production Firestore security rules ready
- [ ] Domain name (optional)

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure `package.json` has start script:
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

2. Create `.gitignore` in backend folder:
```
node_modules/
.env
.DS_Store
```

3. Push code to GitHub repository

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repository

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name:** wedplano-api
   - **Region:** Choose closest to your users
   - **Branch:** main
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### Step 4: Add Environment Variables

In Render dashboard, add all environment variables:

```
PORT=5000
NODE_ENV=production
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

**Important:** Use a strong, unique JWT_SECRET for production!

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API will be available at: `https://wedplano-api.onrender.com`

### Step 6: Test Backend

Test health endpoint:
```bash
curl https://wedplano-api.onrender.com/health
```

Should return:
```json
{"status":"ok","service":"Wedplano API"}
```

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update `src/utils/api.js` to use production API:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});
```

2. Create `.env.production` in frontend folder:
```
VITE_API_URL=https://wedplano-api.onrender.com/api
```

3. Create `vercel.json` in frontend folder:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

4. Update `.gitignore`:
```
node_modules/
dist/
.env
.env.production
.DS_Store
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 3: Deploy

1. Click "Add New..." → "Project"
2. Import your repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
4. Add environment variable:
   - `VITE_API_URL` = `https://wedplano-api.onrender.com/api`
5. Click "Deploy"

### Step 4: Update Backend CORS

Update backend `.env` on Render:
```
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend for changes to take effect.

### Step 5: Test Frontend

1. Visit your Vercel URL
2. Test registration and login
3. Test venue browsing
4. Test booking flow

## Production Firestore Security Rules

Replace permissive development rules with production rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if true; // Allow registration
      allow update, delete: if isOwner(userId);
    }
    
    // Venues collection
    match /venues/{venueId} {
      allow read: if true; // Public read
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && 
        resource.data.ownerId == request.auth.uid;
    }
    
    // Venue services
    match /venueServices/{serviceId} {
      allow read: if true;
      allow write: if isSignedIn();
    }
    
    // Availability
    match /availability/{availId} {
      allow read: if true;
      allow write: if isSignedIn();
    }
    
    // Booking requests
    match /bookingRequests/{requestId} {
      allow read: if isSignedIn() && (
        resource.data.userId == request.auth.uid ||
        resource.data.ownerId == request.auth.uid
      );
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (
        resource.data.userId == request.auth.uid ||
        resource.data.ownerId == request.auth.uid
      );
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if isSignedIn() && (
        resource.data.userId == request.auth.uid ||
        resource.data.ownerId == request.auth.uid
      );
      allow write: if isSignedIn();
    }
    
    // Notifications
    match /notifications/{notifId} {
      allow read, update: if isSignedIn() && 
        resource.data.userId == request.auth.uid;
      allow create: if isSignedIn();
    }
  }
}
```

Apply rules in Firebase Console → Firestore → Rules tab.

## Custom Domain (Optional)

### For Backend (Render)

1. Go to Render dashboard → Settings
2. Add custom domain: `api.yourdomain.com`
3. Add CNAME record in your DNS:
   - Name: `api`
   - Value: `wedplano-api.onrender.com`
4. Wait for SSL certificate (automatic)

### For Frontend (Vercel)

1. Go to Vercel dashboard → Settings → Domains
2. Add domain: `yourdomain.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Environment-Specific Configuration

### Development
```
API: http://localhost:5000
Frontend: http://localhost:5173
```

### Production
```
API: https://wedplano-api.onrender.com
Frontend: https://wedplano.vercel.app
```

## Monitoring and Maintenance

### Backend Monitoring

**Render Dashboard:**
- View logs
- Monitor CPU/memory usage
- Check deployment status
- View metrics

**Set up alerts:**
1. Render → Settings → Notifications
2. Add email for deployment failures

### Frontend Monitoring

**Vercel Dashboard:**
- View deployment logs
- Monitor bandwidth usage
- Check build status
- Analytics (optional)

### Database Monitoring

**Firebase Console:**
- Monitor read/write operations
- Check storage usage
- View security rule violations
- Set up budget alerts

### Media Storage Monitoring

**Cloudinary Dashboard:**
- Monitor storage usage
- Check bandwidth
- View transformation usage
- Set up usage alerts

## Performance Optimization

### Backend

1. **Enable compression:**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add caching headers:**
```javascript
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
});
```

3. **Optimize Firestore queries:**
- Use indexes for complex queries
- Limit result sets
- Use pagination

### Frontend

1. **Code splitting:**
Already handled by Vite

2. **Image optimization:**
Use Cloudinary transformations:
```javascript
const optimizedUrl = `${imageUrl}?w=800&q=auto&f=auto`;
```

3. **Lazy loading:**
```javascript
const VenueDetail = lazy(() => import('./pages/VenueDetail'));
```

## Backup Strategy

### Firestore Backup

1. Enable automated backups:
   - Firebase Console → Firestore → Backups
   - Schedule daily backups
   - Set retention period

2. Manual export:
```bash
gcloud firestore export gs://your-bucket/backups
```

### Code Backup

- Use Git for version control
- Push to GitHub regularly
- Tag releases

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use different secrets for dev/prod
   - Rotate secrets periodically

2. **API Security:**
   - Rate limiting enabled
   - Helmet.js for security headers
   - CORS properly configured
   - Input validation on all endpoints

3. **Authentication:**
   - Strong JWT secrets
   - Secure password hashing (bcrypt)
   - Token expiration enforced

4. **Database:**
   - Production security rules
   - Regular security audits
   - Monitor for suspicious activity

## Troubleshooting

### Backend Issues

**Deployment fails:**
- Check build logs in Render
- Verify all dependencies in package.json
- Ensure Node version compatibility

**API not responding:**
- Check Render logs
- Verify environment variables
- Test health endpoint

**Database connection fails:**
- Verify Firebase credentials
- Check Firestore security rules
- Ensure service account has permissions

### Frontend Issues

**Build fails:**
- Check Vercel build logs
- Verify all imports
- Check for TypeScript errors

**API calls fail:**
- Verify VITE_API_URL is correct
- Check CORS configuration
- Inspect network tab in DevTools

**Routing issues:**
- Ensure vercel.json is configured
- Check React Router setup

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Response time > 1 second
- CPU usage > 80%
- Memory usage > 80%
- Error rate > 1%

### Scaling Options

**Backend:**
- Upgrade Render instance type
- Add horizontal scaling (multiple instances)
- Implement caching (Redis)
- Use CDN for static assets

**Database:**
- Firestore scales automatically
- Optimize queries and indexes
- Consider sharding for very large datasets

**Frontend:**
- Vercel scales automatically
- Use CDN (built-in)
- Implement service workers for offline support

## Cost Estimation

### Free Tier (Development/Small Projects)

- **Render:** Free tier (sleeps after inactivity)
- **Vercel:** Free tier (100GB bandwidth/month)
- **Firebase:** Free tier (50K reads, 20K writes/day)
- **Cloudinary:** Free tier (25GB storage, 25GB bandwidth/month)

**Total:** $0/month

### Paid Tier (Production)

- **Render:** $7/month (always-on)
- **Vercel:** $20/month (Pro plan)
- **Firebase:** ~$25/month (Blaze plan, estimated)
- **Cloudinary:** $0-89/month (based on usage)

**Total:** ~$52-141/month

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] All environment variables configured
- [ ] CORS configured correctly
- [ ] Firestore security rules applied
- [ ] SSL certificates active
- [ ] Test user registration
- [ ] Test venue creation
- [ ] Test booking flow
- [ ] Test notifications
- [ ] Monitor logs for errors
- [ ] Set up monitoring alerts
- [ ] Document production URLs
- [ ] Share with stakeholders

## Support

For deployment issues:
- Check service status pages
- Review documentation
- Contact support (Render, Vercel, Firebase)
- Open GitHub issue for code-related problems
