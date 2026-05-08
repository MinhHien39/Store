# Use the lightweight Alpine-based Redis image (~10MB)
FROM redis:7.4.7-alpine  

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Default command to run the app
CMD ["/entrypoint.sh"]