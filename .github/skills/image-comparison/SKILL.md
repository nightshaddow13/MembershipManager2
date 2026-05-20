---
name: image-comparison
description: Compare two images (design mockups vs implementation screenshots) and detect visual differences. Produces structured text output describing gaps, missing elements, color differences, and layout discrepancies. Use when validating UI implementations against designs or identifying visual regressions.
---

# Image Comparison Skill

Compares two images and produces detailed text analysis of differences -- no MCP required.

## Use Cases

- **Design validation**: Compare Figma exports with implementation screenshots
- **Visual regression testing**: Detect unintended UI changes
- **QA review**: Identify gaps between mockups and live applications
- **Cross-browser testing**: Compare screenshots from different environments

## Prerequisites

### One-time setup

Run the setup script to install dependencies:

```bash
bash .ai/skills/image-comparison/setup.sh
```

This installs:
- **ImageMagick** (via Homebrew) - pixel-level comparison
- **Python venv** with Pillow/numpy - detailed image analysis

## Commands

Use the comparison script at `.ai/skills/image-comparison/compare-images.sh`:

```bash
SCRIPT=".ai/skills/image-comparison/compare-images.sh"

# Compare two images (produces detailed text analysis)
bash $SCRIPT <design-image> <implementation-image>

# Example: Compare Figma export with screenshot
bash $SCRIPT figma-exports/game-canvas-design.png screenshots/current-game.png

# Example: Compare with diff output image
bash $SCRIPT design.png screenshot.png --output diff.png
```

## Output Format

The script produces structured text output in sections:

### 1. Pixel Difference Metrics
```
PIXEL_DIFF_PERCENT: 12.5
TOTAL_PIXELS_DIFFERENT: 60400
PEAK_SIGNAL_NOISE_RATIO: 28.3
```

### 2. Color Analysis
```
DESIGN_DOMINANT_COLORS:
  #101828: 45.2% (background)
  #1E2939: 22.1% (header)
  #FFFFFF: 15.3% (text)

IMPLEMENTATION_DOMINANT_COLORS:
  #101828: 43.8% (background)
  #1E2939: 22.1% (header)
  #FFFFFF: 15.9% (text)

COLOR_DIFFERENCES:
  Background coverage: -1.4% (expected 45.2%, found 43.8%)
```

### 3. Element Detection
```
DESIGN_ELEMENTS:
  - Wall (top): x=0, y=0, w=800, h=20, color=#364153
  - Wall (right): x=780, y=0, w=20, h=600, color=#364153
  - Wall (bottom): x=0, y=580, w=800, h=20, color=#364153
  - Wall (left): x=0, y=0, w=20, h=600, color=#364153
  - Center obstacle: x=350, y=250, w=100, h=100, color=#364153
  - Car: x=100, y=300, w=40, h=24, color=#DC2626
  - Parking zone: x=700, y=500, w=100, h=100, color=#10B981

IMPLEMENTATION_ELEMENTS:
  - Wall (top): x=0, y=0, w=808, h=20, color=#364153
  - Wall (right): x=788, y=0, w=20, h=608, color=#364153
  - Wall (bottom): x=0, y=588, w=808, h=20, color=#364153
  - Wall (left): x=0, y=0, w=20, h=608, color=#364153
  - Car: x=120, y=300, w=40, h=24, color=#DC2626
  - Parking zone: x=708, y=508, w=100, h=100, color=#10B981

MISSING_ELEMENTS:
  - Center obstacle (expected at x=350, y=250, w=100, h=100)

EXTRA_ELEMENTS:
  None detected
```

### 4. Layout Differences
```
CANVAS_SIZE_DIFFERENCE:
  Design: 800x600
  Implementation: 808x608
  Delta: +8px width, +8px height

ELEMENT_POSITION_DIFFERENCES:
  - Car: moved +20px right (expected x=100, found x=120)
  - Parking zone: moved +8px right, +8px down
```

### 5. Visual Diff Image

If `--output` is specified, a diff image is generated showing:
- Red overlay: pixels present in design but missing in implementation
- Green overlay: pixels present in implementation but not in design
- Yellow overlay: color differences between matching pixels

## Interpreting Results

### Pixel Diff Percent
- **0-2%**: Minor anti-aliasing or rendering differences
- **2-10%**: Small layout shifts or missing elements
- **10%+**: Major differences requiring investigation

### Color Differences
- Small percentage differences (< 1%) are typically acceptable
- Large differences may indicate incorrect colors or missing elements

### Missing Elements
- Critical for design validation
- Each missing element should be investigated and added to implementation

### Position Differences
- Small shifts (1-2px) may be acceptable rounding
- Larger shifts indicate layout calculation errors

## Advanced Usage

### Custom threshold for element detection
```bash
# Default threshold is 10 (higher = less sensitive)
bash $SCRIPT design.png screenshot.png --threshold 20
```

### Include detailed pixel-by-pixel analysis
```bash
bash $SCRIPT design.png screenshot.png --verbose
```

### Compare specific regions only
```bash
# Compare only a 200x200 region starting at (100,100)
bash $SCRIPT design.png screenshot.png --region 100,100,200,200
```

## Troubleshooting

### "ImageMagick not found"
Run the setup script: `bash .ai/skills/image-comparison/setup.sh`

### "Python venv not found"
Run the setup script or manually create:
```bash
python3 -m venv .ai/skills/image-comparison/venv
source .ai/skills/image-comparison/venv/bin/activate
pip install Pillow numpy
```

### Images have different dimensions
The script automatically handles different dimensions by:
1. Reporting the size difference
2. Comparing overlapping regions
3. Marking non-overlapping areas as differences

### High false positive rate
- Adjust detection threshold: `--threshold 20` or higher
- Check if images have different anti-aliasing or compression
- Ensure screenshots are taken at same zoom level

## Implementation Notes

This skill uses:
- **ImageMagick compare**: Fast pixel-level comparison and diff visualization
- **Python PIL/Pillow**: Color analysis, element detection, shape recognition
- **numpy**: Statistical analysis of pixel distributions

All processing is local -- no external APIs or MCP servers required.