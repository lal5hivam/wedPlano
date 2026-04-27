# Wedplano Deployment Script (PowerShell)
# This script helps deploy the backend to Railway and frontend to Netlify

$ErrorActionPreference = "Stop"

Write-Host "🚀 Wedplano Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if CLIs are installed
function Check-CLI {
    $railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
    $netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue
    
    if (-not $railwayInstalled) {
        Write-Host "❌ Railway CLI not found" -ForegroundColor Red
        Write-Host "Install: npm install -g @railway/cli"
        exit 1
    }
    
    if (-not $netlifyInstalled) {
        Write-Host "❌ Netlify CLI not found" -ForegroundColor Red
        Write-Host "Install: npm install -g netlify-cli"
        exit 1
    }
    
    Write-Host "✓ CLIs installed" -ForegroundColor Green
}

# Deploy backend
function Deploy-Backend {
    Write-Host ""
    Write-Host "📦 Deploying Backend to Railway..." -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    Set-Location backend
    
    # Check if logged in
    try {
        railway whoami | Out-Null
    } catch {
        Write-Host "Please login to Railway:" -ForegroundColor Yellow
        railway login
    }
    
    # Deploy
    Write-Host "Deploying..."
    railway up
    
    # Get domain
    Write-Host ""
    Write-Host "✓ Backend deployed!" -ForegroundColor Green
    Write-Host "Getting domain..."
    $backendUrl = railway domain
    Write-Host "Backend URL: $backendUrl" -ForegroundColor Green
    
    Set-Location ..
    
    # Save backend URL for frontend
    $backendUrl | Out-File -FilePath ".backend-url" -Encoding utf8
}

# Deploy frontend
function Deploy-Frontend {
    Write-Host ""
    Write-Host "🎨 Deploying Frontend to Netlify..." -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    Set-Location frontend
    
    # Check if logged in
    try {
        netlify status | Out-Null
    } catch {
        Write-Host "Please login to Netlify:" -ForegroundColor Yellow
        netlify login
    }
    
    # Get backend URL
    if (Test-Path "../.backend-url") {
        $backendUrl = Get-Content "../.backend-url" -Raw
        $backendUrl = $backendUrl.Trim()
        Write-Host "Using backend URL: $backendUrl"
        "VITE_API_URL=$backendUrl/api" | Out-File -FilePath ".env.production" -Encoding utf8
    } else {
        Write-Host "⚠ Backend URL not found. Please update .env.production manually" -ForegroundColor Yellow
    }
    
    # Install and build
    Write-Host "Installing dependencies..."
    npm install
    
    Write-Host "Building..."
    npm run build
    
    # Deploy
    Write-Host "Deploying..."
    netlify deploy --prod
    
    Write-Host ""
    Write-Host "✓ Frontend deployed!" -ForegroundColor Green
    
    Set-Location ..
}

# Update CORS
function Update-CORS {
    Write-Host ""
    Write-Host "🔧 Updating CORS Configuration..." -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    Write-Host "Please update FRONTEND_URL in Railway:" -ForegroundColor Yellow
    Write-Host "1. Get your Netlify URL from the deployment output above"
    Write-Host "2. Run: cd backend; railway variables set FRONTEND_URL=`"https://your-site.netlify.app`""
    Write-Host ""
    Write-Host "Or update via Railway Dashboard:"
    Write-Host "https://railway.app/dashboard"
}

# Main menu
function Show-Menu {
    Write-Host ""
    Write-Host "What would you like to deploy?"
    Write-Host "1) Backend only (Railway)"
    Write-Host "2) Frontend only (Netlify)"
    Write-Host "3) Both (Backend then Frontend)"
    Write-Host "4) Exit"
    Write-Host ""
    
    $choice = Read-Host "Enter choice [1-4]"
    
    switch ($choice) {
        "1" {
            Check-CLI
            Deploy-Backend
        }
        "2" {
            Check-CLI
            Deploy-Frontend
        }
        "3" {
            Check-CLI
            Deploy-Backend
            Deploy-Frontend
            Update-CORS
        }
        "4" {
            Write-Host "Goodbye!"
            exit 0
        }
        default {
            Write-Host "Invalid choice" -ForegroundColor Red
            Show-Menu
        }
    }
}

# Run
Check-CLI
Show-Menu

Write-Host ""
Write-Host "✨ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Update FRONTEND_URL in Railway with your Netlify URL"
Write-Host "2. Add domains to Firebase authorized domains"
Write-Host "3. Add domains to Cloudinary allowed origins"
Write-Host "4. Test your deployment"
Write-Host ""
Write-Host "For detailed instructions, see DEPLOYMENT_GUIDE.md"
