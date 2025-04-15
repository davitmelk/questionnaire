# # Stage 1: Build Angular app
# FROM node:18 AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build -- --output-path=dist --configuration=production

# # Stage 2: Serve with Nginx
# FROM nginx:alpine

# # Remove default Nginx page
# RUN rm -rf /usr/share/nginx/html/*

# # Copy Angular build from builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Custom nginx config (optional, but useful for SPA routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]






# Stage 1: Build the frontend
FROM node:12 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (update if your build command is different)
RUN npm start
RUN npm run build:prod

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]









FROM node:18

WORKDIR /app
EXPOSE 3000

# Copy config and install dependencies
RUN apt update && apt install -y telnet lsof
COPY package*.json angular.json tsconfig.json ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN npm install
RUN npm install sass --save-dev
# Copy the rest of the app
COPY . .

# 👇 Add the workaround for OpenSSL error
ENV NODE_OPTIONS=--openssl-legacy-provider

# Run Angular build with production config
RUN npm run build -- --output-path=dist --configuration=production

CMD ["npx", "http-server", "dist", "-p", "80"]
