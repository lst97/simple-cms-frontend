# Use an official Node.js runtime as the base image
FROM node:22.5.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Expose the port the app runs on
EXPOSE 1168

# Define the command to run the app
CMD ["npm run dev"]