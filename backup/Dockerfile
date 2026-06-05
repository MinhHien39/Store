FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        cron \
        default-mysql-client \
        gzip \
        tzdata \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backup_mysql_to_gdrive.py entrypoint.sh ./
RUN chmod +x /app/entrypoint.sh

VOLUME ["/backups"]

ENTRYPOINT ["/app/entrypoint.sh"]
