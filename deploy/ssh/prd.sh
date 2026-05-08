#!/bin/bash
# ssh -i /Volumes/Working/remote/cider-storeamazon.pem ec2-user@57.182.103.190

# Usage:
#   ./prd.sh          # pull + restart backend (default)
#   ./prd.sh restart  # pull + restart backend
#   ./prd.sh rebuild  # pull + rebuild image + restart (needed after entrypoint/Dockerfile/requirements change)
#   ./prd.sh pull     # git pull only
#   ./prd.sh migrate  # pull + run alembic upgrade head in backend container
#   ./prd.sh nginx    # reload nginx config only
#   ./prd.sh fe       # pull FE dist only (bind mount → nginx picks up automatically, no restart needed)

PEM_FILE="/Volumes/Working/remote/cider-storeamazon.pem"
USER="ec2-user"
HOST="57.182.103.190"
TARGET="${1:-restart}"

ssh -i "$PEM_FILE" "$USER@$HOST" 'sudo bash -s' "$TARGET" << 'ENDSSH'
set -e

TARGET="${1:-pull}"
REPO="/home/ec2-user/storeamazon"
ENV_FILE="$REPO/environment/.env.prd"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  HOST:    $(hostname)"
echo "  TARGET:  $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

pull() {
    sudo su
    echo "📥 Pulling latest code..."
    eval "$(ssh-agent -s)"
    ls ~/.ssh/
    echo "1" | ssh-add ~/.ssh/storeamazon
    git -C "$REPO" fetch -a
    git -C "$REPO" checkout main
    git -C "$REPO" pull origin main
    echo "✅ Pull done"
}

dc() {
    docker compose -f "$REPO/compose.prd.yml" --env-file "$ENV_FILE" "$@"
}

reload_nginx() {
    echo "🔄 Reloading nginx config..."
    dc exec nginx nginx -s reload
    echo "✅ Nginx reloaded"
}

restart_nginx() {
    echo "🔄 Restarting nginx container (pick up new FE dist)..."
    dc up -d --no-deps --force-recreate nginx
    echo "✅ Nginx restarted"
}

restart_backend() {
    echo "🔄 Restarting backend container..."
    dc restart backend
    echo "✅ Backend restarted"
}

rebuild_backend() {
    echo "🔨 Rebuilding backend image + restart..."
    dc up -d --no-deps --build --force-recreate backend
    echo "✅ Backend rebuilt & restarted"
}

migrate() {
    echo "🗄️  Running DB migration in backend container..."
    dc exec backend alembic upgrade head
    echo "✅ Migration done"
}

deploy_fe() {
    pull
    # No nginx restart needed: bind mount serves new files from disk automatically
}

case "$TARGET" in
    pull)    pull ;;
    restart) pull && restart_backend ;;
    rebuild) pull && rebuild_backend ;;
    migrate) pull && migrate ;;
    nginx)   reload_nginx ;;
    fe)      deploy_fe ;;
    *)
        echo "Usage: $0 [pull|restart|rebuild|migrate|nginx|fe]"
        exit 1
        ;;
esac

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done: $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ENDSSH

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done: $TARGET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
