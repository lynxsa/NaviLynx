#!/bin/bash

# NaviLynx Admin Dashboard Deployment Script
# This script helps deploy the admin dashboard to various environments

set -e

echo "🚀 NaviLynx Admin Dashboard Deployment"
echo "======================================"

# Check if environment is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <environment>"
    echo "Environments: local, staging, production"
    exit 1
fi

ENVIRONMENT=$1

# Color codes for output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Build the application
build_application() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Deploy to local environment
deploy_local() {
    print_status "Deploying to local environment..."
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating from .env.example..."
        cp .env.example .env.local
        print_warning "Please update .env.local with your configuration"
    fi
    
    # Start development server
    print_status "Starting development server..."
    npm run dev &
    
    print_success "Local deployment complete"
    print_status "Application available at: http://localhost:3000"
}

# Deploy to staging environment
deploy_staging() {
    print_status "Deploying to staging environment..."
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        print_error "Vercel CLI is not installed. Please install it first:"
        print_error "npm i -g vercel"
        exit 1
    fi
    
    # Deploy to Vercel staging
    vercel --prod=false
    
    print_success "Staging deployment complete"
}

# Deploy to production environment
deploy_production() {
    print_status "Deploying to production environment..."
    
    # Confirmation prompt
    echo -e "${YELLOW}⚠️  You are about to deploy to PRODUCTION!${NC}"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Production deployment cancelled"
        exit 0
    fi
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        print_error "Vercel CLI is not installed. Please install it first:"
        print_error "npm i -g vercel"
        exit 1
    fi
    
    # Run tests (if available)
    if [ -f "package.json" ] && npm run | grep -q "test"; then
        print_status "Running tests..."
        npm test
        print_success "All tests passed"
    fi
    
    # Deploy to Vercel production
    vercel --prod
    
    print_success "Production deployment complete"
}

# Deploy using Docker
deploy_docker() {
    print_status "Deploying using Docker..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first"
        exit 1
    fi
    
    # Build Docker image
    print_status "Building Docker image..."
    docker build -t navilynx-admin .
    
    # Run Docker container
    print_status "Starting Docker container..."
    docker run -d \
        --name navilynx-admin \
        -p 3000:3000 \
        --env-file .env.local \
        navilynx-admin
    
    print_success "Docker deployment complete"
    print_status "Application available at: http://localhost:3000"
}

# Main deployment logic
case $ENVIRONMENT in
    "local")
        check_prerequisites
        install_dependencies
        deploy_local
        ;;
    "staging")
        check_prerequisites
        install_dependencies
        build_application
        deploy_staging
        ;;
    "production")
        check_prerequisites
        install_dependencies
        build_application
        deploy_production
        ;;
    "docker")
        check_prerequisites
        install_dependencies
        build_application
        deploy_docker
        ;;
    *)
        print_error "Invalid environment: $ENVIRONMENT"
        print_error "Valid environments: local, staging, production, docker"
        exit 1
        ;;
esac

print_success "Deployment completed successfully! 🎉"
