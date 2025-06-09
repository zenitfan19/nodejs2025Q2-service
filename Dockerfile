FROM node:lts-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start application
CMD ["npm", "run", "start:dev"]