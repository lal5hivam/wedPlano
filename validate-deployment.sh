#!/bin/bash

# Pre-deployment validation script
# Checks that all required environment variables and configurations are in place

set -e

echo "🔍 Starting pre-deployment validation..."

# Check backend environment
echo ""
echo "📋 Checking backend environment..."
cd wedplano/backend

REQUIRED_VARS=(
  "JWT_SECRET"
  "FIREBASE_PROJECT_ID"
  "FIREBASE_PRIVATE_KEY_ID"
  "FIREBASE_PRIVATE_KEY"
  "FIREBASE_CLIENT_EMAIL"
  "FIREBASE_CLIENT_ID"
  "CLOUDINARY_CLOUD_NAME"
  "CLOUDINARY_API_KEY"
  "CLOUDINARY_API_SECRET"
  "FRONTEND_URL"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    MISSING_VARS+=("$var")
  fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
  echo "❌ Missing backend environment variables:"
  printf '  - %s\n' "${MISSING_VARS[@]}"
  exit 1
fi

# Validate JWT_SECRET length
if [ ${#JWT_SECRET} -lt 32 ]; then
  echo "❌ JWT_SECRET must be at least 32 characters long (current: ${#JWT_SECRET})"
  exit 1
fi

echo "✅ Backend environment variables validated"

# Check backend dependencies
echo ""
echo "📋 Checking backend dependencies..."
if ! npm list > /dev/null 2>&1; then
  echo "❌ Backend dependencies not installed. Run: npm install"
  exit 1
fi
echo "✅ Backend dependencies installed"

# Check frontend environment
echo ""
echo "📋 Checking frontend environment..."
cd ../frontend

if [ -z "$VITE_API_URL" ]; then
  echo "⚠️  VITE_API_URL not set. Frontend will use /api proxy."
fi

echo "✅ Frontend environment checked"

# Check frontend dependencies
echo ""
echo "📋 Checking frontend dependencies..."
if ! npm list > /dev/null 2>&1; then
  echo "❌ Frontend dependencies not installed. Run: npm install"
  exit 1
fi
echo "✅ Frontend dependencies installed"

# Check build
echo ""
echo "📋 Building frontend..."
if ! npm run build > /dev/null 2>&1; then
  echo "❌ Frontend build failed"
  exit 1
fi
echo "✅ Frontend build successful"

cd ../..

echo ""
echo "✅ All pre-deployment checks passed!"
echo ""
echo "Next steps:"
echo "1. Review the deployment configuration in railway.toml and netlify.toml"
echo "2. Ensure all environment variables are set in your deployment platform"
echo "3. Run: npm run deploy (from wedplano/backend) and npm run deploy (from wedplano/frontend)"
