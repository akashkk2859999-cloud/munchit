# =========================================================
# STAGE 1: Build Stage
# =========================================================
FROM node:24-bookworm-slim AS build

WORKDIR /app

# Install Python and build-essential compilation tools.
# These are required to compile and build Python wheel dependencies
# like 'insightface' and 'opencv-python-headless' from source.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment for Python dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy package.json and lock files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy python requirements file
COPY requirements.txt ./

# Upgrade pip/setuptools and install python requirements in virtual environment
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy all application source code
COPY . .

# =========================================================
# STAGE 2: Production Stage (Clean & Minimal)
# =========================================================
FROM node:24-bookworm-slim AS production

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=80
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Install only minimal runtime dependencies in production:
# 1. python3 and python3-venv (needed to execute the copied virtual environment)
# 2. Shared system libraries required by OpenCV (libglib2.0-0, libgl1) and ONNX (libgomp1)
# 3. PM2 for robust production process management
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    libglib2.0-0 \
    libgl1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pm2

# Copy virtual environment from the build stage (already fully compiled)
COPY --from=build --chown=node:node /opt/venv /opt/venv

# Copy compiled application code and node_modules from build stage
# Set ownership to the default non-root 'node' user for security
COPY --from=build --chown=node:node /app /app

# Switch to the secure non-root user
USER node

# Expose production port
EXPOSE 80

# Start Express server using PM2 (resilient production process manager)
CMD ["pm2-runtime", "start", "src/server.js", "--name", "munchit-backend"]
