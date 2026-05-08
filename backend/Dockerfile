FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_HOME=/backend

# Set the working directory in the container
RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}

# Install system dependencies 
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Define build-time environment argument: "prod" or "dev"
ARG ENV=local
ENV ENV=${ENV} 

# Copy requirements files and install the correct one based on ENV
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at ${APP_HOME}
COPY . .

# Create logs directory
RUN mkdir -p ${APP_HOME}/logs && chmod 755 ${APP_HOME}/logs

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port
EXPOSE ${BACKEND_PORT}

# Default command to run the app
CMD ["/entrypoint.sh"]