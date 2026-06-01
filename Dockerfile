# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:20-bookworm-slim AS build

WORKDIR /app

# Copy root configurations and dependency files
COPY package.json package-lock.json* ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install Node.js dependencies for root, frontend, and backend using npm workspaces
RUN npm ci --include=dev

# Copy the rest of the application files
COPY . .

# Build the React frontend statically to frontend/dist
RUN npm run build

# ==========================================
# STAGE 2: Production Stage
# ==========================================
# Use a glibc-compatible Node.js image to ensure clean precompiled Python wheels support (instead of musl/alpine)
FROM node:20-bookworm-slim AS production

# Set environment variable to make package installations non-interactive
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV PORT=80

WORKDIR /app

# Install system dependencies:
# 1. Python 3 and pip virtual environment creator
# 2. OpenCV headless and ONNX dependencies (libglib2.0-0, libgl1, libgomp1)
# 3. PM2 for production process management
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    libglib2.0-0 \
    libgl1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pm2

# Create a secure non-root user (following Kellogg's corporate best practices)
RUN useradd -m nodeuser && chown -R nodeuser:nodeuser /app

# Copy only the necessary files from the build stage
COPY --from=build --chown=nodeuser:nodeuser /app /app

# Pre-create all runtime directories and models cache folder with correct non-root permissions
RUN mkdir -p /app/uploads /app/results /app/templates /app/backend/src/utility/models && \
    chown -R nodeuser:nodeuser /app/uploads /app/results /app/templates /app/backend/src/utility/models

# Set up Python virtual environment and install pip requirements inside the app directory
USER nodeuser
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip3 install --no-cache-dir --upgrade pip setuptools wheel && \
    pip3 install --no-cache-dir -r /app/backend/requirements.txt

# Expose production port
EXPOSE 80

# Run the backend Express server using PM2 (highly resilient runtime monitor)
CMD ["pm2-runtime", "start", "backend/src/server.js", "--name", "munchit-ue"]
