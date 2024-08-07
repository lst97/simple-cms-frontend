# Use an official Node runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . ./

# Build the app
RUN npm run build:docker

# Install serve to run the application
RUN npm install -g serve

EXPOSE 1167

# Serve the app on port 5000
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:1167"]