# Base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the application code
COPY . .

# Build the production version of the application
RUN npm run build

# Expose the desired port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "serve"]
