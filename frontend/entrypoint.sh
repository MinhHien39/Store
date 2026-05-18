#!/bin/sh
set -e

if [ "$ENV" = "prd" ]; then
  npm run build
  npm run start
else
  npm run dev
fi
