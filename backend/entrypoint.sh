#!/bin/bash
set -e

echo "🚀 Starting FastAPI application..."
echo "ENV=${ENV}"

# =========================
# Default config (hard-coded)
# =========================
LOG_DIR="/backend/logs"
APP_LOG="${LOG_DIR}/app.log"
ACCESS_LOG="${LOG_DIR}/access.log"
ERROR_LOG="${LOG_DIR}/error.log"

# =========================
# Create logs directory
# =========================
mkdir -p ${LOG_DIR}

# =========================
# Workers config (t3.small: 2 vCPU, 2GB RAM)
# =========================
WORKERS=2
MAX_REQUESTS=1000
MAX_REQUESTS_JITTER=50

echo "👷 Workers: ${WORKERS}"
echo "🔄 Max requests per worker: ${MAX_REQUESTS} (jitter: ${MAX_REQUESTS_JITTER})"
echo "📝 Logs:"
echo "  - ${APP_LOG}"
echo "  - ${ACCESS_LOG}"
echo "  - ${ERROR_LOG}"

# =========================
# Run application
# =========================
if [ "$ENV" = "prd" ] || [ "$ENV" = "prod" ] || [ "$ENV" = "stg" ]; then
    echo "🔥 Running in production mode (Gunicorn + UvicornWorker)"
    exec gunicorn app.main:app \
        --workers ${WORKERS} \
        --worker-class uvicorn.workers.UvicornWorker \
        --bind 0.0.0.0:8000 \
        --timeout 120 \
        --graceful-timeout 30 \
        --keep-alive 5 \
        --max-requests ${MAX_REQUESTS} \
        --max-requests-jitter ${MAX_REQUESTS_JITTER} \
        --log-level info \
        --access-logfile "${ACCESS_LOG}" \
        --error-logfile "${ERROR_LOG}"
else
    echo "🧪 Running in development mode (Uvicorn reload)"
    exec uvicorn app.main:app \
        --host 0.0.0.0 \
        --port 8000 \
        --reload
fi
