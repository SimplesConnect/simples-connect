#!/bin/bash

# 🚀 Simples Connect - Vercel Deployment Script
# This script prepares and deploys both frontend and backend to Vercel

echo "🚀 Starting Vercel deployment for Simples Connect..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed"
    print_status "Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Commit current changes
print_status "Checking Git status..."
if [[ `git status --porcelain` ]]; then
    print_warning "You have uncommitted changes"
    read -p "Do you want to commit them now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_message
        git commit -m "$commit_message"
        git push origin main
        print_success "Changes committed and pushed"
    else
        print_warning "Proceeding with uncommitted changes"
    fi
else
    print_success "Working directory is clean"
fi

# Step 2: Deploy Backend
print_status "Deploying backend to Vercel..."
cd backend

if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found in backend directory"
    exit 1
fi

# Deploy backend
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Backend deployed successfully"
    backend_url=$(vercel ls --scope=team | grep backend | awk '{print $2}' | head -1)
    print_status "Backend URL: https://$backend_url"
else
    print_error "Backend deployment failed"
    exit 1
fi

cd ..

# Step 3: Update frontend configuration with backend URL
print_status "Updating frontend configuration..."
if [ -n "$backend_url" ]; then
    # Update vercel.json with the actual backend URL
    sed -i.bak "s/simples-connect-backend.vercel.app/$backend_url/g" frontend/vercel.json
    print_success "Frontend configuration updated"
else
    print_warning "Could not automatically detect backend URL"
    print_status "You may need to manually update frontend/vercel.json"
fi

# Step 4: Deploy Frontend
print_status "Deploying frontend to Vercel..."
cd frontend

if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found in frontend directory"
    exit 1
fi

# Deploy frontend
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Frontend deployed successfully"
    frontend_url=$(vercel ls --scope=team | grep frontend | awk '{print $2}' | head -1)
    print_status "Frontend URL: https://$frontend_url"
else
    print_error "Frontend deployment failed"
    exit 1
fi

cd ..

# Step 5: Display next steps
echo
echo "🎉 Deployment completed successfully!"
echo
echo "📋 Next Steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure Stripe webhooks:"
echo "   - Webhook URL: https://$backend_url/api/subscription/webhook"
echo "3. Test your application:"
echo "   - Frontend: https://$frontend_url"
echo "   - Backend: https://$backend_url"
echo
echo "🔧 Important Configuration:"
echo "- Update your Stripe webhook URL in the dashboard"
echo "- Set up custom domains if needed"
echo "- Configure environment variables for both projects"
echo
print_success "Simples Connect is now live! 🚀" 