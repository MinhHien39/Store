#!/bin/sh
set -e

echo "[INFO] Custom entrypoint script started."

# Check if required environment variables are set
if [ -n "$DATABASE_NAME" ] && [ -n "$DATABASE_USER" ] && [ -n "$DATABASE_PASSWORD" ]; then
  echo "[INFO] Generating init.sql for database '$DATABASE_NAME' and user '$DATABASE_USER'..."

  # Escape special characters to safely use in sed
  ESCAPED_DB_NAME=$(printf '%s\n' "$DATABASE_NAME" | sed 's/[\/&]/\\&/g')
  ESCAPED_DB_USER=$(printf '%s\n' "$DATABASE_USER" | sed 's/[\/&]/\\&/g')
  ESCAPED_DB_PASSWORD=$(printf '%s\n' "$DATABASE_PASSWORD" | sed 's/[\/&]/\\&/g')

  # Generate the actual init.sql by replacing placeholders in the template
  sed -e "s|__DATABASE_NAME__|$ESCAPED_DB_NAME|g" \
      -e "s|__DATABASE_USER__|$ESCAPED_DB_USER|g" \
      -e "s|__DATABASE_PASSWORD__|$ESCAPED_DB_PASSWORD|g" \
      /init-template/init.sql.template > /docker-entrypoint-initdb.d/init.sql

  echo "[INFO] init.sql generated:"
  cat /docker-entrypoint-initdb.d/init.sql
else
  echo "[INFO] Missing DATABASE_* variables. Skipping init.sql generation."
fi

# Start MySQL using the original entrypoint
exec docker-entrypoint.sh "$@"
