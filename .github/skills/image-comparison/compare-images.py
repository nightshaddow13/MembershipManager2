#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/venv"
ANALYZE_SCRIPT="$SCRIPT_DIR/analyze-images.py"

# Usage
usage() {
    echo "Usage: $0 <design-image> <implementation-image> [options]"
    echo ""
    echo "Options:"
    echo "  --output <file>       Save visual diff to file (default: skip)"
    echo "  --threshold <n>       Element detection threshold 1-100 (default: 10)"
    echo "  --verbose             Include detailed pixel analysis"
    echo "  --region x,y,w,h      Compare only specified region"
    echo ""
    echo "Example:"
    echo "  $0 design.png screenshot.png"
    echo "  $0 design.png screenshot.png --output diff.png --threshold 15"
    exit 1
}

# Check arguments
if [ $# -lt 2 ]; then
    usage
fi

DESIGN_IMAGE="$1"
IMPL_IMAGE="$2"
shift 2

# Parse optional arguments
OUTPUT_FILE=""
THRESHOLD="10"
VERBOSE="false"
REGION=""

while [ $# -gt 0 ]; do
    case "$1" in
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --threshold)
            THRESHOLD="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE="true"
            shift
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate input files
if [ ! -f "$DESIGN_IMAGE" ]; then
    echo "❌ Error: Design image not found: $DESIGN_IMAGE"
    exit 1
fi

if [ ! -f "$IMPL_IMAGE" ]; then
    echo "❌ Error: Implementation image not found: $IMPL_IMAGE"
    exit 1
fi

# Check dependencies
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick not found. Run setup:"
    echo "   bash .ai/skills/image-comparison/setup.sh"
    exit 1
fi

if [ ! -d "$VENV_DIR" ]; then
    echo "❌ Error: Python venv not found. Run setup:"
    echo "   bash .ai/skills/image-comparison/setup.sh"
    exit 1
fi

echo "🔍 Comparing images..."
echo "   Design:         $DESIGN_IMAGE"
echo "   Implementation: $IMPL_IMAGE"
echo ""

# ====================
# 1. IMAGEMAGICK PIXEL COMPARISON
# ====================

echo "=== PIXEL DIFFERENCE METRICS ==="
echo ""

# Create temp file for metrics
METRICS_FILE=$(mktemp)
DIFF_IMAGE=$(mktemp).png

# Get ImageMagick command (v6 uses 'convert', v7 uses 'magick')
if command -v magick &> /dev/null; then
    MAGICK_CMD="magick compare"
    IDENTIFY_CMD="magick identify"
else
    MAGICK_CMD="compare"
    IDENTIFY_CMD="identify"
fi

# Run comparison
set +e
$MAGICK_CMD -metric AE -fuzz 5% "$DESIGN_IMAGE" "$IMPL_IMAGE" "$DIFF_IMAGE" 2>"$METRICS_FILE"
COMPARE_EXIT=$?
set -e

# Parse ImageMagick output
PIXELS_DIFF=$(cat "$METRICS_FILE" || echo "0")
echo "TOTAL_PIXELS_DIFFERENT: $PIXELS_DIFF"

# Get image dimensions
DESIGN_SIZE=$($IDENTIFY_CMD -format "%wx%h" "$DESIGN_IMAGE")
IMPL_SIZE=$($IDENTIFY_CMD -format "%wx%h" "$IMPL_IMAGE")
DESIGN_WIDTH=$(echo "$DESIGN_SIZE" | cut -d'x' -f1)
DESIGN_HEIGHT=$(echo "$DESIGN_SIZE" | cut -d'x' -f2)
IMPL_WIDTH=$(echo "$IMPL_SIZE" | cut -d'x' -f1)
IMPL_HEIGHT=$(echo "$IMPL_SIZE" | cut -d'x' -f2)

echo "DESIGN_DIMENSIONS: ${DESIGN_WIDTH}x${DESIGN_HEIGHT}"
echo "IMPLEMENTATION_DIMENSIONS: ${IMPL_WIDTH}x${IMPL_HEIGHT}"

# Calculate percentage
TOTAL_PIXELS=$((DESIGN_WIDTH * DESIGN_HEIGHT))
if [ "$TOTAL_PIXELS" -gt 0 ]; then
    DIFF_PERCENT=$(awk "BEGIN {printf \"%.2f\", ($PIXELS_DIFF / $TOTAL_PIXELS) * 100}")
    echo "PIXEL_DIFF_PERCENT: $DIFF_PERCENT%"
else
    echo "PIXEL_DIFF_PERCENT: N/A"
fi

# Dimension differences
if [ "$DESIGN_SIZE" != "$IMPL_SIZE" ]; then
    WIDTH_DELTA=$((IMPL_WIDTH - DESIGN_WIDTH))
    HEIGHT_DELTA=$((IMPL_HEIGHT - DESIGN_HEIGHT))
    echo ""
    echo "CANVAS_SIZE_DIFFERENCE:"
    echo "  Design: ${DESIGN_WIDTH}x${DESIGN_HEIGHT}"
    echo "  Implementation: ${IMPL_WIDTH}x${IMPL_HEIGHT}"
    echo "  Delta: ${WIDTH_DELTA:+$WIDTH_DELTA}px width, ${HEIGHT_DELTA:+$HEIGHT_DELTA}px height"
fi

echo ""

# Save diff image if requested
if [ -n "$OUTPUT_FILE" ]; then
    cp "$DIFF_IMAGE" "$OUTPUT_FILE"
    echo "📸 Visual diff saved to: $OUTPUT_FILE"
    echo ""
fi

# Cleanup temp files
rm -f "$METRICS_FILE" "$DIFF_IMAGE"

# ====================
# 2. PYTHON DETAILED ANALYSIS
# ====================

echo "=== DETAILED IMAGE ANALYSIS ==="
echo ""

# Run Python analysis script
"$VENV_DIR/bin/python" "$ANALYZE_SCRIPT" \
    "$DESIGN_IMAGE" \
    "$IMPL_IMAGE" \
    --threshold "$THRESHOLD" \
    $([ "$VERBOSE" = "true" ] && echo "--verbose" || echo "") \
    $([ -n "$REGION" ] && echo "--region $REGION" || echo "")

echo ""
echo "✅ Comparison complete"