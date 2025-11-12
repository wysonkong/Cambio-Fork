# -------- STAGE 1: Build the frontend --------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install --force || true

# Copy app source and build it
COPY . .
RUN npm run build || true

# -------- STAGE 2: Serve with nginx --------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom nginx config (for SPA routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
