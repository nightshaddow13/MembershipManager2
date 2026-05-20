from PIL import Image
import numpy as np
import sys

# Load images
design = np.array(Image.open('design-exports/game-canvas-design.png').convert('RGB'))
impl = np.array(Image.open('screenshots/game-corrected-canvas.png').convert('RGB'))

print("=== ELEMENT SIZE COMPARISON ===\n")

# Find red car
red_design = ((design[:,:,0] == 255) & (design[:,:,1] == 0) & (design[:,:,2] == 0))
red_impl = ((impl[:,:,0] == 255) & (impl[:,:,1] == 0) & (impl[:,:,2] == 0))

fy, fx = np.where(red_design)
iy, ix = np.where(red_impl)

if len(fy) > 0:
    print(f'RED CAR (Design):')
    print(f'  Position: x={fx.min()}-{fx.max()}, y={fy.min()}-{fy.max()}')
    print(f'  Size: {fx.max()-fx.min()+1}×{fy.max()-fy.min()+1}')
    print(f'  Pixels: {len(fx)}')
    print()
    
if len(iy) > 0:
    print(f'RED CAR (Implementation):')
    print(f'  Position: x={ix.min()}-{ix.max()}, y={iy.min()}-{iy.max()}')
    print(f'  Size: {ix.max()-ix.min()+1}×{iy.max()-iy.min()+1}')
    print(f'  Pixels: {len(ix)}')
    print(f'  DIFFERENCE: {len(iy) - len(fy)} pixels ({(len(iy)/len(fy)-1)*100:.1f}%)')
    print()

# Find brown AUTO SHOP
brown_design = ((design[:,:,0] == 139) & (design[:,:,1] == 69) & (design[:,:,2] == 19))
brown_impl = ((impl[:,:,0] == 139) & (impl[:,:,1] == 69) & (impl[:,:,2] == 19))

by_f, bx_f = np.where(brown_design)
by_i, bx_i = np.where(brown_impl)

if len(by_f) > 0:
    print(f'AUTO SHOP BOX (Design):')
    print(f'  Position: x={bx_f.min()}-{bx_f.max()}, y={by_f.min()}-{by_f.max()}')
    print(f'  Size: {bx_f.max()-bx_f.min()+1}×{by_f.max()-by_f.min()+1}')
    print(f'  Pixels: {len(by_f)}')
    print()
    
if len(by_i) > 0:
    print(f'AUTO SHOP BOX (Implementation):')
    print(f'  Position: x={bx_i.min()}-{bx_i.max()}, y={by_i.min()}-{by_i.max()}')
    print(f'  Size: {bx_i.max()-bx_i.min()+1}×{by_i.max()-by_i.min()+1}')
    print(f'  Pixels: {len(by_i)}')
    print(f'  DIFFERENCE: {len(by_i) - len(by_f)} pixels ({(len(by_i)/len(by_f)-1)*100:.1f}%)')
    print()

# Find black pixels
black_design = ((design[:,:,0] == 0) & (design[:,:,1] == 0) & (design[:,:,2] == 0))
black_impl = ((impl[:,:,0] == 0) & (impl[:,:,1] == 0) & (impl[:,:,2] == 0))

print(f'BLACK PIXELS:')
print(f'  Design: {np.sum(black_design)} pixels')
print(f'  Implementation: {np.sum(black_impl)} pixels')
print(f'  DIFFERENCE: {np.sum(black_impl) - np.sum(black_design)} pixels (too much black!)')
print()

# Find white pixels
white_design = ((design[:,:,0] == 255) & (design[:,:,1] == 255) & (design[:,:,2] == 255))
white_impl = ((impl[:,:,0] == 255) & (impl[:,:,1] == 255) & (impl[:,:,2] == 255))

print(f'WHITE PIXELS (Text):')
print(f'  Design: {np.sum(white_design)} pixels')
print(f'  Implementation: {np.sum(white_impl)} pixels')
print(f'  DIFFERENCE: {np.sum(white_impl) - np.sum(white_design)} pixels')