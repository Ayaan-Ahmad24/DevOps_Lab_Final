#!/bin/sh
# Inject runtime API URL into built Vite app
# This replaces hardcoded localhost URLs with relative paths

API_URL="${VITE_API_URL:-/}"

# Find and replace API URLs in JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://localhost:5000|${API_URL}|g" {} \;
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://127.0.0.1:5000|${API_URL}|g" {} \;

# Start nginx
exec nginx -g "daemon off;"

