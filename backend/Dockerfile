# Use Node official image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Set environment variables (optional here)
# ENV PORT=4000

# Expose port
EXPOSE 4000

# Start the app
CMD ["node", "app.js"]