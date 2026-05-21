# Image Comparison Skill

Local tool for comparing design mockups with implementation screenshots.

## Quick Start

```bash
# One-time setup (installs ImageMagick + Python packages)
bash .ai/skills/image-comparison/setup.sh

# Compare two images
bash .ai/skills/image-comparison/compare-images.sh design.png screenshot.png

# With visual diff output
bash .ai/skills/image-comparison/compare-images.sh design.png screenshot.png --output diff.png
```

## What It Does

1. **Pixel-level comparison** (ImageMagick)
   - Total pixels different
   - Percentage difference
   - Canvas size differences

2. **Color analysis** (Python PIL)
   - Dominant colors in each image
   - Color distribution differences
   - Missing/extra colors

3. **Element detection** (Python)
   - Border/wall detection
   - Color-based region detection
   - Layout validation

4. **Structured output**
   - Text-based analysis I can interpret
   - No external APIs required
   - All processing local

## Files

- `SKILL.md` - Full documentation
- `setup.sh` - One-time dependency installation
- `compare-images.sh` - Main comparison script
- `analyze-images.py` - Python analysis engine
- `venv/` - Python virtual environment (created by setup)

## Dependencies

- **ImageMagick** - Installed via Homebrew
- **Python 3.8+** - With Pillow and numpy in venv
- **macOS** - Uses `open` command for previews

All dependencies are local -- no MCP servers or external APIs.