# Use the official Node.js 18.16.1 image as the base
FROM node:16.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the server will run
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
