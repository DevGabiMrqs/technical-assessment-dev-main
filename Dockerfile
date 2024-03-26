# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

# Copy local directories to the current local directory of our docker image (/app)
COPY . .

# Expose the port on which your application runs
EXPOSE 3000

# Command to start your application
CMD [ "node", "app.js" ]