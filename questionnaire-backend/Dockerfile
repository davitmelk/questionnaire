FROM node:12

# Set the working directory inside the container
WORKDIR /app

# Expose the port the app will run on
EXPOSE 3000

RUN sed -i '/stretch-updates/d' /etc/apt/sources.list
RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list && \
    sed -i 's|http://security.debian.org/debian-security|http://archive.debian.org/debian-security|g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until && \
    apt-get update && apt-get install -y \
      telnet \
      lsof \
      net-tools \
      && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app (TypeScript compilation)
RUN npm run build

# Set the default command to start the application (use start or start:build script)
CMD ["npm", "run", "start:build"]
