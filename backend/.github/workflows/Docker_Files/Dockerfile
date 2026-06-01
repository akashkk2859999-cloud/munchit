# =========================================================
# STAGE 1: Build Stage (Debian Bookworm)
# =========================================================
FROM node:24-bookworm-slim AS build

WORKDIR /app

# Install compilation tools, Python, and ODBC dependencies in Debian
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    python3-pip \
    python3-dev \
    build-essential \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment for Python dependencies
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy Python requirements file
COPY requirements.txt ./

# Upgrade pip/setuptools and install python requirements
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy all application source code
COPY . .

# =========================================================
# STAGE 2: Production Stage (Debian Bookworm - Clean & Minimal)
# =========================================================
FROM node:24-bookworm-slim AS production

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=80
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Install only minimal runtime dependencies in production:
# 1. python3 and python3-venv to run the virtual environment
# 2. Shared libraries required by OpenCV (libglib2.0-0, libgl1) and ONNX (libgomp1)
# 3. unixodbc and unixodbc-dev (required for database connections)
# 4. PM2 for production process management
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-venv \
    libglib2.0-0 \
    libgl1 \
    libgomp1 \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pm2

# Copy virtual environment from the build stage (already fully compiled)
COPY --from=build /opt/venv /opt/venv

# Copy compiled application code and node_modules from build stage
COPY --from=build /app /app

# Pre-create all runtime directories and models cache folder with correct non-root permissions
RUN mkdir -p /app/uploads /app/results /app/templates /app/src/utility/models

# Explicitly ensure /app and /opt/venv are recursively owned by the non-root 'node' user
RUN chown -R node:node /app /opt/venv

# Switch to the secure non-root user
USER node

# Expose production port
EXPOSE 80

# Start Express server directly using node (best practice for Kubernetes)
CMD ["node", "src/server.js"]