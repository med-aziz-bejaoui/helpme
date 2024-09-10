# Use the official Node.js image as a base
FROM node:21

# Install dependencies for Playwright browsers
# (We need to install these dependencies to ensure browsers can run inside the container)


# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies (including Playwright)
RUN npm install

# Install the Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of the project files into the working directory
COPY . .

# Set environment variables if necessary (e.g., for testing)
# ENV NODE_ENV=production

# Run Playwright tests in headed mode (adjust the command as needed)
CMD ["npx", "playwright", "test"]
