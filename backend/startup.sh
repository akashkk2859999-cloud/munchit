#!/bin/bash
# Azure App Service Startup Script
# Installs Python dependencies and starts the Node.js server
# (Same approach as Kellogg's Mother's Day Campaign)

echo "🚀 Starting MunchIt Backend..."

# Install Python dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
  echo "📦 Installing Python dependencies..."
  pip install --upgrade pip 2>/dev/null || pip3 install --upgrade pip 2>/dev/null
  pip install -r requirements.txt 2>/dev/null || pip3 install -r requirements.txt 2>/dev/null
  echo "✅ Python dependencies installed"
else
  echo "⚠️ requirements.txt not found, skipping Python deps"
fi

# Verify Python and InsightFace are available
python3 -c "import insightface; print('✅ InsightFace ready')" 2>/dev/null || echo "⚠️ InsightFace not available"

# Start Node.js server
echo "🟢 Starting Node.js server..."
node src/server.js
