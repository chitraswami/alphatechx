#!/bin/bash

# AlphaTechX Digital Ocean Deployment Script
# This script helps deploy the AlphaTechX app to a Digital Ocean droplet

set -e

echo "🚀 AlphaTechX Digital Ocean Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on the server or locally
if [ -f "/etc/os-release" ]; then
    OS=$(grep -oP '(?<=^ID=).+' /etc/os-release | tr -d '"')
fi

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check for required commands
check_requirements() {
    echo ""
    echo "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo "Install with: curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh"
        exit 1
    fi
    print_status "Docker installed"

    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        echo "Install with: sudo apt install docker-compose-plugin"
        exit 1
    fi
    print_status "Docker Compose installed"
}

# Check environment file
check_env() {
    echo ""
    echo "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found"
        if [ -f "env.example" ]; then
            echo "Creating .env from env.example..."
            cp env.example .env
            print_warning "Please edit .env file with your actual values"
            echo "Run: nano .env"
            exit 1
        else
            print_error "No env.example found"
            exit 1
        fi
    fi
    print_status ".env file exists"
    
    # Check for required variables
    REQUIRED_VARS=("MONGODB_URI" "JWT_SECRET" "OPENAI_API_KEY" "PINECONE_API_KEY")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=.\+" .env; then
            print_status "$var is set"
        else
            print_warning "$var may not be configured properly"
        fi
    done
}

# Build containers
build() {
    echo ""
    echo "Building Docker containers..."
    docker compose -f docker-compose.prod.yml build
    print_status "Build complete"
}

# Start services
start() {
    echo ""
    echo "Starting services..."
    docker compose -f docker-compose.prod.yml up -d
    print_status "Services started"
}

# Stop services
stop() {
    echo ""
    echo "Stopping services..."
    docker compose -f docker-compose.prod.yml down
    print_status "Services stopped"
}

# Restart services
restart() {
    echo ""
    echo "Restarting services..."
    docker compose -f docker-compose.prod.yml restart
    print_status "Services restarted"
}

# View logs
logs() {
    echo ""
    echo "Viewing logs (Ctrl+C to exit)..."
    docker compose -f docker-compose.prod.yml logs -f "${@:2}"
}

# Check status
status() {
    echo ""
    echo "Service Status:"
    docker compose -f docker-compose.prod.yml ps
}

# Full deployment
deploy() {
    echo ""
    echo "Starting full deployment..."
    
    check_requirements
    check_env
    
    echo ""
    echo "Stopping existing containers..."
    docker compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    build
    start
    
    echo ""
    echo "Waiting for services to start..."
    sleep 5
    
    status
    
    echo ""
    echo "========================================"
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo ""
    echo "Your services are running at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5001"
    echo "  - Bot Service: http://localhost:4000"
    echo ""
    echo "Next steps:"
    echo "  1. Configure Nginx reverse proxy"
    echo "  2. Set up SSL with Let's Encrypt"
    echo "  3. Update Azure Bot messaging endpoint"
    echo ""
    echo "See DIGITALOCEAN_DEPLOYMENT_GUIDE.md for details"
}

# Update deployment
update() {
    echo ""
    echo "Updating deployment..."
    
    # Pull latest code if in a git repo
    if [ -d ".git" ]; then
        echo "Pulling latest changes..."
        git pull
    fi
    
    stop
    build
    start
    
    echo ""
    print_status "Update complete"
}

# Setup swap (for low-memory droplets)
setup_swap() {
    echo ""
    echo "Setting up swap space..."
    
    if [ -f /swapfile ]; then
        print_warning "Swap file already exists"
        return
    fi
    
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    
    print_status "Swap space configured (1GB)"
}

# Show help
show_help() {
    echo ""
    echo "Usage: ./deploy-digitalocean.sh [command]"
    echo ""
    echo "Commands:"
    echo "  deploy     Full deployment (build and start)"
    echo "  build      Build Docker containers"
    echo "  start      Start services"
    echo "  stop       Stop services"
    echo "  restart    Restart services"
    echo "  update     Pull latest code and redeploy"
    echo "  status     Show service status"
    echo "  logs       View logs (add service name for specific logs)"
    echo "  swap       Set up swap space for low-memory droplets"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy-digitalocean.sh deploy"
    echo "  ./deploy-digitalocean.sh logs bot-service"
    echo "  ./deploy-digitalocean.sh restart"
}

# Main script
case "${1}" in
    deploy)
        deploy
        ;;
    build)
        build
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    update)
        update
        ;;
    status)
        status
        ;;
    logs)
        logs "$@"
        ;;
    swap)
        setup_swap
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
