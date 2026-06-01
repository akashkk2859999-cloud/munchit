# Use a slim Node.js base image
FROM node:20-bookworm-slim

# Set environment variable to make frontend and python builds non-interactive
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies:
# 1. Python 3 and pip
# 2. Build-essential tools (for compilation if needed)
# 3. OpenCV headless requirements (libglib2.0-0, libgl1, libgomp1)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    libglib2.0-0 \
    libgl1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Verify installations
RUN python3 --version && pip3 --version

# Set work directory
WORKDIR /app

# Copy root configurations and dependency files
COPY package.json package-lock.json* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json backend/requirements.txt ./backend/

# Install Node.js dependencies for root, frontend, and backend using npm workspaces
RUN npm ci --include=dev

# Copy the rest of the application files
COPY . .

# Build the React frontend
RUN npm run build

# Set up Python virtual environment and install pip requirements in backend
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir --upgrade pip setuptools wheel && \
    pip3 install --no-cache-dir -r backend/requirements.txt

# Expose port (default Node.js port is 5000 or port 80 as Azure expects)
EXPOSE 5000 80

# Environment variables
ENV NODE_ENV=production
ENV PORT=80

# Start command
CMD ["npm", "start"]
