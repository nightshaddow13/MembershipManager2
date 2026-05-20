#!/usr/bin/env python3
"""
Image Analysis Script for Design Comparison
Extracts colors, detects elements, and identifies layout differences.
"""

import sys
import argparse
from pathlib import Path
from collections import Counter
from typing import Dict, List, Tuple, Optional

try:
    from PIL import Image
    import numpy as np
except ImportError as e:
    print(f"❌ Error: Required package not installed: {e}", file=sys.stderr)
    print("   Run: bash .ai/skills/image-comparison/setup.sh", file=sys.stderr)
    sys.exit(1)


def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    """Convert RGB tuple to hex color string."""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}".upper()


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color string to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def extract_dominant_colors(image: Image.Image, top_n: int = 10) -> Dict[str, float]:
    """Extract dominant colors from image with percentage coverage."""
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize for faster processing
    img_small = image.resize((100, 100), Image.Resampling.LANCZOS)
    pixels = list(img_small.getdata())
    
    # Count colors
    color_counts = Counter(pixels)
    total_pixels = len(pixels)
    
    # Get top colors
    top_colors = color_counts.most_common(top_n)
    
    result = {}
    for color_rgb, count in top_colors:
        color_hex = rgb_to_hex(color_rgb)
        percentage = (count / total_pixels) * 100
        result[color_hex] = round(percentage, 2)
    
    return result


def detect_rectangles(image: Image.Image, threshold: int = 10) -> List[Dict]:
    """Detect rectangular regions with uniform colors."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    img_array = np.array(image)
    height, width = img_array.shape[:2]
    
    rectangles = []
    
    # Simple edge detection by color changes
    # Look for regions with consistent colors (potential UI elements)
    
    # Top border detection
    top_row = img_array[0, :, :]
    if len(set(map(tuple, top_row))) < width * 0.1:  # Mostly uniform
        dominant_color = rgb_to_hex(tuple(np.median(top_row, axis=0).astype(int)))
        rectangles.append({
            'type': 'Wall (top)',
            'x': 0,
            'y': 0,
            'width': width,
            'height': threshold,
            'color': dominant_color
        })
    
    # Bottom border detection
    bottom_row = img_array[-1, :, :]
    if len(set(map(tuple, bottom_row))) < width * 0.1:
        dominant_color = rgb_to_hex(tuple(np.median(bottom_row, axis=0).astype(int)))
        rectangles.append({
            'type': 'Wall (bottom)',
            'x': 0,
            'y': height - threshold,
            'width': width,
            'height': threshold,
            'color': dominant_color
        })
    
    # Left border detection
    left_col = img_array[:, 0, :]
    if len(set(map(tuple, left_col))) < height * 0.1:
        dominant_color = rgb_to_hex(tuple(np.median(left_col, axis=0).astype(int)))
        rectangles.append({
            'type': 'Wall (left)',
            'x': 0,
            'y': 0,
            'width': threshold,
            'height': height,
            'color': dominant_color
        })
    
    # Right border detection
    right_col = img_array[:, -1, :]
    if len(set(map(tuple, right_col))) < height * 0.1:
        dominant_color = rgb_to_hex(tuple(np.median(right_col, axis=0).astype(int)))
        rectangles.append({
            'type': 'Wall (right)',
            'x': width - threshold,
            'y': 0,
            'width': threshold,
            'height': height,
            'color': dominant_color
        })
    
    return rectangles


def find_color_regions(image: Image.Image, target_colors: List[str], min_size: int = 100) -> List[Dict]:
    """Find regions containing specific colors (for detecting game elements)."""
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    img_array = np.array(image)
    regions = []
    
    for hex_color in target_colors:
        rgb = hex_to_rgb(hex_color)
        
        # Create mask for this color (with small tolerance)
        tolerance = 10
        mask = np.all(np.abs(img_array - rgb) <= tolerance, axis=2)
        
        if np.sum(mask) >= min_size:
            # Find bounding box
            rows, cols = np.where(mask)
            if len(rows) > 0:
                min_row, max_row = rows.min(), rows.max()
                min_col, max_col = cols.min(), cols.max()
                
                regions.append({
                    'color': hex_color,
                    'x': int(min_col),
                    'y': int(min_row),
                    'width': int(max_col - min_col),
                    'height': int(max_row - min_row),
                    'pixel_count': int(np.sum(mask))
                })
    
    return regions


def compare_color_distributions(colors1: Dict[str, float], colors2: Dict[str, float]) -> List[str]:
    """Compare two color distributions and report differences."""
    differences = []
    
    # Check colors in design that differ in implementation
    for color, percent1 in colors1.items():
        percent2 = colors2.get(color, 0)
        diff = percent2 - percent1
        
        if abs(diff) > 1.0:  # More than 1% difference
            sign = "+" if diff > 0 else ""
            differences.append(
                f"  {color}: {sign}{diff:.1f}% (expected {percent1:.1f}%, found {percent2:.1f}%)"
            )
    
    # Check for colors in implementation not in design
    for color, percent2 in colors2.items():
        if color not in colors1 and percent2 > 2.0:  # Significant presence
            differences.append(
                f"  {color}: NEW COLOR (+{percent2:.1f}%, not present in design)"
            )
    
    return differences


def main():
    parser = argparse.ArgumentParser(description='Analyze and compare images')
    parser.add_argument('design_image', help='Path to design image')
    parser.add_argument('implementation_image', help='Path to implementation image')
    parser.add_argument('--threshold', type=int, default=10, help='Detection threshold')
    parser.add_argument('--verbose', action='store_true', help='Verbose output')
    parser.add_argument('--region', help='Region to analyze: x,y,w,h')
    
    args = parser.parse_args()
    
    # Load images
    try:
        design_img = Image.open(args.design_image)
        impl_img = Image.open(args.implementation_image)
    except FileNotFoundError as e:
        print(f"❌ Error: Image file not found: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error loading images: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Crop to region if specified
    if args.region:
        x, y, w, h = map(int, args.region.split(','))
        design_img = design_img.crop((x, y, x + w, y + h))
        impl_img = impl_img.crop((x, y, x + w, y + h))
    
    print("📊 COLOR ANALYSIS")
    print("")
    
    # Extract dominant colors
    design_colors = extract_dominant_colors(design_img)
    impl_colors = extract_dominant_colors(impl_img)
    
    print("DESIGN_DOMINANT_COLORS:")
    for color, percent in list(design_colors.items())[:5]:
        print(f"  {color}: {percent}%")
    print("")
    
    print("IMPLEMENTATION_DOMINANT_COLORS:")
    for color, percent in list(impl_colors.items())[:5]:
        print(f"  {color}: {percent}%")
    print("")
    
    # Compare color distributions
    color_diffs = compare_color_distributions(design_colors, impl_colors)
    if color_diffs:
        print("COLOR_DIFFERENCES:")
        for diff in color_diffs:
            print(diff)
    else:
        print("COLOR_DIFFERENCES: None (colors match within 1% tolerance)")
    print("")
    
    print("🔍 ELEMENT DETECTION")
    print("")
    
    # Detect rectangles (walls, UI elements)
    design_rects = detect_rectangles(design_img, args.threshold)
    impl_rects = detect_rectangles(impl_img, args.threshold)
    
    if design_rects:
        print("DESIGN_ELEMENTS:")
        for rect in design_rects:
            print(f"  - {rect['type']}: x={rect['x']}, y={rect['y']}, "
                  f"w={rect['width']}, h={rect['height']}, color={rect['color']}")
        print("")
    
    if impl_rects:
        print("IMPLEMENTATION_ELEMENTS:")
        for rect in impl_rects:
            print(f"  - {rect['type']}: x={rect['x']}, y={rect['y']}, "
                  f"w={rect['width']}, h={rect['height']}, color={rect['color']}")
        print("")
    
    # Find specific game elements by color
    game_colors = ['#DC2626', '#10B981', '#364153']  # Red, green, dark gray
    design_regions = find_color_regions(design_img, game_colors)
    impl_regions = find_color_regions(impl_img, game_colors)
    
    if args.verbose:
        print("DESIGN_COLOR_REGIONS:")
        for region in design_regions:
            print(f"  - {region['color']}: x={region['x']}, y={region['y']}, "
                  f"w={region['width']}, h={region['height']}, pixels={region['pixel_count']}")
        print("")
        
        print("IMPLEMENTATION_COLOR_REGIONS:")
        for region in impl_regions:
            print(f"  - {region['color']}: x={region['x']}, y={region['y']}, "
                  f"w={region['width']}, h={region['height']}, pixels={region['pixel_count']}")
        print("")
    
    # Position differences
    print("📐 LAYOUT ANALYSIS")
    print("")
    
    design_size = design_img.size
    impl_size = impl_img.size
    
    if design_size != impl_size:
        print(f"CANVAS_SIZE: Design {design_size[0]}x{design_size[1]}, "
              f"Implementation {impl_size[0]}x{impl_size[1]}")
        print(f"SIZE_DELTA: {impl_size[0] - design_size[0]:+d}px width, "
              f"{impl_size[1] - design_size[1]:+d}px height")
    else:
        print("CANVAS_SIZE: Identical")
    print("")
    
    print("✅ Analysis complete")


if __name__ == '__main__':
    main()