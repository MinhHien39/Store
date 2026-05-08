FROM node:25.4-alpine3.23

# Set the working directory
RUN mkdir /frontend
WORKDIR /frontend

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Copy the entrypoint script into the container
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the port
EXPOSE 3000

# Default command to run the app
CMD ["/entrypoint.sh"]