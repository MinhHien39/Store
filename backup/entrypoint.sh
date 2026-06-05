#!/bin/sh
set -eu

BACKUP_CRON="${BACKUP_CRON:-0 0 * * *}"
TZ="${TZ:-Asia/Ho_Chi_Minh}"
BACKUP_RUN_ON_STARTUP="${BACKUP_RUN_ON_STARTUP:-false}"

mkdir -p /backups /var/log

printenv | sed "s/'/'\\\\''/g" | sed "s/^\([^=]*\)=\(.*\)$/export \1='\2'/" > /etc/db-backup.env

{
  echo "SHELL=/bin/sh"
  echo "TZ=${TZ}"
  echo "${BACKUP_CRON} . /etc/db-backup.env; /usr/local/bin/python /app/backup_mysql_to_gdrive.py >> /proc/1/fd/1 2>> /proc/1/fd/2"
} > /etc/cron.d/db-backup

chmod 0644 /etc/cron.d/db-backup
crontab /etc/cron.d/db-backup

echo "[db-backup] cron registered: ${BACKUP_CRON} (${TZ})"

if [ "${BACKUP_RUN_ON_STARTUP}" = "true" ]; then
  echo "[db-backup] running startup backup"
  . /etc/db-backup.env
  /usr/local/bin/python /app/backup_mysql_to_gdrive.py
fi

exec cron -f
