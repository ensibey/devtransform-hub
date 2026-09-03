import os
from PIL import Image, ImageDraw

def create_icon(size):
    # Create image with dark background and smooth rounded corners
    img = Image.new('RGBA', (size, size), (9, 9, 11, 255))
    draw = ImageDraw.Draw(img)
    
    # Border
    stroke_w = max(1, int(size * 0.04))
    r = int(size * 0.22)
    
    # Outer gradient ring / border
    draw.rounded_rectangle(
        [(stroke_w, stroke_w), (size - stroke_w, size - stroke_w)],
        radius=r,
        outline=(16, 185, 129, 230),
        width=stroke_w
    )
    
    # Center points for Hexagon / Shield
    cx = size // 2
    cy = size // 2
    hex_r = int(size * 0.32)
    
    # Hexagon points
    hex_pts = [
        (cx, cy - hex_r),
        (cx + int(hex_r * 0.866), cy - hex_r // 2),
        (cx + int(hex_r * 0.866), cy + hex_r // 2),
        (cx, cy + hex_r),
        (cx - int(hex_r * 0.866), cy + hex_r // 2),
        (cx - int(hex_r * 0.866), cy - hex_r // 2),
    ]
    draw.polygon(hex_pts, outline=(16, 185, 129, 140), width=max(1, int(size * 0.03)))
    
    # Upload Lightning Arrow (Electric Sky Blue)
    arrow_w = max(2, int(size * 0.07))
    # Vertical line
    arrow_top = cy - int(size * 0.22)
    arrow_bot = cy + int(size * 0.22)
    draw.line([(cx, arrow_top), (cx, arrow_bot)], fill=(56, 189, 248, 255), width=arrow_w)
    
    # Arrow heads
    head_size = int(size * 0.16)
    draw.line([(cx, arrow_top), (cx - head_size, arrow_top + head_size)], fill=(56, 189, 248, 255), width=arrow_w)
    draw.line([(cx, arrow_top), (cx + head_size, arrow_top + head_size)], fill=(56, 189, 248, 255), width=arrow_w)
    
    # Glowing center emerald core
    dot_r = max(2, int(size * 0.06))
    draw.ellipse([(cx - dot_r, cy - dot_r), (cx + dot_r, cy + dot_r)], fill=(16, 185, 129, 255))
    
    return img

os.makedirs('public', exist_ok=True)
os.makedirs('app', exist_ok=True)

# Generate 512x512
icon512 = create_icon(512)
icon512.save('public/icon.png', 'PNG')

# Generate 180x180 Apple touch icon
icon180 = create_icon(180)
icon180.save('public/apple-touch-icon.png', 'PNG')
icon180.save('app/apple-icon.png', 'PNG')

# Generate multi-res favicon.ico
icon16 = create_icon(16)
icon32 = create_icon(32)
icon48 = create_icon(48)

icon32.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
icon32.save('app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

print("Successfully generated all favicons and icons!")
