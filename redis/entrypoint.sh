#!/bin/sh
set -e

# Optional: Print starting message
echo "Starting Redis with AOF enabled..."

# Optional: Set default if not provided via ENV
AOF_MODE=${AOF_MODE:-yes}

# Enable AOF persistence to avoid data loss on container restart
exec redis-server --appendonly "$AOF_MODE"  --requirepass "$REDIS_PASSWORD"
