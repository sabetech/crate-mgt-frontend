# Base image
FROM node:16.13.0-alpine3.14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the application code
COPY . .

# Build the production version of the application
RUN npm run build

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "serve"]