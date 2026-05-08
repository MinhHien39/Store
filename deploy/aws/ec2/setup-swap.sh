#!/bin/bash

set -e

echo "=============================================="
echo " Swap Setup Script Started"
echo " Date: $(date)"
echo "=============================================="

echo ""
echo "[INFO] Checking current memory and swap status..."
free -h || true
swapon --show || true

echo ""
echo "[INFO] Disabling existing swap file if present..."
sudo swapoff /swapfile 2>/dev/null || true

echo ""
echo "[INFO] Removing old swap file if it exists..."
sudo rm -f /swapfile

echo ""
echo "[INFO] Creating a new 2GB swap file (disk-backed, safe for EC2)..."
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress

echo ""
echo "[INFO] Setting correct permissions on swap file (600)..."
sudo chmod 600 /swapfile

echo ""
echo "[INFO] Formatting swap file..."
sudo mkswap /swapfile

echo ""
echo "[INFO] Enabling swap..."
sudo swapon /swapfile

echo ""
echo "[INFO] Ensuring swap is persistent after reboot..."
if grep -q "^/swapfile" /etc/fstab; then
  echo "[INFO] Swap entry already exists in /etc/fstab"
else
  echo "[INFO] Adding swap entry to /etc/fstab"
  echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
fi

echo ""
echo "[INFO] Setting vm.swappiness to 10 (recommended for database workloads)..."
sudo sysctl vm.swappiness=10
echo "vm.swappiness=10" | sudo tee /etc/sysctl.d/99-swappiness.conf

echo ""
echo "[INFO] Final memory and swap status..."
free -h
swapon --show
sysctl vm.swappiness

echo ""
echo "=============================================="
echo " Swap Setup Completed Successfully"
echo " Date: $(date)"
echo "=============================================="