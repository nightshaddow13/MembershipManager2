from PIL import Image
import numpy as np

figma = np.array(Image.open('figma-exports/game-canvas-design.png').convert('RGB'))
impl = np.array(Image.open('screenshots/game-reloaded-canvas.png').convert('RGB'))

print("=== DETAILED PIXEL COUNT COMPARISON ===\n")

# Count each important color
colors = {
    '#666666 (Background)': (102, 102, 102),
    '#FF0000 (Red Car)': (255, 0, 0),
    '#8B4513 (Brown AUTO SHOP)': (139, 69, 19),
    '#444444 (Dark Walls)': (68, 68, 68),
    '#000000 (Black)': (0, 0, 0),
    '#FFFFFF (White Text)': (255, 255, 255),
}

for name, (r, g, b) in colors.items():
    figma_count = np.sum((figma[:,:,0] == r) & (figma[:,:,1] == g) & (figma[:,:,2] == b))
    impl_count = np.sum((impl[:,:,0] == r) & (impl[:,:,1] == g) & (impl[:,:,2] == b))
    diff = impl_count - figma_count
    pct = (diff / figma_count * 100) if figma_count > 0 else 0
    
    status = "✓" if abs(pct) < 10 else "✗"
    print(f"{status} {name}:")
    print(f"   Figma: {figma_count:,}  |  Impl: {impl_count:,}  |  Diff: {diff:+,} ({pct:+.1f}%)")
    print()