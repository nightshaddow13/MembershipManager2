#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"

echo "🔧 Setting up image-comparison skill..."

# Check for ImageMagick
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "📦 Installing ImageMagick via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Error: Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    brew install imagemagick
else
    echo "✅ ImageMagick already installed"
fi

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 not found. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}' | cut -d. -f1,2)
echo "🐍 Found Python $PYTHON_VERSION"

# Create Python virtual environment
if [ -d "$VENV_DIR" ]; then
    echo "✅ Python venv already exists"
else
    echo "📦 Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Install Python dependencies
echo "📦 Installing Python packages (Pillow, numpy)..."
"$VENV_DIR/bin/pip" install --quiet --upgrade pip
"$VENV_DIR/bin/pip" install --quiet Pillow numpy

echo ""
echo "✅ Setup complete!"
echo ""
echo "Usage:"
echo "  bash .ai/skills/image-comparison/compare-images.sh <image1> <image2>"
echo ""
echo "Example:"
echo "  bash .ai/skills/image-comparison/compare-images.sh figma-exports/design.png screenshots/app.png"