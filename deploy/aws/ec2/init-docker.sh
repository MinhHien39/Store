#!/bin/bash
set -e

echo "➡️ Removing old Docker versions if they exist..."
sudo dnf remove -y docker docker-client docker-client-latest docker-common docker-latest \
  docker-latest-logrotate docker-logrotate docker-engine || true

echo "➡️ Installing Docker on Amazon Linux 2023..."
sudo dnf install -y docker
sudo systemctl enable --now docker

# Add ec2-user to the docker group
if id "ec2-user" &>/dev/null; then
  sudo usermod -aG docker ec2-user
fi

echo "➡️ Installing Docker Buildx v0.17.1 (Global Plugin)..."
ARCH=$(uname -m)
# Map architecture names for Buildx download
if [ "$ARCH" = "x86_64" ]; then BUILDX_ARCH="linux-amd64"; else BUILDX_ARCH="linux-arm64"; fi

# Create system-wide plugin directory
sudo mkdir -p /usr/local/lib/docker/cli-plugins

# Download Buildx binary
sudo curl -SL "https://github.com/docker/buildx/releases/download/v0.17.1/buildx-v0.17.1.${BUILDX_ARCH}" \
  -o /usr/local/lib/docker/cli-plugins/docker-buildx

sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

echo "➡️ Installing Docker Compose v2.40.3 (Global Plugin)..."
# Download Docker Compose binary
sudo curl -SL "https://github.com/docker/compose/releases/download/v2.40.3/docker-compose-linux-${ARCH}" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose

sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

echo "--- VERIFICATION ---"
echo "✅ Docker version:"
sudo docker --version
echo "✅ Buildx version:"
docker buildx version
echo "✅ Docker Compose version:"
docker compose version

echo "🎉 Installation complete!"
echo "💡 NOTE: Please log out and log back in to apply docker group changes for 'ec2-user'."