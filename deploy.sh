#!/bin/bash

# Wedplano Deployment Script
# This script helps deploy the backend to Railway and frontend to Netlify

set -e

echo "🚀 Wedplano Deployment Script"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if CLIs are installed
check_cli() {
    if ! command -v railway &> /dev/null; then
        echo -e "${RED}❌ Railway CLI not found${NC}"
        echo "Install: npm install -g @railway/cli"
        exit 1
    fi
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${RED}❌ Netlify CLI not found${NC}"
        echo "Install: npm install -g netlify-cli"
        exit 1
    fi
    
    echo -e "${GREEN}✓ CLIs installed${NC}"
}

# Deploy backend
deploy_backend() {
    echo ""
    echo "📦 Deploying Backend to Railway..."
    echo "================================"
    
    cd backend
    
    # Check if logged in
    if ! railway whoami &> /dev/null; then
        echo -e "${YELLOW}Please login to Railway:${NC}"
        railway login
    fi
    
    # Deploy
    echo "Deploying..."
    railway up
    
    # Get domain
    echo ""
    echo -e "${GREEN}✓ Backend deployed!${NC}"
    echo "Getting domain..."
    BACKEND_URL=$(railway domain)
    echo -e "${GREEN}Backend URL: $BACKEND_URL${NC}"
    
    cd ..
    
    # Save backend URL for frontend
    echo "$BACKEND_URL" > .backend-url
}

# Deploy frontend
deploy_frontend() {
    echo ""
    echo "🎨 Deploying Frontend to Netlify..."
    echo "================================"
    
    cd frontend
    
    # Check if logged in
    if ! netlify status &> /dev/null; then
        echo -e "${YELLOW}Please login to Netlify:${NC}"
        netlify login
    fi
    
    # Get backend URL
    if [ -f "../.backend-url" ]; then
        BACKEND_URL=$(cat ../.backend-url)
        echo "Using backend URL: $BACKEND_URL"
        echo "VITE_API_URL=${BACKEND_URL}/api" > .env.production
    else
        echo -e "${YELLOW}⚠ Backend URL not found. Please update .env.production manually${NC}"
    fi
    
    # Install and build
    echo "Installing dependencies..."
    npm install
    
    echo "Building..."
    npm run build
    
    # Deploy
    echo "Deploying..."
    netlify deploy --prod
    
    echo ""
    echo -e "${GREEN}✓ Frontend deployed!${NC}"
    
    cd ..
}

# Update CORS
update_cors() {
    echo ""
    echo "🔧 Updating CORS Configuration..."
    echo "================================"
    
    echo -e "${YELLOW}Please update FRONTEND_URL in Railway:${NC}"
    echo "1. Get your Netlify URL from the deployment output above"
    echo "2. Run: cd backend && railway variables set FRONTEND_URL=\"https://your-site.netlify.app\""
    echo ""
    echo "Or update via Railway Dashboard:"
    echo "https://railway.app/dashboard"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to deploy?"
    echo "1) Backend only (Railway)"
    echo "2) Frontend only (Netlify)"
    echo "3) Both (Backend then Frontend)"
    echo "4) Exit"
    echo ""
    read -p "Enter choice [1-4]: " choice
    
    case $choice in
        1)
            check_cli
            deploy_backend
            ;;
        2)
            check_cli
            deploy_frontend
            ;;
        3)
            check_cli
            deploy_backend
            deploy_frontend
            update_cors
            ;;
        4)
            echo "Goodbye!"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            show_menu
            ;;
    esac
}

# Run
check_cli
show_menu

echo ""
echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update FRONTEND_URL in Railway with your Netlify URL"
echo "2. Add domains to Firebase authorized domains"
echo "3. Add domains to Cloudinary allowed origins"
echo "4. Test your deployment"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
