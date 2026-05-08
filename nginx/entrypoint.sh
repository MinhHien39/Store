#!/bin/sh
set -eu

# Log environment
echo "==> ENV: ${ENV:-unset}"
echo "==> SERVER_NAME: ${SERVER_NAME:-unset}"

# Replace placeholders in nginx config
sed -i "s/\${ENV}/${ENV:-stg}/g" /etc/nginx/conf.d/default.conf
sed -i "s/\${SERVER_NAME}/${SERVER_NAME:-_}/g" /etc/nginx/conf.d/default.conf

echo "==> Starting Nginx (foreground)..."
exec nginx -g "daemon off;"
