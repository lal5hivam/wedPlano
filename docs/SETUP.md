# Wedplano Setup Guide

Complete step-by-step guide to set up Wedplano locally.

## Prerequisites

- Node.js 16+ and npm installed
- Git installed
- A Firebase account (free)
- A Cloudinary account (free)
- A code editor (VS Code recommended)

## Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `wedplano` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Firestore Database

1. In Firebase Console, go to "Build" → "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location (choose closest to you)
5. Click "Enable"

### 1.3 Create Service Account

1. Go to Project Settings (gear icon) → "Service accounts"
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. Keep this file safe - you'll need it for environment variables

### 1.4 Firestore Security Rules (Optional for Development)

For development, you can use permissive rules. In Firestore → Rules tab:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**WARNING:** For production, implement proper security rules!

## Step 2: Cloudinary Setup

### 2.1 Create Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### 2.2 Get Credentials

1. Go to Dashboard
2. You'll see:
   - Cloud Name
   - API Key
   - API Secret
3. Copy these values - you'll need them for `.env`

## Step 3: Backend Setup

### 3.1 Navigate to Backend Directory

```bash
cd wedplano/backend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Create Environment File

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

### 3.4 Configure Environment Variables

Open `.env` and fill in the values:

```env
PORT=5000
NODE_ENV=development

# JWT Secret - generate a random string
JWT_SECRET=your_super_secret_random_string_here_make_it_long
JWT_EXPIRES_IN=7d

# Firebase - from the JSON file you downloaded
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=abc123...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Cloudinary - from your Cloudinary dashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- For `JWT_SECRET`, use a long random string (at least 32 characters)
- For `FIREBASE_PRIVATE_KEY`, copy the entire private key from the JSON file including `\n` characters
- Make sure the private key is wrapped in double quotes

### 3.5 Start Backend Server

```bash
npm run dev
```

You should see:
```
Wedplano API running on http://localhost:5000
Swagger docs: http://localhost:5000/api/docs
```

### 3.6 Test Backend

Open browser and go to:
- Health check: http://localhost:5000/health
- API docs: http://localhost:5000/api/docs

## Step 4: Frontend Setup

### 4.1 Open New Terminal

Keep the backend running, open a new terminal window.

### 4.2 Navigate to Frontend Directory

```bash
cd wedplano/frontend
```

### 4.3 Install Dependencies

```bash
npm install
```

### 4.4 Start Frontend Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4.5 Open Application

Open browser and go to: http://localhost:5173/

## Step 5: Test the Application

### 5.1 Create a Venue Partner Account

1. Click "Sign Up"
2. Select "Venue Partner"
3. Fill in details:
   - Name: Test Partner
   - Email: partner@test.com
   - Password: test123
4. Click "Sign Up"

### 5.2 Create a Venue

1. You'll be redirected to Partner Dashboard
2. Click "+ Add Venue"
3. Fill in venue details:
   - Title: Grand Banquet Hall
   - City: Mumbai
   - Address: 123 Main Street
   - Capacity: 500
   - Base Price: 50000
   - Per Guest Price: 500
   - Venue Type: Banquet Hall
   - Amenities: Parking, AC, WiFi
4. Click "Create Venue"

### 5.3 Add Services

1. After creating venue, you'll see "Services & Pricing" section
2. Add services:
   - Service: Catering (Veg), Unit: plate, Price: 500
   - Service: Decoration, Unit: package, Price: 25000
   - Service: Photography, Unit: hour, Price: 5000
3. Click "+ Add Service" for each

### 5.4 Set Availability

1. In "Availability" section
2. Add dates (comma-separated):
   ```
   2024-12-25, 2024-12-26, 2024-12-31, 2025-01-01
   ```
3. Click "Set Availability"

### 5.5 Create a Customer Account

1. Logout (top right)
2. Click "Sign Up"
3. Select "Customer"
4. Fill in details:
   - Name: Test User
   - Email: user@test.com
   - Password: test123
5. Click "Sign Up"

### 5.6 Make a Booking

1. Click "Venues" in navbar
2. Click on "Grand Banquet Hall"
3. Click "Book This Venue"
4. Fill in booking form:
   - Select Date: 2024-12-25
   - Guest Count: 200
   - Food Type: Vegetarian
   - Select services (check boxes and set quantities)
5. Review billing summary
6. Click "Submit Booking Request"

### 5.7 Accept Booking (as Partner)

1. Logout and login as partner (partner@test.com)
2. Go to Partner Dashboard
3. You'll see the booking request
4. Click "Accept"
5. Booking is now confirmed!

## Troubleshooting

### Backend won't start

**Error: Firebase credentials invalid**
- Check that all Firebase environment variables are correct
- Ensure `FIREBASE_PRIVATE_KEY` includes `\n` characters
- Verify the private key is wrapped in double quotes

**Error: Port 5000 already in use**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update `vite.config.js` proxy target accordingly

### Frontend won't start

**Error: Cannot connect to backend**
- Ensure backend is running on port 5000
- Check `vite.config.js` proxy configuration

**Error: Module not found**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Cloudinary upload fails

**Error: Invalid credentials**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`
- Check for typos or extra spaces

### Firestore permission denied

**Error: Missing or insufficient permissions**
- Check Firestore security rules
- For development, use permissive rules (see Step 1.4)
- Ensure Firebase service account has proper permissions

## Next Steps

- Read [API.md](API.md) for complete API documentation
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize the application for your needs
- Implement proper Firestore security rules for production

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes auto-refresh in browser
- Backend: Using nodemon, server restarts on file changes

### Debugging

**Backend logs:**
- Check terminal where backend is running
- Errors are logged to console

**Frontend logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Database Inspection

View Firestore data:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Browse collections: users, venues, bookingRequests, etc.

### API Testing

Use Swagger UI:
- Go to http://localhost:5000/api/docs
- Test endpoints directly from browser
- See request/response examples

Or use Postman:
1. Import endpoints from Swagger
2. Set Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Test all endpoints

## Common Development Workflows

### Adding a New Feature

1. Backend: Create controller, route, and update Swagger docs
2. Frontend: Create component/page and connect to API
3. Test thoroughly
4. Update documentation

### Modifying Database Schema

1. Update Firestore documents in controllers
2. Update frontend data models
3. Consider migration for existing data

### Changing Billing Logic

1. Modify `backend/src/services/billing.service.js`
2. Update frontend billing preview in `VenueDetail.jsx`
3. Test with various scenarios

## Support

If you encounter issues:
1. Check this guide carefully
2. Review error messages
3. Check Firebase and Cloudinary dashboards
4. Verify all environment variables
5. Open a GitHub issue with details
