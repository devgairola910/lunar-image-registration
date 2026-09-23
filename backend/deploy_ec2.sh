#!/bin/bash
set -e

echo "===================================================="
echo "🚀 ChandraDrishti Backend EC2 Setup Script (t3.small)"
echo "===================================================="

# 1. Update packages and install prerequisites
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common nginx certbot python3-certbot-nginx

# 2. Configure 2GB Swap Memory (Safety net for t3.small memory spikes during PyTorch inference)
if [ ! -f /swapfile ]; then
    echo "🧠 Creating 2GB Swap file..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap enabled successfully."
else
    echo "ℹ️ Swap file already exists."
fi

# 3. Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed."
fi

# 4. Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "🔧 Installing Docker Compose..."
    sudo apt-get install -y docker-compose-plugin
fi

# 5. Create .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
fi

# 6. Build and start container
echo "🏗️ Building Docker image and launching FastAPI backend..."
sudo docker compose up -d --build

echo ""
echo "===================================================="
echo "🎉 Backend deployed on port 8000!"
echo "Check health: curl http://localhost:8000/api/v1/health"
echo "===================================================="
